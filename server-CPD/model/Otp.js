const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
	{
		email: String,
		code: String,
		expireIn: Number,
	},
	{
		timestamps: true,
	}
);

const Otp = mongoose.model("resetPassword", otpSchema);

module.exports = Otp;
