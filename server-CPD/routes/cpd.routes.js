const AddCPD = require("../model/AddCPD");
const express = require("express");
const cpdRouter = express.Router();
const {
	OK,
	NOT_FOUND,
	BAD_REQUEST,
	INTERNAL_SERVER_ERROR,
	CONFLICT,
} = require("../utils/statuscode");

// Add CPD APi -
cpdRouter.post("/addcpd/:userId", async (req, res) => {
	const {
		userId,
		username,
		email,
		title,
		sponsor,
		startDate,
		endDate,
		qualifyingActivity,
		methodOfDelivery,
		hours,
		course,
	} = req.body;

	const addCpd = new AddCPD({
		userId,
		username,
		email,
		title,
		sponsor,
		startDate,
		endDate,
		qualifyingActivity,
		methodOfDelivery,
		hours,
		course,
	});

	await addCpd.save();
	res.status(201).json({
		userId: addCpd.userId,
		userName: addCpd.username,
		email: addCpd.email,
		title: addCpd.title,
		sponsorOrganization: addCpd.sponsor,
		startDate: addCpd.startDate,
		endDate: addCpd.endDate,
		qualifyingActivity: addCpd.qualifyingActivity,
		methodofDelivery: addCpd.methodOfDelivery,
		hours: addCpd.hours,
		course: addCpd.course,
	});
});

// Get CPD API -

cpdRouter.get("/getcpd/:userId", async (req, res) => {
	try {
		const userId = req.params.userId; // Retrieve the registrationId from the request URL parameter

		const cpd = await AddCPD.collection
			.find({
				userId: parseInt(userId),
			})
			.toArray();

		if (!cpd || cpd.length === 0) {
			res.status(404).json({ message: "cpd not found" });
			return;
		}
		res.status(OK).json({
			status: OK,
			message: "CPD added successfully",
			data: cpd,
		});
	} catch (error) {
		console.error("Error adding CPD:", error);
		res.status(500).json({ status: 500, error: "Internal server error" });
	}
});

// Get pending CPD API
cpdRouter.get("/addcpds/pending", async (req, res) => {
	try {
		const addcpd = await AddCPD.find({ status: "pending" });
		if (!addcpd) {
			res.status(404).json({ message: "CPD not found" });
			return;
		}

		res.json(addcpd);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Get approved CPD API
cpdRouter.get("/addcpds/approved", async (req, res) => {
	try {
		const addcpd = await AddCPD.find({ status: "approved" });
		if (!addcpd) {
			res.status(404).json({ message: "CPD not found" });
			return;
		}

		res.json(addcpd);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Update CPD API -
cpdRouter.put("/addcpd/:userId", async (req, res) => {
	try {
		const {
			userId,
			username,
			email,
			title,
			sponsor,
			startDate,
			endDate,
			qualifyingActivity,
			methodOfDelivery,
		} = req.body;

		const cpd = await AddCPD.findOneAndUpdate(
			{ userId: req.params.userId },
			{
				userId,
				username,
				email,
				title,
				sponsor,
				startDate,
				endDate,
				qualifyingActivity,
				methodOfDelivery,
			},
			{ new: true }
		).lean();

		if (!cpd) {
			res.status(404).json({ message: "CPD not found" });
			return;
		}

		res.json({
			userId: cpd.userId,
			userName: cpd.username,
			email: cpd.email,
			title: cpd.title,
			sponsorOrganization: cpd.sponsor,
			startDate: cpd.startDate,
			endDate: cpd.endDate,
			qualifyingActivity: cpd.qualifyingActivity,
			methodofDelivery: cpd.methodOfDelivery,
		});
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// CPD delete API
cpdRouter.delete("/addcpd/:userId", async (req, res) => {
	try {
		const cpd = await AddCPD.findOneAndDelete({
			userId: req.params.userId,
		});

		if (!cpd) {
			res.status(404).json({ message: "CPD not found" });
			return;
		}

		res.json({
			message: "CPD deleted successfully",
			cpd: {
				userId: cpd.userId,
				userName: cpd.username,
				email: cpd.email,
				title: cpd.title,
				sponsorOrganization: cpd.sponsor,
				startDate: cpd.startDate,
				endDate: cpd.endDate,
				qualifyingActivity: cpd.qualifyingActivity,
				methodofDelivery: cpd.methodOfDelivery,
			},
		});
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Api to approve a user CPD request
cpdRouter.put("/addcpds/approve/:userId", async (req, res) => {
	try {
		const updatedCPD = await AddCPD.findOneAndUpdate(
			{ userId: req.params.userId, status: "pending" },
			{ status: "approved" },
			{ new: true }
		);
		res.json(updatedCPD);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Api to reject a user CPD request

cpdRouter.put("/addcpds/rejected/:userId", async (req, res) => {
	try {
		const updatedCPD = await AddCPD.findOneAndUpdate(
			{ userId: req.params.userId, status: "pending" },
			{ status: "rejected" },
			{ new: true }
		);
		res.json(updatedCPD);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

cpdRouter.put("/addcpds/pending/:id", async (req, res) => {
	const { hours } = req.body;
	const id = req.params.id;
	try {
		const addcpd = await AddCPD.findOneAndUpdate(
			{ _id: id },
			{
				$set: req.body,
			},
			{ new: true }
		);
		if (!addcpd) {
			res.status(404).json({ message: "CPD not found" });
			return;
		}

		res.json(addcpd);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

module.exports = cpdRouter;
