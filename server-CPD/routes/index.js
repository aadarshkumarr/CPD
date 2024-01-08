let express = require("express");
let router = express.Router();
let userRoutes = require("./user.routes");
let courseRoutes = require("./course.routes");
let courseAdminRoutes = require("./courseAdmin.routes");
let cpdRoutes = require("./cpd.routes");
let certificateRoutes = require("./certificateAdmin.routes");
let badgeRoutes = require("./badgeRoutes");

router.use("/", userRoutes);
router.use("/", courseRoutes);
router.use("/", courseAdminRoutes);
router.use("/", cpdRoutes);
router.use("/", certificateRoutes);
router.use("/", badgeRoutes);

module.exports = router;
