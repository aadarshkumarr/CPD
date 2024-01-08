const mongoose = require("mongoose");

const addCPDSchema = new mongoose.Schema(
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
		title: {
			type: String,
			required: true,
		},
		sponsor: {
			type: String,
			required: true,
		},
		course: {
			type: String,
			// required: true,
		},

		startDate: {
			type: Date,
			// required: true,
		},
		endDate: {
			type: Date,
			// required: true,
		},
		qualifyingActivity: {
			type: String,
			required: true,
		},
		methodOfDelivery: {
			type: String,
			required: true,
		},
		hours: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			enum: ["pending", "approved", "rejected"],
			default: "pending",
		},
	},
	{ timestamps: true },
	{
		collation: "AddCPD",
	}
);

const AddCPD = mongoose.model("AddCPD", addCPDSchema);

module.exports = AddCPD;
