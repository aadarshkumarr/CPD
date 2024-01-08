const express = require("express");
const Router = express.Router();
const File = require("../model/Certificate")
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the directory where files should be stored
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Generate a unique filename
    },
});
const upload = multer({ storage });

Router.post('/admin/upload', upload.single('file'), async (req, res) => {
    const { filename, path } = req.file;

    try {
        // Save the file details to the database
        const file = new File({ filename, path });
        await file.save();
        console.log(file);
        console.log('File uploaded successfully and saved to the database.');

        res.json({ message: 'File uploaded successfully.' });
    } catch (error) {
        console.error('Failed to upload file:', error);
        res.status(500).json({ message: 'Failed to upload file.' });
    }
});

module.exports = Router;