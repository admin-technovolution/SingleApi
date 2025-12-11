const CancelReason = {
    USER_CANCELED: { value: 0, description: 'The user canceled the subscription' },
    SYSTEM_CANCELED: { value: 1, description: 'The system canceled the subscription (e.g., due to a billing issue)' },
    REPLACED: { value: 2, description: 'The subscription was replaced by a new subscription' },
    DEVELOPER_CANCELED: { value: 3, description: 'The developer canceled the subscription' },
};

module.exports = CancelReason;
