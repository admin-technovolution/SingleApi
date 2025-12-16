const ObjectId = require("mongoose").Types.ObjectId;
const BaseResponse = require('../../shared/util/baseResponse');
const BusinessException = require('../../shared/exceptionHandler/BusinessException');
const c = require('../../shared/util/constants.frontcodes');
const constants = require('../../shared/util/constants');
const jwtUtil = require('../../shared/util/jwt');
const Report = require('../models/report.model');
const ReportRepository = require('../repository/report.repository');
const UserRepository = require('../repository/user.repository');
const ReportReasonService = require('./reportReason.service');

const report = async (req) => {
    const body = req.body;
    const auth = req.headers['authorization'];
    const userId = jwtUtil.getValueFromJwtToken(auth, 'id');
    await validateReport(body, userId);

    const { reportedUserId, reportReason, message } = body;

    const now = new Date();
    const start = new Date(now);
    const end = new Date(now);

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    const filter = {
        reporterUserId: new ObjectId(userId),
        reportedUserId: new ObjectId(reportedUserId),
        reportReason: reportReason,
        createdAt: { $gte: start, $lte: end }
    };
    const report = await ReportRepository.findOneByAnyFilter(filter);

    if (report) {
        report.message = message;

        await report.save();
    } else {
        const reportReasons = (await ReportReasonService.getReportReasons()).data;
        const reportReasonFound = await findSeverity(reportReasons, reportReason);

        const report = new Report({
            reporterUserId: new ObjectId(userId),
            reportedUserId: new ObjectId(reportedUserId),
            reportReason: reportReason,
            severity: reportReasonFound.severity,
            message: message
        });

        await ReportRepository.save(report);
    }

    const resMessage = c.CODE_SUCCESS;
    return new BaseResponse(true, [resMessage]);
};

const findSeverity = async (reportReasons, reportReason) => {
    const reportReasonFound = reportReasons.find(r => r._id === reportReason);

    if (!reportReasonFound?.severity) throw new BusinessException(c.CODE_SEVERITY_NOT_FOUND);

    return reportReasonFound;
}

const validateReport = async (body, userId) => {
    if (body.reportedUserId === userId) throw new BusinessException(c.CODE_ERROR_USER_CANNOT_REPORT_SELF);

    const existingToUser = await UserRepository.findOneByFilter({ _id: body.reportedUserId, status: constants.STATUS_DESC_ACTIVE });
    if (!existingToUser) throw new BusinessException(c.CODE_ERROR_USER_NOTFOUND);
};

module.exports = { report };
