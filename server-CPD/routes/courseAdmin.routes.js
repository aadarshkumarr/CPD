const CourseAdmin = require("../model/CoursesAdmin");
const express = require("express");
const courseAdminRouter = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/"); // Specify the directory where files should be stored
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + "-" + file.originalname); // Generate a unique filename
	},
});
const upload = multer({ storage });

courseAdminRouter.post(
	"/admin/addcourse",
	upload.single("file"),
	async (req, res) => {
		const { courseName } = req.body;
		const { filename, path } = req.file;
		const course = new CourseAdmin({
			courseName,
			filename,
			path,
			// courseId,
		});

		await course.save();
		console.log(course);
		res.status(201).json({
			courseName: course.courseName,
			// courseId: course.courseId,
		});
	}
);

// Get All courses  API
courseAdminRouter.get("/admin/courses", async (req, res) => {
	try {
		const course = await CourseAdmin.find();
		if (!course) {
			res.status(404).json({ message: "Course not found" });
			return;
		}

		res.json(course);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

courseAdminRouter.put("/course/active/:Id", async (req, res) => {
	try {
		const updatedCourse = await CourseAdmin.findOneAndUpdate(
			{ _id: req.params.Id },
			{ status: "Active" },
			{ new: true }
		);
		res.json(updatedCourse);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Api to blocked a user
courseAdminRouter.put("/course/freeze/:Id", async (req, res) => {
	try {
		const updatedCourse = await CourseAdmin.findOneAndUpdate(
			{ _id: req.params.Id },
			{ status: "Freeze" },
			{ new: true }
		);
		res.json(updatedCourse);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

courseAdminRouter.get("/admin/courses/active", async (req, res) => {
	try {
		const Courses = await CourseAdmin.find({ status: "Active" });
		res.json(Courses);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

courseAdminRouter.get("/admin/courses/freeze", async (req, res) => {
	try {
		const Courses = await CourseAdmin.find({ status: "Freeze" });
		res.json(Courses);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

module.exports = courseAdminRouter;
