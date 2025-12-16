const Joi = require('joi');
const c = require('../../shared/util/constants.frontcodes');

/**
 * @swagger
 * components:
 *   schemas:
 *     ReportSchema:
 *       type: object
 *       required:
 *         - reportedUserId
 *         - reportReason
 *       properties:
 *         reportedUserId:
 *           type: string
 *           example: 12c490865d8254ec44d4fb5f
 *         reportReason:
 *           type: string
 *           example: harassment
 *         message:
 *           type: string
 *           example: User is having offensive behaviour
 * 
 */
const reportSchema = Joi.object({
    reportedUserId: Joi.string().required()
        .messages({
            'any.required': c.CODE_REPORTED_USERID_REQUIRED,
            'string.empty': c.CODE_REPORTED_USERID_REQUIRED
        }),
    reportReason: Joi.string().required()
        .messages({
            'any.required': c.CODE_REPORT_REASON_REQUIRED,
            'string.empty': c.CODE_REPORT_REASON_REQUIRED
        }),
    message: Joi.string().max(512).optional()
        .messages({
            'string.max': c.CODE_REPORT_REASON_MAX
        })

});

module.exports = {
    reportSchema
};
