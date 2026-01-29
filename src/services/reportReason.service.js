const BaseResponse = require('../../shared/util/baseResponse');
const cache = require("../../shared/cache/cache");
const ReportReasonRepository = require('../repository/reportReason.repository');
const constants = require('../../shared/util/constants');
const consCache = require('../../shared/util/constants.cache');

const CACHE_TTL_SECS = process.env.MASTER_DATA_CACHE_TTL_SECS || 86400;

const getReportReasons = async () => {
    let reportReasons = cache.get(consCache.CACHE_KEY_REPORT_REASONS);
    if (!reportReasons || reportReasons.length === 0) {
        const sort = {};
        reportReasons = await ReportReasonRepository.findAllByStatus(constants.STATUS_ACTIVE, sort);
        cache.set(consCache.CACHE_KEY_REPORT_REASONS, reportReasons, CACHE_TTL_SECS);
    }

    return new BaseResponse(true, [], data = reportReasons);
};

module.exports = { getReportReasons };