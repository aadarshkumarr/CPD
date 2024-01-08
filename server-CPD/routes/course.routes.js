const Courses = require("../model/Courses");
const User = require("../model/User");
const express = require("express");
const courseRouter = express.Router();
const multer = require("multer");
const path = require("path");

// Set up multer storage for image uploads
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads/"); // Directory where the images will be stored
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(
			null,
			file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
		);
	},
});

const upload = multer({ storage: storage });

// Add a course API
courseRouter.post(
	"/addcourse/:userId",
	upload.fields([
		{ name: "courseImg", maxCount: 1 },
		{ name: "certificatePDF", maxCount: 1 },
	]),
	async (req, res) => {
		const { courseName, certificateId, username, email } = req.body;
		const { userId } = req.params;

		try {
			// Check if the user exists in the User collection
			const user = await User.findOne({ userId });
			if (!user) {
				return res.status(404).json({ message: "User not found" });
			}

			const course = new Courses({
				userId,
				courseName,
				certificateId,
				username,
				email,
				courseImg: req.files["courseImg"]
					? req.files["courseImg"][0].filename
					: null,
				certificatePDF: req.files["certificatePDF"]
					? req.files["certificatePDF"][0].filename
					: null,
			});

			await course.save();
			res.status(201).json({
				// userId: course.userId,
				// userName: course.userName,
				// userEmail: course.userEmail,
				// courseName: course.courseName,
				// certificateId: course.certificateId,
				// courseImg: course.courseImg,
				// certificatePDF: course.certificatePDF,
				course,
			});
		} catch (error) {
			res.status(500).json({ message: "Internal server error" });
		}
	}
);

// Get All courses  API
courseRouter.get("/courses", async (req, res) => {
	try {
		const course = await Courses.find();
		if (!course) {
			res.status(404).json({ message: "Course not found" });
			return;
		}

		res.json(course);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Get pending course details API
courseRouter.get("/courses/pending", async (req, res) => {
	try {
		const course = await Courses.find({ status: "pending" });
		if (!course) {
			res.status(404).json({ message: "Course not found" });
			return;
		}

		res.json(course);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Get approved course API
courseRouter.get("/courses/approved", async (req, res) => {
	try {
		const course = await Courses.find({ status: "approved" });
		if (!course) {
			res.status(404).json({ message: "Course not found" });
			return;
		}

		res.json(course);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Get Course by Registration Id
courseRouter.get("/courses/:userId", async (req, res) => {
	try {
		const userId = req.params.userId; // Retrieve the registrationId from the request URL parameter

		const courses = await Courses.collection
			.find({
				userId: parseInt(userId),
			})
			.toArray();

		if (!courses || courses.length === 0) {
			res.status(404).json({ message: "Courses not found" });
			return;
		}

		res.json(courses);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Api to approve a user course request
courseRouter.put("/courses/approve/:userId", async (req, res) => {
	try {
		const updatedCourse = await Courses.findOneAndUpdate(
			{ userId: req.params.userId, status: "pending" },
			{ status: "approved" },
			{ new: true }
		);
		res.json(updatedCourse);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Api to approve a user course request
courseRouter.put("/courses/rejected/:userId", async (req, res) => {
	try {
		const updatedCourse = await Courses.findOneAndUpdate(
			{ userId: req.params.userId, status: "pending" },
			{ status: "rejected" },
			{ new: true }
		);
		res.json(updatedCourse);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// API to delete  add course
courseRouter.delete("/courses/:userId", async (req, res) => {
	try {
		const course = await Courses.findOneAndDelete(req.params.userId);
		console.log(course);
		res.json({
			message: "Successfully deleted",
			courseDetails: course,
		});
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// const storage = multer.diskStorage({
// 	destination: (req, file, cb) => {
// 		cb(null, "uploads/"); // Specify the directory where files should be stored
// 	},
// 	filename: (req, file, cb) => {
// 		cb(null, Date.now() + "-" + file.originalname); // Generate a unique filename
// 	},
// });
// const upload = multer({ storage });

courseRouter.put(
	"/upload/pdfs/:id",
	upload.fields([
		{ name: "pdf1", maxCount: 1 },
		{ name: "pdf2", maxCount: 1 },
	]),
	async (req, res) => {
		const { id } = req.params;
		const files = req.files;

		// Check if PDF files are present
		if (!files || !files.pdf1 || !files.pdf2) {
			return res
				.status(400)
				.json({ error: "pdf1 and pdf2 files are required" });
		}

		const pdf1Path = files.pdf1[0].path;
		const pdf2Path = files.pdf2[0].path;

		try {
			const updatedCourse = await Courses.findOneAndUpdate(
				{ _id: id },
				{
					pdf1: pdf1Path,
					pdf2: pdf2Path,
				},
				{ new: true }
			);
			res.status(200).json({ message: "Files uploaded successfully" });
		} catch (error) {
			console.error("Error saving upload data:", error);
			res
				.status(500)
				.json({ error: "An error occurred while saving the upload data" });
		}
	}
);

courseRouter.get("/certi/download/:filename", (req, res) => {
	const filename = req.params.filename;
	const filePath = path.join("uploads", filename);
	res.download(filePath, (err) => {
		if (err) {
			console.error("Error downloading file:", err);
			res
				.status(500)
				.json({ error: "An error occurred while downloading the file" });
		}
	});
});

module.exports = courseRouter;
