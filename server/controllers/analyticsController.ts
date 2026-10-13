import { Request, Response } from 'express';

export const getAdminOverview = async (req: Request, res: Response) => {
  try {
    // Returning mock data for now as per instructions
    const mockData = {
      activeHospitals: 124,
      verifiedDonors: 845,
      sampleRequests: 3210,
      chartData: [
        { name: 'Jan', requests: 120, matches: 80 },
        { name: 'Feb', requests: 210, matches: 150 },
        { name: 'Mar', requests: 180, matches: 140 },
        { name: 'Apr', requests: 290, matches: 200 },
        { name: 'May', requests: 240, matches: 170 },
        { name: 'Jun', requests: 340, matches: 280 },
      ],
      aiMatchPipeline: [
        { stage: 'Total Donors Screened', count: 4500, percentage: 100 },
        { stage: 'Medical Clearance Passed', count: 2800, percentage: 62 },
        { stage: 'Genetic Screening Passed', count: 1200, percentage: 26 },
        { stage: 'Active Inventory', count: 845, percentage: 18 },
      ]
    };

    res.json(mockData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analytics overview' });
  }
};
