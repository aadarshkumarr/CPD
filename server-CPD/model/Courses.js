const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
	{
		userId: {
			type: Number,
			// required: true,
		},
		username: {
			type: String,
		},
		email: {
			type: String,
		},
		courseName: {
			type: String,
			// required: true,
		},
		pdf1: {
			type: String,
		},
		pdf2: {
			type: String,
		},
		courseImg: {
			type: String,
		},
		certificatePDF: {
			type: String,
		},
		certificateId: {
			type: Number,
		},

		status: {
			type: String,
			enum: ["pending", "approved", "rejected", "blocked"],
			default: "pending",
		},
	},
	{ timestamps: true },
	{
		collection: "Course",
	}
);

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
