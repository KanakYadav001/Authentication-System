const mongo = require("mongoose");

const sessionSchema = new mongo.Schema(
  {
    user: {
      type: mongo.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "User Id Is Required For Session Schema"],
    },
    hashRefreshToken: {
      type: String,
      required: [true, "Refresh Token Is Needed For Session Schema"],
    },
    ip: {
      type: String,
      required: [true, "IP Is Needed For Session Schema"],
    },
    userAgent: {
      type: String,
      required: [true, "User Device Info Is Needed For Session Schema"],
    },
    revoke: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const SessionModel = mongo.model("sessions", sessionSchema);

module.exports = SessionModel;
