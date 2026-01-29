const ReportReasonService = require('../services/reportReason.service');

const getReportReasons = async (req, res, next) => {
  try {
    let jsonResponse = await ReportReasonService.getReportReasons();
    res.status(200).json(jsonResponse);
  } catch (err) {
    next(err);
  }
};

module.exports = { getReportReasons };