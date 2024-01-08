const authenticateUser = (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		return res.status(401).json({ message: "Unauthorized" });
	}
	const token = authHeader.split(" ")[1];
	jwt.verify(token, "mysecretkey", (err, decoded) => {
		if (err) {
			return res.status(401).json({ message: "Unauthorized" });
		}
		req.userId = decoded.userId;
		next();
	});
};

module.exports = authenticateUser;
