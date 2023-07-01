const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET ,
});

router.post('/upload', upload.single('video'), async (req, res) => {
    console.log('video ')
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'video',
    });
    res.json(result);
    console,log('video uploaded ')
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload video' });
  }
});

router.get('/video/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const url = cloudinary.url(id, {
      resource_type: 'video',
      transformation: [{ streaming_profile: 'hd' }],
    });
    res.json({ url });
  } catch (error) {
    res.status(404).json({ error: 'Video not found' });
  }
});

module.exports = router;
