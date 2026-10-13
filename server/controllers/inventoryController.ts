import { Request, Response } from 'express';
import { Inventory } from '../models/Inventory.js';
import { Donor } from '../models/Donor.js';

export const getInventory = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const filters: any = {};
    if (req.query.status) filters.status = req.query.status;
    if (req.query.tank) filters.tank = req.query.tank;

    // Check if donor-level filters are applied
    const donorQuery: any = {};
    if (req.query.bloodGroup) donorQuery.bloodGroup = req.query.bloodGroup;
    if (req.query.donorType) donorQuery.donorType = req.query.donorType;
    if (req.query.gender) donorQuery.gender = req.query.gender;
    if (req.query.branch) donorQuery.branch = req.query.branch;
    if (req.query.skinTone) {
      donorQuery.$or = [
        { skinTone: req.query.skinTone },
        { complexion: req.query.skinTone }
      ];
    }
    if (req.query.eyeColor) donorQuery.eyeColor = req.query.eyeColor;
    if (req.query.hairColor) donorQuery.hairColor = req.query.hairColor;

    if (req.query.ageMin || req.query.ageMax) {
      donorQuery.age = {};
      if (req.query.ageMin) donorQuery.age.$gte = parseInt(req.query.ageMin as string);
      if (req.query.ageMax) donorQuery.age.$lte = parseInt(req.query.ageMax as string);
    }

    if (req.query.medicalClearance !== undefined && req.query.medicalClearance !== '') {
      donorQuery.medicalClearance = req.query.medicalClearance === 'true';
    }

    if (req.query.geneticClearance !== undefined && req.query.geneticClearance !== '') {
      donorQuery.geneticClearance = req.query.geneticClearance === 'true';
    }

    let donorIds: any[] | null = null;
    if (Object.keys(donorQuery).length > 0) {
      const matchingDonors = await Donor.find(donorQuery).select('_id');
      donorIds = matchingDonors.map(d => d._id);
      filters.donor = { $in: donorIds };
    }

    if (req.query.search) {
      const searchRegex = { $regex: req.query.search as string, $options: 'i' };
      const matchingDonorsByCode = await Donor.find({
        $or: [
          { donorCode: searchRegex },
          { bloodGroup: searchRegex },
          { 'edrData.basic.firstName': searchRegex },
          { 'edrData.basic.lastName': searchRegex }
        ]
      }).select('_id');
      const searchDonorIds = matchingDonorsByCode.map(d => d._id);

      const searchConditions = [
        { vialId: searchRegex },
        { tank: searchRegex },
        { canister: searchRegex },
        { cane: searchRegex },
        { colorCode: searchRegex },
        { donor: { $in: searchDonorIds } }
      ];

      if (filters.donor) {
        filters.$and = [
          { donor: filters.donor },
          { $or: searchConditions }
        ];
        delete filters.donor;
      } else {
        filters.$or = searchConditions;
      }
    }
    
    const total = await Inventory.countDocuments(filters);
    const items = await Inventory.find(filters)
      .populate('donor', 'donorCode donorType gender bloodGroup age height weight eyeColor hairColor complexion skinTone education profession branch status medicalClearance geneticClearance edrData')
      .sort({ createdAt: -1 })
      .skip(skip).limit(limit);
      
    res.json({ data: items, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('getInventory error:', error);
    res.status(500).json({ error: 'Failed to fetch inventory.' });
  }
};

export const addVial = async (req: Request, res: Response) => {
  try {
    const newVial = new Inventory(req.body);
    await newVial.save();
    
    const populatedVial = await Inventory.findById(newVial._id).populate('donor', 'donorCode');
    res.status(201).json(populatedVial);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Vial ID already exists.' });
    }
    res.status(400).json({ error: 'Failed to add to inventory.', details: error.message });
  }
};

export const updateVialStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Status is required.' });

    const vial = await Inventory.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true, runValidators: true }
    ).populate('donor', 'donorCode');
    
    if (!vial) return res.status(404).json({ error: 'Vial not found.' });
    res.json(vial);
  } catch (error: any) {
    res.status(400).json({ error: 'Failed to update vial status.', details: error.message });
  }
};
