import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { SampleRequest } from '../models/SampleRequest.js';
import { Donor } from '../models/Donor.js';
import { AuthRequest } from '../middleware/auth.js';

export const getRequests = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const user = req.user;
    let filters: any = {};
    
    if (user?.role === 'hospital') {
      filters.hospital = user.id;
    }

    if (req.query.status) {
      const statusQuery = req.query.status as string;
      if (statusQuery.includes(',')) {
        filters.status = { $in: statusQuery.split(',').map(s => s.trim()) };
      } else {
        filters.status = statusQuery;
      }
    }
    
    if (req.query.search) {
      const searchRegex = { $regex: req.query.search as string, $options: 'i' };
      filters.$or = [
        { requestId: searchRegex },
        { patientName: searchRegex },
        { doctorName: searchRegex }
      ];
    }

    const total = await SampleRequest.countDocuments(filters);
    const requests = await SampleRequest.find(filters)
      .populate('hospital', 'name email phone')
      .populate('donor', 'donorCode bloodGroup donorType complexion skinTone eyeColor hairColor age height education profession')
      .sort({ createdAt: -1 })
      .skip(skip).limit(limit);

    res.json({ data: requests, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sample requests.' });
  }
};

export const getRequestById = async (req: AuthRequest, res: Response) => {
  try {
    const request = await SampleRequest.findById(req.params.id)
      .populate('hospital', 'name email phone')
      .populate('donor', 'donorCode bloodGroup donorType complexion skinTone eyeColor hairColor age height education profession');
      
    if (!request) return res.status(404).json({ error: 'Request not found.' });
    
    // Check access (Hospitals can only view their own)
    if (req.user?.role === 'hospital' && request.hospital._id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch request details.' });
  }
};

export const createRequest = async (req: AuthRequest, res: Response) => {
  try {
    let donorId = req.body.donor;
    
    // If donor was passed as a donorCode (e.g., DON-O-112), resolve to ObjectId
    if (!mongoose.isValidObjectId(donorId)) {
      const donorDoc = await Donor.findOne({ donorCode: donorId });
      if (donorDoc) {
        donorId = donorDoc._id;
      } else {
        return res.status(400).json({ error: `Selected donor with code "${donorId}" was not found.` });
      }
    }

    // Generate clean unique request ID
    const count = await SampleRequest.countDocuments();
    const requestId = `REQ-${new Date().getFullYear()}-${(count + 101).toString().padStart(3, '0')}`;
    
    const requestData = {
      ...req.body,
      donor: donorId,
      requestId,
      hospital: req.user?.id,
      status: 'Under Review',
      shippingDetails: {
        carrier: 'CryoPort Cold Chain Logistics',
        shipperId: `DS-${Math.floor(100 + Math.random() * 900)}`,
        tempLog: '-196°C LN2 Vapor Phase',
        currentLocation: 'Central ART Cryo Vault',
        eta: '3-4 Business Days after approval'
      }
    };

    const newRequest = new SampleRequest(requestData);
    await newRequest.save();
    
    const populatedRequest = await SampleRequest.findById(newRequest._id)
      .populate('donor', 'donorCode bloodGroup donorType');

    res.status(201).json(populatedRequest || newRequest);
  } catch (error: any) {
    console.error('Error creating sample request:', error);
    res.status(400).json({ error: 'Failed to create request.', details: error.message });
  }
};

export const updateRequestStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status, remarks, shippingDetails } = req.body;
    const updateData: any = {};
    
    if (status) {
      updateData.status = status;
      if (status === 'Dispatched') {
        updateData['shippingDetails.dispatchedAt'] = new Date();
        updateData['shippingDetails.currentLocation'] = 'In Transit - Validated Cold Chain';
      } else if (status === 'Delivered') {
        updateData['shippingDetails.deliveredAt'] = new Date();
        updateData['shippingDetails.currentLocation'] = 'Delivered to Hospital IVF Laboratory';
      }
    }
    
    if (remarks !== undefined) updateData.remarks = remarks;

    if (shippingDetails) {
      if (shippingDetails.carrier) updateData['shippingDetails.carrier'] = shippingDetails.carrier;
      if (shippingDetails.shipperId) updateData['shippingDetails.shipperId'] = shippingDetails.shipperId;
      if (shippingDetails.trackingNumber) updateData['shippingDetails.trackingNumber'] = shippingDetails.trackingNumber;
      if (shippingDetails.eta) updateData['shippingDetails.eta'] = shippingDetails.eta;
      if (shippingDetails.currentLocation) updateData['shippingDetails.currentLocation'] = shippingDetails.currentLocation;
    }

    const request = await SampleRequest.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, runValidators: true }
    ).populate('donor', 'donorCode bloodGroup').populate('hospital', 'name email');
    
    if (!request) return res.status(404).json({ error: 'Request not found.' });
    res.json(request);
  } catch (error: any) {
    res.status(400).json({ error: 'Failed to update request status.', details: error.message });
  }
};

export const addRequestDocument = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, type, url } = req.body;

    if (!name || !url) {
      return res.status(400).json({ error: 'Document name and URL are required.' });
    }

    const request = await SampleRequest.findById(id);
    if (!request) return res.status(404).json({ error: 'Request not found.' });

    // Ensure hospital owns this request
    if (req.user?.role === 'hospital' && request.hospital.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    // Add document
    request.documents.push({
      name,
      type: type || 'PDF',
      url,
      status: 'Pending Review'
    } as any);

    // If request was in "Documents Requested" state, move it back to "Under Review"
    if (request.status === 'Documents Requested') {
      request.status = 'Under Review';
    }

    await request.save();
    
    const updated = await SampleRequest.findById(id)
      .populate('donor', 'donorCode bloodGroup')
      .populate('hospital', 'name email');

    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: 'Failed to add document.', details: error.message });
  }
};

export const reportClinicalOutcome = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { cycleStatus, pregnancyConfirmed, notes } = req.body;

    const request = await SampleRequest.findById(id);
    if (!request) return res.status(404).json({ error: 'Request not found.' });

    if (req.user?.role === 'hospital' && request.hospital.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    request.clinicalOutcome = {
      cycleStatus: cycleStatus || 'Completed',
      pregnancyConfirmed: Boolean(pregnancyConfirmed),
      notes: notes || '',
      reportedAt: new Date()
    };

    if (request.status === 'Delivered') {
      request.status = 'Completed';
    }

    await request.save();
    res.json(request);
  } catch (error: any) {
    res.status(400).json({ error: 'Failed to record outcome.', details: error.message });
  }
};
