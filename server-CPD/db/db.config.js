const mongoose = require("mongoose");
mongoose
	.connect("mongodb+srv://namespy6:6spyname@cpd.zrditb1.mongodb.net/test", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("db connected successfully"))
	.catch((err) => console.log("it has an error", err));
