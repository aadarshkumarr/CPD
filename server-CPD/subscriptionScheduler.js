const cron = require("node-cron");
const User = require("./model/User");

// Function to check for expiring subscriptions and send notifications
const checkExpiringSubscriptions = async () => {
	const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

	try {
		// Find users whose subscription is expiring in the next 30 days
		const expiringUsers = await User.find({
			subscriptionStartDate: { $lte: thirtyDaysFromNow },
		});

		// Send notifications to users and admins
		for (const user of expiringUsers) {
			console.log(
				`Sending notification to ${user.email}: Your subscription will expire in 30 days. Please renew your subscription.`
			);
			console.log(
				`Sending notification to admin@example.com: User ${user.name} (${user.email})'s subscription will expire in 30 days.`
			);
		}
	} catch (error) {
		console.error("Error checking expiring subscriptions:", error);
	}
};

// Schedule the job to run daily (at 12:00 AM)
cron.schedule("0 0 * * *", checkExpiringSubscriptions);

module.exports = {
	checkExpiringSubscriptions,
};
