const BaseResponse = require('../../shared/util/baseResponse');
const constants = require('../../shared/util/constants');
const jwt = require('./jwt');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const isAdult = (date) => {
    const today = new Date();
    const birthDate = new Date(date);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= 18;
    }
    return age >= 18;
};

const generateVerificationCode = () => {
    return crypto.randomInt(100000, 999999).toString();
};

const generateHash = async (value, isBcrypt) => {
    if (isBcrypt) {
        return await bcrypt.hash(value, 10);
    } else {
        return crypto.createHash('sha256').update(value).digest('hex');
    }
};

const generateRandomHash = () => {
    return crypto.randomBytes(40).toString('hex');
};

const maxDecimals = (max) => {
    return (value, helpers) => {
        const decimalPart = value.toString().split('.')[1];
        if (decimalPart && decimalPart.length > max) {
            return helpers.error('number.maxDecimals', { max });
        }
        return value;
    };
}

function isValidSocketPayload(socket, eventName, schema, payload) {
    const decoded = jwt.verifyJwtToken(socket.token);
    if (decoded === '') {
        const response = new BaseResponse(false, [constants.ERROR_UNAUTHORIZED]);
        socket.emit(eventName, JSON.stringify(response));
        socket.disconnect(true);
        return false;
    }
    const { error } = schema.validate(payload, { abortEarly: false });

    if (error) {
        const messages = error.details.map(d => d.message);
        const response = new BaseResponse(false, messages);
        socket.emit(eventName, JSON.stringify(response));
        return false;
    }

    return true;
}

function getEnumByValue(EnumType, value, enumName = 'EnumType') {
    for (const [key, item] of Object.entries(EnumType)) {
        if (item.value === value) {
            return { key, ...item };
        }
    }

    return `${constants.UNKNOWN_NOTIFICATION_TYPE} for ${enumName} and value: ${value}`;
}



module.exports = { generateVerificationCode, generateHash, maxDecimals, generateRandomHash, isAdult, isValidSocketPayload, getEnumByValue };