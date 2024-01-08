const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		userId: { type: Number, unique: true },
		name: String,
		lastName: String,
		email: String,
		password: String,
		countryName: String,
		countryCode: Number,
		phone: Number,
		dob: Date,
		address: String,
		subscriptionStartDate: Date,
		subscriptionEndDate: Date,
		img: {
			data: Buffer,
			contentType: String,
		},
		qualification: String,
		role: { type: String, enum: ["user", "admin" , "management" ], default: "user" },
		status: {
			type: String,
			enum: ["pending", "approved", "rejected", "blocked"],
			default: "pending",
		},
		isActive: { type: Boolean, default: true },
	},
	{
		timestamps: true,
	}
);

userSchema.pre("save", async function (next) {
	const user = this;
	if (!user.isNew) {
		return next();
	}
	try {
		const lastUser = await mongoose
			.model("users", userSchema)
			.findOne({})
			.sort({ userId: -1 })
			.exec();
		user.userId = lastUser ? lastUser.userId + 1 : 1;
		next();
	} catch (error) {
		next(error);
	}
});

module.exports = mongoose.model("users", userSchema);
