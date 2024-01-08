const mongoose = require("mongoose");

const badgeSchema = new mongoose.Schema(
	{
		userId: { type: Number, unique: true },
		name: String,
		email: String,
		badgeLink: String,
	},
	{ timestamps: true },
	{
		collection: "Badge",
	}
);

const Badge = mongoose.model("Badge", badgeSchema);

module.exports = Badge;
