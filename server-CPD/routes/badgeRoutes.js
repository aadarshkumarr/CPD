const express = require("express");
const Badge = require("../model/Badge");
const User = require("../model/User");

const badgeRouter = express.Router();

badgeRouter.post("/create-badge/:userId", async (req, res) => {
	const { userId } = req.params;
	const { name, email, badgeLink } = req.body;

	try {
		// Check if the user with the provided userId exists in the User collection
		const user = await User.findOne({ userId });

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Check if a badge for the provided userId already exists
		let badge = await Badge.findOne({ userId });

		if (badge) {
			// Badge already exists, update the existing badge record
			badge.name = name;
			badge.email = email;
			badge.badgeLink = badgeLink;

			// Save the updated badge record
			await badge.save();

			res.status(200).json({
				userId: badge.userId,
				name: badge.name,
				email: badge.email,
				badgeLink: badge.badgeLink,
				message: "Badge updated successfully",
			});
		} else {
			// Create a new badge record
			badge = new Badge({
				userId,
				name,
				email,
				badgeLink,
			});

			// Save the new badge record
			await badge.save();

			res.status(201).json({
				userId: badge.userId,
				name: badge.name,
				email: badge.email,
				badgeLink: badge.badgeLink,
				message: "Badge created successfully",
			});
		}
	} catch (error) {
		console.error("Error creating/updating badge:", error);
		res.status(500).json({ message: "Internal server error" });
	}
});

// GET badge data by userId
badgeRouter.get("/get-badge/:userId", async (req, res) => {
	const { userId } = req.params;

	try {
		// Find the badge record by userId
		const badge = await Badge.findOne({ userId });

		if (!badge) {
			return res
				.status(404)
				.json({ message: "Badge not found for the provided userId" });
		}

		res.status(200).json({
			userId: badge.userId,
			name: badge.name,
			email: badge.email,
			badgeLink: badge.badgeLink,
		});
	} catch (error) {
		console.error("Error fetching badge:", error);
		res.status(500).json({ message: "Internal server error" });
	}
});

module.exports = badgeRouter;

module.exports = badgeRouter;
