const EnumSubscriptionNotification = {
    SUBSCRIPTION_RECOVERED: { value: 1, description: 'The subscription was recovered from a pause or hold' },
    SUBSCRIPTION_RENEWED: { value: 2, description: 'The subscription was automatically renewed' },
    SUBSCRIPTION_CANCELED: { value: 3, description: 'The subscription was canceled by the user or the system' },
    SUBSCRIPTION_PURCHASED: { value: 4, description: 'A new subscription was purchased' },
    SUBSCRIPTION_ON_HOLD: { value: 5, description: 'The subscription is on hold due to a payment issue' },
    SUBSCRIPTION_IN_GRACE_PERIOD: { value: 6, description: 'The subscription is in a grace period after a failed payment' },
    SUBSCRIPTION_RESTARTED: { value: 7, description: 'The user restarted the subscription before it expired' },
    SUBSCRIPTION_PRICE_CHANGE_CONFIRMED: { value: 8, description: 'The user accepted a price change' },
    SUBSCRIPTION_DEFERRED: { value: 9, description: 'The renewal was deferred to a later date' },
    SUBSCRIPTION_PAUSED: { value: 10, description: 'The user paused the subscription' },
    SUBSCRIPTION_PAUSE_SCHEDULE_CHANGED: { value: 11, description: 'The pause schedule for the subscription was changed' },
    SUBSCRIPTION_REVOKED: { value: 12, description: 'The subscription was revoked due to a refund or chargeback' },
    SUBSCRIPTION_EXPIRED: { value: 13, description: 'The subscription expired and was not renewed' },
};

module.exports = EnumSubscriptionNotification;
