import { Request, Response } from 'express';
import { Task } from '../models/Task.js';
import { AuthRequest } from '../middleware/auth.js';

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const filters: any = {};
    
    // Optional filters
    if (req.query.status) filters.status = req.query.status;
    if (req.query.priority) filters.priority = req.query.priority;
    if (req.query.assignedToMe === 'true') filters.assignedTo = req.user?.id;

    const tasks = await Task.find(filters)
      .populate('assignedTo', 'name')
      .populate('relatedDonor', 'donorCode')
      .populate('relatedRequest', 'requestId')
      .sort({ dueDate: 1, createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks.' });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error: any) {
    res.status(400).json({ error: 'Failed to create task.', details: error.message });
  }
};

export const updateTaskStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Status is required.' });

    const task = await Task.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true, runValidators: true }
    );
    
    if (!task) return res.status(404).json({ error: 'Task not found.' });
    res.json(task);
  } catch (error: any) {
    res.status(400).json({ error: 'Failed to update task.', details: error.message });
  }
};
