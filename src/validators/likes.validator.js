const Joi = require('joi');
const c = require('../../shared/util/constants.frontcodes');

/**
 * @swagger
 * components:
 *   schemas:
 *     LikesSchema:
 *       type: object
 *       required:
 *         - toUserId
 *       properties:
 *         toUserId:
 *           type: string
 *           example: 68c490865d8254ec33d4fb5f
 * 
 */
const likesSchema = Joi.object({
    toUserId: Joi.string().required()
        .messages({
            'any.required': c.CODE_TO_USERID_REQUIRED,
            'string.empty': c.CODE_TO_USERID_REQUIRED
        })
});

module.exports = {
    likesSchema
};
