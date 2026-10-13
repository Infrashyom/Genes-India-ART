import { Router } from 'express';
import { User } from '../models/User.js';
import { Blog } from '../models/Blog.js';
import { Gallery } from '../models/Gallery.js';
import { Founder } from '../models/Founder.js';
import { Review } from '../models/Review.js';
import { Setting } from '../models/Setting.js';
import authRoutes from './auth.js';
import donorRoutes from './donors.js';
import inventoryRoutes from './inventory.js';
import requestRoutes from './requests.js';
import taskRoutes from './tasks.js';
import crmRoutes from './crm.js';
import analyticsRoutes from './analytics.js';
import uploadRoutes from './upload.js';

const router = Router();

// Mount authentication routes
router.use('/auth', authRoutes);

// Mount core entity routes
router.use('/donors', donorRoutes);
router.use('/inventory', inventoryRoutes);

// Mount workflow routes
router.use('/requests', requestRoutes);
router.use('/tasks', taskRoutes);

// Mount CRM routes
router.use('/crm', crmRoutes);

// Mount Analytics routes
router.use('/analytics', analyticsRoutes);

// Mount Upload route
router.use('/upload', uploadRoutes);

// Basic health check route
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend API is running' });
});

// Example route for users
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const filters: any = {};
    if (req.query.search) {
      filters.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const total = await User.countDocuments(filters);
    const users = await User.find(filters).sort({ createdAt: -1 }).skip(skip).limit(limit);
    res.json({ data: users, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.post('/users', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create user' });
  }
});


router.put('/users/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update user' });
  }
});

router.patch('/users/:id/status', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.role === 'admin') return res.status(403).json({ error: 'Admins cannot be banned' });
    user.status = user.status === 'Active' ? 'Banned' : 'Active';
    // bypass password hashing for status update since we only save status
    await User.updateOne({ _id: user._id }, { status: user.status });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update user status' });
  }
});


router.put('/blogs/:id', async (req, res) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedBlog);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update blog' });
  }
});

router.delete('/blogs/:id', async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete blog' });
  }
});


router.get('/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch blog' });
  }
});


// Blog Routes
router.get('/blogs', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const filters: any = {};
    if (req.query.search) {
      filters.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { author: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const total = await Blog.countDocuments(filters);
    const blogs = await Blog.find(filters).sort({ createdAt: -1 }).skip(skip).limit(limit);
    res.json({ data: blogs, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

router.post('/blogs', async (req, res) => {
  try {
    const newBlog = new Blog(req.body);
    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create blog' });
  }
});

// Gallery Routes
router.get('/gallery', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const total = await Gallery.countDocuments();
    const images = await Gallery.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    res.json({ data: images, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
});

router.post('/gallery', async (req, res) => {
  try {
    const newImage = new Gallery(req.body);
    await newImage.save();
    res.status(201).json(newImage);
  } catch (error) {
    res.status(400).json({ error: 'Failed to add image' });
  }
});

router.delete('/gallery/:id', async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete image' });
  }
});


// Founder Routes
router.get('/founders', async (req, res) => {
  try {
    const founders = await Founder.find().sort({ displayOrder: 1 });
    res.json(founders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch founders' });
  }
});

router.post('/founders', async (req, res) => {
  try {
    const newFounder = new Founder(req.body);
    await newFounder.save();
    res.status(201).json(newFounder);
  } catch (error) {
    res.status(400).json({ error: 'Failed to add founder' });
  }
});

router.put('/founders/:id', async (req, res) => {
  try {
    const updated = await Founder.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update founder' });
  }
});

router.delete('/founders/:id', async (req, res) => {
  try {
    await Founder.findByIdAndDelete(req.params.id);
    res.json({ message: 'Founder deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete founder' });
  }
});


// Review Routes
router.get('/reviews', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const total = await Review.countDocuments();
    const reviews = await Review.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    res.json({ data: reviews, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

router.post('/reviews', async (req, res) => {
  try {
    const newReview = new Review(req.body);
    await newReview.save();
    res.status(201).json(newReview);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create review' });
  }
});

router.put('/reviews/:id', async (req, res) => {
  try {
    const updated = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update review' });
  }
});

router.delete('/reviews/:id', async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete review' });
  }
});


// Settings Routes
router.get('/settings', async (req, res) => {
  try {
    const settings = await Setting.find();
    const settingsObj = {};
    settings.forEach(s => {
      settingsObj[s.key] = s.value;
    });
    res.json(settingsObj);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

router.put('/settings', async (req, res) => {
  try {
    const updates = req.body;
    for (const key of Object.keys(updates)) {
      await Setting.findOneAndUpdate(
        { key },
        { value: updates[key], updatedAt: new Date() },
        { upsert: true, new: true }
      );
    }
    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to update settings' });
  }
});

export default router;
