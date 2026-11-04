import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';

const router = Router();

// Strict 5MB file size limit
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Configure Cloudinary with individual credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET
);

router.post('/', (req: Request, res: Response, next: NextFunction) => {
  upload.single('file')(req, res, async (err: any) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ 
          error: 'File size exceeds 5MB limit. Please upload a file smaller than 5MB.' 
        });
      }
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ error: err.message || 'File upload error.' });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      if (req.file.size > 5 * 1024 * 1024) {
        return res.status(400).json({ 
          error: 'File size exceeds 5MB limit. Please upload a file smaller than 5MB.' 
        });
      }

      const ext = path.extname(req.file.originalname).toLowerCase();
      const isHeic = ext === '.heic' || ext === '.heif' || req.file.mimetype === 'image/heic' || req.file.mimetype === 'image/heif';
      let mimetype = req.file.mimetype;
      if (isHeic && (!mimetype || mimetype === 'application/octet-stream')) {
        mimetype = 'image/heic';
      }

      if (!isCloudinaryConfigured) {
        console.warn('⚠️ Cloudinary credentials not detected in env. Falling back to data URI.');
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = "data:" + mimetype + ";base64," + b64;
        return res.json({ secure_url: dataURI, public_id: 'local_' + Date.now() });
      }

      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = "data:" + mimetype + ";base64," + b64;

      const uploadOptions: any = {
        resource_type: 'auto',
        folder: 'genes_india'
      };

      // If HEIC/HEIF, convert format to JPG on Cloudinary for universal browser rendering
      if (isHeic) {
        uploadOptions.format = 'jpg';
      }

      const result = await cloudinary.uploader.upload(dataURI, uploadOptions);

      res.json({ secure_url: result.secure_url, public_id: result.public_id });
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      res.status(500).json({ error: 'Cloudinary upload failed' });
    }
  });
});

export default router;
