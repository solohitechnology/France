const express = require('express');
const multer = require('multer');
const router = express.Router();
const Testimonial = require('../model/testimonial')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({ storage });


router.post('/testimonials', upload.single('picture'), async (req, res) => {
  try {
    const { name, email, testimonial, country } = req.body;
    const picture = req.file.filename;

    const newTestimonial = new Testimonial({ name, email, testimonial, picture, country });
    console.log(country)
    await newTestimonial.save();

    res.status(200).json({ message: 'Testimonial submitted successfully! '  });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Testimonial submission failed.' });
  }
});


router.get('/testimonials', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({}).exec();
    res.status(200).json(testimonials);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to retrieve testimonials.' });
  }
});


module.exports = router;
