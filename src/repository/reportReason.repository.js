const path = require('path');
const logger = require('../../shared/config/logger');
const filename = path.basename(__filename);
const c = require('../../shared/util/constants.frontcodes');
const DataLayerException = require('../../shared/exceptionHandler/DataLayerException');
const ReportReason = require('../models/reportReason.model');

const findAllByStatus = async (status, sorting) => {
    try {
        const query = ReportReason.find({ status: status }).lean();

        if (sorting && Object.keys(sorting).length > 0) {
            query.sort(sorting);
        }

        return query;
    } catch (err) {
        logger.error(`Error in findAllByStatus. Error: ${err}`, { className: filename });
        throw new DataLayerException(c.CODE_INTERNAL_SERVER_ERROR);
    }
}

module.exports = { findAllByStatus };