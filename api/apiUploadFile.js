const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set storage engine for multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const folderPath = 'public/assets/uploads/sys';
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }
        cb(null, folderPath);
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
  
  // Initialize multer
  const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 } // limit file size to 5MB
  });
  
  // Define upload route
router.post('/', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No files were uploaded.');
    }
    
    // Get the file URL
    const fileUrl = req.protocol + '://' + req.get('host') + '/' + req.file.path.substring('/public'.length);
    
    res.json({ url: fileUrl});
});

router.post('/multi', upload.array('files'), (req, res) => {
    const uploadedFiles = req.files.map(file => {
        return {
          filename: file.filename,
          url: req.protocol + '://' + req.get('host') + `/assets/uploads/sys/${file.filename}`
        };
      });
    
      // Send the list of URLs as a JSON response
      res.json(uploadedFiles);
  });

module.exports = router;
