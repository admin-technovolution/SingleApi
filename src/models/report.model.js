const mongoose = require('mongoose');
const { Schema } = mongoose;
const ReportStatus = require('../enums/EnumReportStatus');

const reportSchema = new mongoose.Schema({
  reporterUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  reportedUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  reportReason: { type: String, ref: 'ReportReason', required: true },
  severity: { type: Number, required: true, min: 1, max: 10 },
  status: { type: String, enum: Object.values(ReportStatus), default: ReportStatus.PENDING },
  message: { type: String },
  createdAt: { type: Date, default: Date.now }

}, {
  versionKey: false
});

reportSchema.index({ "status": 1 });
reportSchema.index({ "reporterUserId": 1 });
reportSchema.index({ "reportedUserId": 1 });
reportSchema.index({ "reportReason": 1 });

module.exports = mongoose.model('Report', reportSchema, 'reports');