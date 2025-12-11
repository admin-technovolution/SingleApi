const PaymentState = {
    PENDING: { value: 0, description: 'Payment pending' },
    RECEIVED: { value: 1, description: 'Payment received' },
    FREE_TRIAL: { value: 2, description: 'Free trial period' },
    PENDING_DEFERRED_CHANGE: { value: 3, description: 'Deferred upgrade or downgrade change that is still pending' },
};

module.exports = PaymentState;
