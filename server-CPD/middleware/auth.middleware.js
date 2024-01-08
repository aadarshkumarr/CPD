const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
	const token = req.cookies.user.token;

	if (!token) {
		return res.status(401).json({ message: "Authorization token not found" });
	}

	try {
		const decoded = jwt.verify(token, "mysecretkey");
		req.user = decoded.user;
		next();
	} catch (error) {
		console.error(error);
		res.status(401).json({ message: "Invalid authorization token" });
	}
};

module.exports = authMiddleware;
