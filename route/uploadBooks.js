const multer = require('multer');
const fs = require('fs')
const path = require('path');
const mime = require('mime');
const express = require('express');
const router = express.Router();
const File = require('../model/file_Book')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage }).fields([{ name: 'picture' }, { name: 'pdf' }])


router.post('/upload-book', upload, async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const pictureFile = req.files['picture'] ? req.files['picture'][0] : null;
    const pdfFile = req.files['pdf'] ? req.files['pdf'][0] : null;

    const file = new File({
      name,
      price,
      description,
      picture: pictureFile ? {
        filename: pictureFile.filename,
        mimetype: pictureFile.mimetype,
        path: pictureFile.path,
      } : null,
      pdf: pdfFile ? {
        filename: pdfFile.filename,
        mimetype: pdfFile.mimetype,
        path: pdfFile.path,
      } : null,
    });

    await file.save();

    res.json({ success: true, file, massage: 'File upload successfuly' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: 'Failed to upload file' });
  }
});


//////////////////////////////////////////////////////////////////////////////////////////////////////////////

//get all file

router.get('/files', async (req, res) => {
  try {
    const files = await File.find();
    console.log('solohitechnology book')
    res.status(200).json({ success: true, files });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: 'Failed to get files' });
  }
});



router.get('/book1', async (req, res) => {
  try {
    const files = await File.find();
    console.log('solohitechnology book')
    res.status(200).json({ success: true, files });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: 'Failed to get files' });
  }
});


router.post('/solohitech/:ID', async (req, res) => {
  try {

    await File.count(req.params);


  } catch (e) {
    console.log(e)
  }

})
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//get the file by ID

router.get('/files/:ID', async (req, res) => {
  try {
    const singleFile = await File.findById(req.params.id);
    !singleFile && res.status(401).json('no file with this id exist ');
    res.status(200).json(singleFile)
  } catch (e) {
    console.log(e)
  }

});


//DOWNLOAD THE FILE....

router.get('/download/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ success: false, error: 'File not found' });
    }

    const filePath = path.join(__dirname, file.pdf.path);
    const fileStream = fs.createReadStream(filePath);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${file.pdf.filename}`);
    fileStream.pipe(res);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: 'Failed to download file' });
  }
});



module.exports = router;