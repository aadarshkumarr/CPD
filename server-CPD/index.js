const express = require("express");
const app = express();
require("./db/db.config");
const path = require("path");

const router = require("./routes/index");
const Courses = require("./model/Courses");
const imageModel = require("./models");
const AddCPD = require("./model/AddCPD");
const authMiddleware = require("./middleware/middleware");
const cron = require("node-cron");
const User = require("./model/User");
const subscriptionScheduler = require("./subscriptionScheduler");

const cors = require("cors");
const bodyParser = require("body-parser");

const multer = require("multer");
const fs = require("fs");

const PORT = process.env.PORT || 8081;

// middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(router);

app.use("/uploads", express.static(path.join("uploads")));

// For Checking
app.get("/userdash", async (req, res) => {
	try {
		const users = await User.findOne();
		res.json("server is up and running");
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});
app.get("/dashboard/app", authMiddleware, async (req, res) => {
	res.json({ user: req.user });
});

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads");
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	},
});

const upload = multer({ storage: storage });
// uploading files (images)
// userRouter.post("/uploading", async (req, res) => {
// 	const file = req.files.screenshot;
// 	const newFile = new File({
// 		name: file.name,
// 		data: file.data,
// 		contentType: file.mimetype,
// 	});
// 	try {
// 		const savedFile = await newFile.save();
// 		res.send(savedFile);
// 	} catch (err) {
// 		console.error(err);
// 		res.sendStatus(500);
// 	}
// });

// Upload Images
app.post("/", upload.single("testImage"), (req, res) => {
	const saveImage = imageModel({
		name: req.body.name,
		img: {
			data: fs.readFileSync("uploads/" + req.file.filename),
			contentType: "image/png",
		},
	});
	saveImage
		.save()
		.then((res) => {
			console.log("image is saved");
		})
		.catch((err) => {
			console.log(err, "error has occur");
		});
	res.send("image is saved");
});

// Get Images
app.get("/data", async (req, res) => {
	const allData = await imageModel.find();
	res.json(allData);
});

// Getting files (images)
app.get("/uploading/:id", async (req, res) => {
	const fileId = req.params.id;
	try {
		const file = await File.findOne({
			fileId: fileId,
		}).lean();
		if (!file) {
			res.status(404).send("File not found");
		} else {
			res.set("Content-Type", file.contentType);
			res.send(file.data);
			// console.log(file.data);
		}
	} catch (error) {
		console.error(error);
		res.sendStatus(500);
	}
});

// app.listen(PORT);
app.listen(PORT, () => {
	console.log(`server started on port ${PORT}`);
});

// Schedule the job to run daily (at 12:00 AM)
cron.schedule("0 0 * * *", subscriptionScheduler.checkExpiringSubscriptions);
