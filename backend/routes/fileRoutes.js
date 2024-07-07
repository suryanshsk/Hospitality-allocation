const express = require('express');
const multer = require('multer');
const { handleFileUpload } = require('../controllers/allocationController');

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.array('files', 2), handleFileUpload);

module.exports = router;
