const mongoose = require('mongoose');
const { Schema } = require("mongoose");
const MatchStatus = require('../enums/EnumMatchStatus');

const matchSchema = new mongoose.Schema({
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  status: { type: String, enum: Object.values(MatchStatus), default: MatchStatus.MATCHED, lowercase: true },
  lastUpdatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
}, {
  versionKey: false
});

matchSchema.index({ "users.0": 1, "users.1": 1 });
matchSchema.index({ "status": 1 });

module.exports = mongoose.model('Match', matchSchema, 'matches');