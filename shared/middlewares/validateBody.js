const BaseResponse = require('../util/baseResponse');

module.exports = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const messages = error.details.map(detail => detail.message);
            const response = new BaseResponse(false, messages);
            return res.status(400).json(response);
        }
        next();
    };
};
