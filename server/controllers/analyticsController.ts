import { Request, Response } from 'express';
import { User } from '../models/User.js';
import { Donor } from '../models/Donor.js';
import { SampleRequest } from '../models/SampleRequest.js';
import { Inventory } from '../models/Inventory.js';

export const getAdminOverview = async (req: Request, res: Response) => {
  try {
    const currentYear = new Date().getFullYear();
    const selectedYear = parseInt(req.query.year as string) || currentYear;

    const startOfYear = new Date(Date.UTC(selectedYear, 0, 1, 0, 0, 0));
    const endOfYear = new Date(Date.UTC(selectedYear, 11, 31, 23, 59, 59, 999));

    const [
      activeHospitals, 
      verifiedDonors, 
      sampleRequests, 
      totalDonors, 
      yearRequests,
      allRequestsWithDonors,
      earliestRequest,
      donorsByBlood
    ] = await Promise.all([
      User.countDocuments({ role: 'hospital' }),
      Donor.countDocuments({ status: 'Active' }),
      SampleRequest.countDocuments(),
      Donor.countDocuments(),
      SampleRequest.find({
        createdAt: { $gte: startOfYear, $lte: endOfYear }
      }),
      SampleRequest.find().populate('donor', 'bloodGroup donorType'),
      SampleRequest.findOne().sort({ createdAt: 1 }).select('createdAt'),
      Donor.aggregate([
        { $match: { bloodGroup: { $exists: true, $ne: '' } } },
        { $group: { _id: '$bloodGroup', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ]);

    // Available years for dropdown
    const earliestYear = earliestRequest?.createdAt ? new Date(earliestRequest.createdAt).getFullYear() : currentYear;
    const minYear = Math.min(earliestYear, currentYear - 3);
    const availableYears: number[] = [];
    for (let y = currentYear; y >= minYear; y--) {
      availableYears.push(y);
    }
    if (!availableYears.includes(selectedYear)) {
      availableYears.push(selectedYear);
      availableYears.sort((a, b) => b - a);
    }

    // 12 months data for the selected full year
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const chartData = monthNames.map((name, index) => {
      const monthRequests = yearRequests.filter(r => new Date(r.createdAt).getMonth() === index);
      const requestCount = monthRequests.length;
      const matchCount = monthRequests.filter(r => ['Approved', 'Dispatched', 'Delivered', 'Completed'].includes(r.status)).length;
      return {
        name,
        requests: requestCount,
        matches: matchCount
      };
    });

    // Compute real "Most Requested Trait"
    let mostRequestedTrait = {
      trait: 'Blood Group O+',
      stat: 'High Hospital Demand',
      description: 'Frequently requisitioned across ART protocols and IVF cycles.'
    };

    const bloodGroupCounts: Record<string, number> = {};
    let totalRequestsWithDonor = 0;

    allRequestsWithDonors.forEach((req: any) => {
      const bg = req.donor?.bloodGroup;
      if (bg) {
        bloodGroupCounts[bg] = (bloodGroupCounts[bg] || 0) + 1;
        totalRequestsWithDonor++;
      }
    });

    if (totalRequestsWithDonor > 0) {
      let topBg = 'O+';
      let maxCount = 0;
      for (const [bg, count] of Object.entries(bloodGroupCounts)) {
        if (count > maxCount) {
          maxCount = count;
          topBg = bg;
        }
      }
      const pct = Math.round((maxCount / totalRequestsWithDonor) * 100);
      mostRequestedTrait = {
        trait: `Blood Group ${topBg}`,
        stat: `Appeared in ${pct}% of requisitions`,
        description: `Most frequently requested donor phenotype for hospital allocations.`
      };
    } else if (donorsByBlood.length > 0) {
      const topDonorBg = donorsByBlood[0];
      const pct = Math.round((topDonorBg.count / (totalDonors || 1)) * 100);
      mostRequestedTrait = {
        trait: `Blood Group ${topDonorBg._id}`,
        stat: `${pct}% of donor registry`,
        description: `Highest donor inventory availability for partner clinic matching.`
      };
    }

    const data = {
      activeHospitals,
      verifiedDonors,
      sampleRequests,
      selectedYear,
      availableYears,
      chartData,
      mostRequestedTrait
    };

    res.json(data);
  } catch (error) {
    console.error('Error fetching analytics overview:', error);
    res.status(500).json({ message: 'Error fetching analytics overview' });
  }
};
