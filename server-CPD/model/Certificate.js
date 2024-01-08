const mongoose = require("mongoose");

const certificateAdminSchema = new mongoose.Schema(
    {
        filename: String,
        path: String
    },
    { timestamps: true },
    {
        collection: "certificate",
    }
);

const certificateAdmin = mongoose.model("certificateAdmin", certificateAdminSchema);

module.exports = certificateAdmin;
