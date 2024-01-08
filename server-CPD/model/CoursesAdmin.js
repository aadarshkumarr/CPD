const mongoose = require("mongoose");

const courseAdminSchema = new mongoose.Schema(
	{
		// courseId: {
		// 	type: Number,
		// 	required: true,
		// },
		courseName: {
			type: String,
			required: true,
		},
		filename: {
			type: String,
		},
		path: {
			type: String,
		},
		status: {
			type: String,
			enum: ["Active", "Freeze"],
			default: "Active",
		},
	},
	{ timestamps: true },
	{
		collection: "Course",
	}
);

const CourseAdmin = mongoose.model("CourseAdmin", courseAdminSchema);

module.exports = CourseAdmin;
