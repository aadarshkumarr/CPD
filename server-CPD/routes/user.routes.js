const User = require("../model/User");
const Otp = require("../model/Otp");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRouter = express.Router();
const File = require("../model/Certificate");
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/"); // Specify the directory where files should be stored
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + "-" + file.originalname); // Generate a unique filename
	},
});
const upload = multer({ storage });

userRouter.patch("/edit/:userId", upload.single("file"), async (req, res) => {
	// const { courseName } = req.body;
	try {
		// const { path } = req.file;
		// console.log(filename);
		const user = await User.findOne({ userId: req.params.userId });
		console.log(req.file);
		if (!user) {
			return res.status(404).json({ error: "Course not found" });
		}
		// const course = new User({...req.body , img : filename});
		if (req.file == undefined) {
			const updateUser = await User.findOneAndUpdate(
				{ userId: req.params.userId },
				req.body,
				{ new: true }
			);
			console.log(updateUser);
			res.status(201).json(updateUser);
		} else {
			const updateUser = await User.findOneAndUpdate(
				{ userId: req.params.userId },
				{ ...req.body, img: req.file.filename },
				{ new: true }
			);
			console.log(updateUser);
			res.status(201).json(updateUser);
		}
	} catch (err) {
		console.log(err.message);
	}
});

// ====>> Sign Up Api
userRouter.post("/signup", async (req, res) => {
	try {
		const { name, email, password, countryName, countryCode, phone, role } =
			req.body;

		// Check if user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ message: "User already exists" });
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Calculate subscription start date and end date
		const currentDate = new Date();
		const subscriptionStartDate = currentDate.toISOString(); // Store the start date as a string

		const subscriptionEndDate = new Date();
		subscriptionEndDate.setDate(subscriptionEndDate.getDate() + 30);

		// Create a new user with subscription fields and isActive flag
		const user = new User({
			name,
			email,
			password: hashedPassword,
			countryName,
			countryCode,
			phone,
			role,
			subscriptionStartDate,
			subscriptionEndDate, // Automatically calculated end date
			isActive: true, // Set isActive to true by default for new signups
		});

		await user.save();

		// Return the user details
		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			countryName: user.countryName,
			countryCode: user.countryCode,
			phone: user.phone,
			status: user.status,
			userId: user.userId,
			isActive: user.isActive,
			subscriptionStartDate: user.subscriptionStartDate,
			subscriptionEndDate: user.subscriptionEndDate,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
});

// 1 day
// userRouter.post("/signup", async (req, res) => {
// 	try {
// 		const { name, email, password, countryName, countryCode, phone, role } =
// 			req.body;

// 		// Check if user already exists
// 		const existingUser = await User.findOne({ email });
// 		if (existingUser) {
// 			return res.status(400).json({ message: "User already exists" });
// 		}

// 		// Hash the password
// 		const hashedPassword = await bcrypt.hash(password, 10);

// 		// Set subscription start date and end date to 1 day duration
// 		const currentDate = new Date();
// 		const subscriptionStartDate = currentDate.toISOString(); // Store the start date as a string
// 		const subscriptionEndDate = new Date(
// 			currentDate.getFullYear(),
// 			currentDate.getMonth(),
// 			currentDate.getDate() + 1 // Add 1 day to the current date
// 		);

// 		// Create a new user with subscription fields and isActive flag
// 		const user = new User({
// 			name,
// 			email,
// 			password: hashedPassword,
// 			countryName,
// 			countryCode,
// 			phone,
// 			role,
// 			subscriptionStartDate,
// 			subscriptionEndDate,
// 			isActive: true, // Set isActive to true by default for new signups
// 		});

// 		await user.save();

// 		// Return the user details
// 		res.status(201).json({
// 			_id: user._id,
// 			name: user.name,
// 			email: user.email,
// 			country: user.countryName,
// 			countryCode: user.countryCode,
// 			phone: user.phone,
// 			status: user.status,
// 			userId: user.userId,
// 			isActive: user.userId,
// 			subscriptionStartDate: user.subscriptionStartDate,
// 			subscriptionEndDate: user.subscriptionEndDate,
// 		});
// 	} catch (error) {
// 		console.error(error);
// 		res.status(500).json({ message: "Internal Server Error" });
// 	}
// });

// ====>> Log in Up Api
userRouter.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;

		// Find the user by email
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		// Check the password
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		// Check if the user's status is approved
		if (user.status !== "approved") {
			return res.status(401).json({ message: "User is not approved" });
		}

		// Generate a JWT token
		const token = jwt.sign({ userId: user.userId }, "mysecretkey");

		// Return the token and user details
		res.json({
			token,
			_id: user.userId,
			name: user.name,
			email: user.email,
			phone: user.phone,
			role: user.role,
			status: user.status,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
});

// Check password API
userRouter.post("/check-password", async (req, res) => {
	try {
		const { userId, password } = req.body;

		// Find the user by userId
		const user = await User.findOne({ userId });
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Check the password
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.json({ isValid: false });
		}

		// Password is valid
		res.json({ isValid: true });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
});

// ====>> Api to fetch all pending user registration requests
userRouter.get("/pending", async (req, res) => {
	try {
		const users = await User.find({ status: "pending" });
		res.json(users);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// ====>> Api to fetch all approved user registration requests
userRouter.get("/approved", async (req, res) => {
	try {
		const users = await User.find({ status: "approved" });
		res.json(users);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// ====>> Api to fetch all blocked user registration requests
userRouter.get("/blocked", async (req, res) => {
	try {
		const users = await User.find({ status: "blocked" });
		res.json(users);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// ====>>  Api to fetch Users
userRouter.get("/users", async (req, res) => {
	try {
		const users = await User.find().lean();
		if (users.length === 0) {
			res.status(404).json({ message: "No users found" });
			return;
		}
		const usersWithTimestamp = users.map((user) => ({
			...user,
			timestamp: user._id.getTimestamp(),
		}));
		res.json(usersWithTimestamp);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// ====>>  Api to fetch User By UserId
userRouter.get("/users/:userId", async (req, res) => {
	try {
		const user = await User.findOne({
			userId: req.params.userId,
		}).lean();
		if (!user) {
			res.status(404).json({ message: "User not found" });
			return;
		}
		const { _id, ...rest } = user;
		const userWithTimestamp = {
			...rest,
			timestamp: _id.getTimestamp(),
		};
		res.json(userWithTimestamp);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Api to Approve a user registration request
userRouter.put("/users/approve/:userId", async (req, res) => {
	try {
		const updatedUser = await User.findOneAndUpdate(
			{ userId: req.params.userId },
			{ status: "approved" },
			{ new: true }
		);
		res.json(updatedUser);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Api to blocked a user
userRouter.put("/users/blocked/:userId", async (req, res) => {
	try {
		const updatedUser = await User.findOneAndUpdate(
			{ userId: req.params.userId },
			{ status: "blocked" },
			{ new: true }
		);
		res.json(updatedUser);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

//  Edit Profile API
userRouter.put("/edit/:userId", async (req, res) => {
	try {
		const {
			name,
			lastName,
			email,
			password,
			phone,
			dob,
			address,
			qualification,
			img,
		} = req.body;

		const updatedUser = await User.findOneAndUpdate(
			{ userId: req.params.userId },
			{
				name,
				lastName,
				email,
				password,
				phone,
				dob,
				address,
				qualification,
				img,
			},
			{ new: true }
		).lean();
		if (!updatedUser) {
			res.status(404).json({ message: "User not found" });
			return;
		}
		res.json(updatedUser);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// API to delete user
userRouter.delete("/users/:userId", async (req, res) => {
	try {
		const user = await User.findOneAndDelete(req.params.userId);
		console.log(user);

		res.json({
			message: "Successfully deleted",
			user: user,
		});
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Forgot Password  API

userRouter.post("/email-send", async (req, res) => {
	let data = await User.findOne({ email: req.body.email });
	const responseType = {};

	if (data) {
		let otpCode = Math.floor(Math.random() * 1000000 + 1);
		let otpData = new Otp({
			email: req.body.email,
			code: otpCode,
			expireIn: new Date().getTime() + 300 * 1000,
		});

		let otpResponse = await otpData.save();
		responseType.statusText = "Success";
		responseType.message = "Plseas enter OTP";
	} else {
		(responseType.statusText = "error"),
			(responseType.message = "Email Id not exist");
	}

	res.status(200).json(responseType);
});

userRouter.post("/change-password", async (req, res) => {
	let data = await Otp.find({ email: req.body.email, code: req.body.otpCode });
	const response = {};

	if (data) {
		let currentTime = new Date().getTime();
		let diff = data.expireIn - currentTime;
		if (diff < 0) {
			response.message = "Otp expired";
			response.statusText = "error";
		} else {
			let user = await User.findOne({ email: req.body.email });
			user.password = req.body.password;
			user.save();
			response.message = "Password Changed Successfully";
			response.statusText = "success";
		}
	} else {
		response.message = "Invalid Otp";
		response.statusText = "error";
	}
	res.status(200).json(response);
});

const mailer = (email, otp) => {
	var nodemailer = require("nodemailer");
	var transporter = nodemailer.createTransport({
		service: "gmail",
		port: 587,
		secure: false,
		auth: {
			user: "mvikaskashyap@gmail.com",
			pass: "V8006383806k@",
		},
	});

	var mailOptions = {
		from: "mvikaskashyap@gmail.com",
		to: "id.vikaskashyap@gmail.com",
		subject: "Sending Email using Node js",
		text: "Thank you sir !",
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log("Email sent:" + info.response);
		}
	});
};

// API endpoint to fetch expiring subscriptions notifications
userRouter.get("/notifications", async (req, res) => {
	try {
		const currentDate = new Date();
		const thirtyDaysFromNow = new Date(
			currentDate.getFullYear(),
			currentDate.getMonth(),
			currentDate.getDate() + 30
		);

		const expiringUsers = await User.find({
			subscriptionStartDate: { $gte: currentDate, $lte: thirtyDaysFromNow },
		});

		const notifications = expiringUsers.map((user) => ({
			email: user.email,
			message: `Your subscription will expire in 30 days. Please renew your subscription.`,
		}));

		res.status(200).json(notifications);
	} catch (error) {
		console.error("Error fetching notifications:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
});

userRouter.get("/download/:id", async (req, res) => {
	const fileId = req.params.id;

	try {
		console.log("hello");
		// Find the file in the database
		const file = await File.findById(fileId);

		if (!file) {
			return res.status(404).json({ message: "File not found." });
		}

		const filePath = file.path;
		const filename = path.basename(filePath);
		const fileExtension = path.extname(filename);

		res.download(filePath, filename, (error) => {
			if (error) {
				console.error("Failed to download file:", error);
				res.status(500).json({ message: "Failed to download file." });
			}
		});
	} catch (error) {
		console.error("Failed to download file:", error);
		res.status(500).json({ message: "Failed to download file." });
	}
});

userRouter.get("/user/certificates", async (req, res) => {
	try {
		const files = await File.find();
		res.status(200).json(files);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Fetch users whose subscriptions will expire starting from tomorrow
userRouter.get("/expiring-users", async (req, res) => {
	try {
		const currentDate = new Date();
		const thirtyDaysFromNow = new Date();
		thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

		const expiringUsers = await User.find({
			subscriptionEndDate: { $gte: currentDate, $lte: thirtyDaysFromNow },
		});

		res.status(200).json(expiringUsers);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
});

userRouter.put("/change/password/:userId", async function (req, res) {
	try {
		const saltRounds = 10;
		bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
			// Store hash in your password DB.
			if (err) {
				return res.status(404).json({ message: err.message });
			}
			const user = await User.findOneAndUpdate(
				{ userId: req.params.userId },
				{ password: hash },
				{ new: true }
			);
			return res.status(200).json({ message: "Password has been Changed" });
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: error.message });
	}
});

userRouter.put("/api/change-password", async (req, res) => {
	const { email, previousPassword, newPassword } = req.body;

	try {
		// Find the user in the database
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}
		// Check if the previous password matches
		const isPasswordValid = await bcrypt.compare(
			previousPassword,
			user.password
		);
		if (!isPasswordValid) {
			return res.status(400).json({ error: "Invalid previous password" });
		}
		// Update the password
		const hashedPassword = await bcrypt.hash(newPassword, 10);
		user.password = hashedPassword;
		await user.save();

		return res.status(200).json({ message: "Password changed successfully" });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Internal server error" });
	}
});

module.exports = userRouter;
