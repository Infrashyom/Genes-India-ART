import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Donor } from '../models/Donor.js';
import { AuthRequest } from '../middleware/auth.js';

export const getDonors = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt((req.query.page || req.query.pageNumber) as string) || 1;
    const pageSize = parseInt((req.query.pageSize || req.query.limit) as string) || 10;
    const skip = (page - 1) * pageSize;

    const filters: any = {};
    const isHospital = req.user?.role === 'hospital';

    if (isHospital) {
      filters.status = 'Active';
    } else if (req.query.status) {
      filters.status = req.query.status;
    }

    // If gamete/donor type is specified, filter by it
    if (req.query.donorType) {
      filters.donorType = req.query.donorType;
    }

    // Rh Factor filter (+ or -)
    if (req.query.rhFactor && req.query.rhFactor !== 'Any') {
      const rh = req.query.rhFactor === 'Positive' || req.query.rhFactor === '+' ? '+' : '-';
      filters.bloodGroup = { $regex: `\\${rh}$` };
    }

    // Age bounds
    if (req.query.minAge || req.query.maxAge) {
      filters.age = {};
      if (req.query.minAge) filters.age.$gte = Number(req.query.minAge);
      if (req.query.maxAge) filters.age.$lte = Number(req.query.maxAge);
    }

    // Height bounds
    if (req.query.minHeight || req.query.maxHeight) {
      filters.height = {};
      if (req.query.minHeight) filters.height.$gte = Number(req.query.minHeight);
      if (req.query.maxHeight) filters.height.$lte = Number(req.query.maxHeight);
    }

    // Hair color
    if (req.query.hairColor && req.query.hairColor !== 'Any') {
      filters.hairColor = { $regex: req.query.hairColor as string, $options: 'i' };
    }

    // Genetic / Medical Clearance
    if (req.query.geneticOnly === 'true' || req.query.clearanceOnly === 'true') {
      filters.geneticClearance = true;
      filters.medicalClearance = true;
    }

    if (req.query.search) {
      const searchRegex = { $regex: req.query.search as string, $options: 'i' };
      const searchFilters = [
        { donorCode: searchRegex },
        { bloodGroup: searchRegex },
        { profession: searchRegex },
        { education: searchRegex }
      ];
      if (filters.$or) {
        filters.$and = [{ $or: filters.$or }, { $or: searchFilters }];
        delete filters.$or;
      } else {
        filters.$or = searchFilters;
      }
    }

    // For hospitals, select only non-identifying fields to adhere to ART Act privacy guidelines
    const projection = isHospital 
      ? 'donorCode donorType bloodGroup rhFactor age height weight complexion skinTone eyeColor hairColor education profession medicalClearance geneticClearance amh status createdAt'
      : '';

    if (isHospital) {
      // Fetch all eligible active donors to compute dynamic match percentage scores
      const donors = await Donor.find(filters, projection).lean();

      const requestedBg = (req.query.bloodGroup as string || '').trim();
      const requestedSkin = (req.query.skinTone as string || '').trim();
      const requestedEyes = (req.query.eyeColor as string || '').trim();
      const requestedHair = (req.query.hairColor as string || '').trim();
      const requestedHeight = req.query.minHeight ? Number(req.query.minHeight) : null;
      const requestedEdu = (req.query.education as string || '').trim();
      const minAge = req.query.minAge ? Number(req.query.minAge) : null;
      const maxAge = req.query.maxAge ? Number(req.query.maxAge) : null;

      const hasCriteria = Boolean(
        requestedBg || 
        (requestedSkin && requestedSkin !== 'Any') || 
        (requestedEyes && requestedEyes !== 'Any') || 
        (requestedHair && requestedHair !== 'Any') ||
        requestedHeight || 
        (requestedEdu && requestedEdu !== 'Any') ||
        minAge ||
        maxAge
      );

      const scoredDonors = donors.map((donor: any) => {
        let bloodGroupPoints = 25;
        let skinTonePoints = 15;
        let eyeColorPoints = 15;
        let hairColorPoints = 10;
        let heightPoints = 15;
        let educationPoints = 10;
        const clearancePoints = 10; // Baseline verified medical & genetic screening

        const matchDetails: any = {
          bloodGroup: true,
          skinTone: true,
          eyeColor: true,
          hairColor: true,
          height: true,
          education: true,
          ageRange: true
        };

        // 1. Blood group matching (30% weight)
        if (requestedBg) {
          if (donor.bloodGroup?.toUpperCase() === requestedBg.toUpperCase()) {
            bloodGroupPoints = 30;
            matchDetails.bloodGroup = true;
          } else if (donor.bloodGroup && donor.bloodGroup.replace(/[+-]/, '') === requestedBg.replace(/[+-]/, '')) {
            bloodGroupPoints = 18; // Same ABO type, different Rh
            matchDetails.bloodGroup = false;
          } else if (donor.bloodGroup === 'O-' || donor.bloodGroup === 'O+') {
            bloodGroupPoints = 15; // Universal donor
            matchDetails.bloodGroup = false;
          } else {
            bloodGroupPoints = 0;
            matchDetails.bloodGroup = false;
          }
        }

        // 2. Skin tone / complexion matching (20% weight)
        if (requestedSkin && requestedSkin !== 'Any') {
          const donorTone = (donor.skinTone || donor.complexion || '').toLowerCase();
          const targetTone = requestedSkin.toLowerCase();
          if (donorTone === targetTone) {
            skinTonePoints = 20;
            matchDetails.skinTone = true;
          } else if (
            (donorTone.includes('wheatish') && targetTone.includes('medium')) ||
            (donorTone.includes('medium') && targetTone.includes('wheatish')) ||
            (donorTone.includes('fair') && targetTone.includes('wheatish'))
          ) {
            skinTonePoints = 10;
            matchDetails.skinTone = false;
          } else {
            skinTonePoints = 0;
            matchDetails.skinTone = false;
          }
        }

        // 3. Eye color matching (15% weight)
        if (requestedEyes && requestedEyes !== 'Any') {
          const donorEyes = (donor.eyeColor || '').toLowerCase();
          const targetEyes = requestedEyes.toLowerCase();
          if (donorEyes === targetEyes) {
            eyeColorPoints = 15;
            matchDetails.eyeColor = true;
          } else {
            eyeColorPoints = 0;
            matchDetails.eyeColor = false;
          }
        }

        // 4. Hair color matching (10% weight)
        if (requestedHair && requestedHair !== 'Any') {
          const donorHair = (donor.hairColor || '').toLowerCase();
          const targetHair = requestedHair.toLowerCase();
          if (donorHair.includes(targetHair) || targetHair.includes(donorHair)) {
            hairColorPoints = 10;
            matchDetails.hairColor = true;
          } else {
            hairColorPoints = 2;
            matchDetails.hairColor = false;
          }
        }

        // 5. Age range matching
        if (minAge || maxAge) {
          const donorAge = Number(donor.age) || 25;
          const withinMin = !minAge || donorAge >= minAge;
          const withinMax = !maxAge || donorAge <= maxAge;
          matchDetails.ageRange = withinMin && withinMax;
        }

        // 6. Height matching (15% weight)
        if (requestedHeight) {
          const donorHeight = Number(donor.height) || 0;
          if (donorHeight >= requestedHeight) {
            heightPoints = 15;
            matchDetails.height = true;
          } else if (donorHeight >= requestedHeight - 3) {
            heightPoints = 10;
            matchDetails.height = true;
          } else {
            heightPoints = 2;
            matchDetails.height = false;
          }
        }

        // 7. Education matching (10% weight)
        if (requestedEdu && requestedEdu !== 'Any') {
          const eduStr = `${donor.education || ''} ${donor.profession || ''}`.toLowerCase();
          const targetEdu = requestedEdu.toLowerCase();
          if (eduStr.includes(targetEdu)) {
            educationPoints = 10;
            matchDetails.education = true;
          } else {
            educationPoints = 3;
            matchDetails.education = false;
          }
        }

        let totalScore = bloodGroupPoints + skinTonePoints + eyeColorPoints + hairColorPoints + heightPoints + educationPoints + clearancePoints;

        // If no specific criteria were filtered, provide high baseline match score (94% - 99%)
        if (!hasCriteria) {
          totalScore = 95 + ((donor.donorCode.charCodeAt(donor.donorCode.length - 1) % 5));
        }

        return {
          ...donor,
          matchScore: Math.min(100, Math.max(50, Math.round(totalScore))),
          matchDetails
        };
      });

      // Sort by highest match score descending so top matches appear first
      scoredDonors.sort((a, b) => {
        if (b.matchScore !== a.matchScore) {
          return b.matchScore - a.matchScore;
        }
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      });

      const total = scoredDonors.length;
      const totalPages = Math.ceil(total / pageSize);
      const paginated = scoredDonors.slice(skip, skip + pageSize);

      return res.json({
        data: paginated,
        total,
        page,
        pageSize,
        totalPages
      });
    }

    // For Admin / Staff: standard query with pagination
    if (req.query.bloodGroup) filters.bloodGroup = req.query.bloodGroup;
    if (req.query.skinTone && req.query.skinTone !== 'Any') {
      filters.$or = [
        { skinTone: { $regex: req.query.skinTone as string, $options: 'i' } },
        { complexion: { $regex: req.query.skinTone as string, $options: 'i' } }
      ];
    }
    if (req.query.eyeColor && req.query.eyeColor !== 'Any') {
      filters.eyeColor = { $regex: req.query.eyeColor as string, $options: 'i' };
    }
    if (req.query.minHeight) {
      filters.height = { $gte: Number(req.query.minHeight) };
    }
    if (req.query.education && req.query.education !== 'Any') {
      filters.education = { $regex: req.query.education as string, $options: 'i' };
    }

    const total = await Donor.countDocuments(filters);
    const donors = await Donor.find(filters, projection)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    res.json({
      data: donors,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch donors.' });
  }
};

export const getDonorById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const isHospital = req.user?.role === 'hospital';
    const projection = isHospital 
      ? 'donorCode donorType bloodGroup rhFactor age height weight complexion skinTone eyeColor hairColor education profession medicalClearance geneticClearance amh status createdAt'
      : '';

    let donor = null;
    if (mongoose.isValidObjectId(id)) {
      donor = await Donor.findById(id, projection);
    }
    if (!donor) {
      donor = await Donor.findOne({ donorCode: id }, projection);
    }
    if (!donor) return res.status(404).json({ error: 'Donor not found.' });
    res.json(donor);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch donor.' });
  }
};

export const checkDonorCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const { excludeId } = req.query;
    const query: any = { donorCode: code };
    if (excludeId && excludeId !== 'new' && excludeId !== '') {
      if (mongoose.isValidObjectId(excludeId as string)) {
        query._id = { $ne: excludeId };
      } else {
        query.donorCode = { $ne: excludeId };
      }
    }
    const existing = await Donor.findOne(query);
    res.json({ exists: !!existing });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check donor code.' });
  }
};

export const createDonor = async (req: Request, res: Response) => {
  try {
    if (req.body.donorCode) {
      const existing = await Donor.findOne({ donorCode: req.body.donorCode });
      if (existing) {
        return res.status(400).json({ error: `Donor ID "${req.body.donorCode}" already exists. Please choose a different number.` });
      }
    }
    const newDonor = new Donor(req.body);
    await newDonor.save();
    res.status(201).json(newDonor);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ error: `Donor ID "${req.body.donorCode}" already exists. Please choose a different number.` });
    }
    res.status(400).json({ error: 'Failed to create donor.', details: error.message });
  }
};

export const updateDonor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let query: any = {};
    if (mongoose.isValidObjectId(id)) {
      query._id = id;
    } else {
      query.donorCode = id;
    }

    const targetDonor = await Donor.findOne(query);
    if (!targetDonor) return res.status(404).json({ error: 'Donor not found.' });

    if (req.body.donorCode) {
      const existing = await Donor.findOne({
        donorCode: req.body.donorCode,
        _id: { $ne: targetDonor._id }
      });
      if (existing) {
        return res.status(400).json({ error: `Donor ID "${req.body.donorCode}" already exists. Please choose a different number.` });
      }
    }

    const donor = await Donor.findByIdAndUpdate(
      targetDonor._id,
      { $set: req.body },
      { new: true, runValidators: false }
    );
    if (!donor) return res.status(404).json({ error: 'Donor not found.' });
    res.json(donor);
  } catch (error: any) {
    res.status(400).json({ error: 'Failed to update donor.', details: error.message });
  }
};
