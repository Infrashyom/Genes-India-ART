import { Request, Response } from 'express';
import { Lead } from '../models/Lead.js';
import { ContactQuery } from '../models/ContactQuery.js';

// --- Leads ---

export const createLead = async (req: Request, res: Response) => {
  try {
    const newLead = new Lead(req.body);
    await newLead.save();
    res.status(201).json({ message: 'Partnership request submitted successfully.', lead: newLead });
  } catch (error: any) {
    res.status(400).json({ error: 'Failed to submit partnership request.', details: error.message });
  }
};

export const getLeads = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const filters: any = {};
    if (req.query.status) filters.status = req.query.status;
    if (req.query.search) {
      filters.$or = [
        { hospitalName: { $regex: req.query.search, $options: 'i' } },
        { contactPerson: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    const total = await Lead.countDocuments(filters);
    const leads = await Lead.find(filters).sort({ createdAt: -1 }).skip(skip).limit(limit);
    
    res.json({ data: leads, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leads.' });
  }
};

export const updateLeadStatus = async (req: Request, res: Response) => {
  try {
    const { status, notes } = req.body;
    const updateData: any = {};
    
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const lead = await Lead.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    if (!lead) return res.status(404).json({ error: 'Lead not found.' });
    res.json(lead);
  } catch (error: any) {
    res.status(400).json({ error: 'Failed to update lead.', details: error.message });
  }
};

// --- Contact Queries ---

export const createContactQuery = async (req: Request, res: Response) => {
  try {
    const newQuery = new ContactQuery(req.body);
    await newQuery.save();
    res.status(201).json({ message: 'Query submitted successfully.' });
  } catch (error: any) {
    res.status(400).json({ error: 'Failed to submit query.', details: error.message });
  }
};

export const getContactQueries = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const filters: any = {};
    if (req.query.search) {
      filters.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
        { subject: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const total = await ContactQuery.countDocuments(filters);
    const queries = await ContactQuery.find(filters).sort({ createdAt: -1 }).skip(skip).limit(limit);
    
    res.json({ data: queries, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch queries.' });
  }
};
