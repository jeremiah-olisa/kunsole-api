const plans = [
    {
        type: 'FREE',
        name: 'Free Tier',
        description: 'Basic functionality with limitations',
        price: 0,
        maxApps: 1,
        maxUsers: 1,
        entryRetentionDays: 1,
        maxEntries: 100,
        features: {
            emailNotifications: false,
            webhooks: false,
            apiAccess: true
        }
    },
    {
        type: 'BASIC',
        name: 'Basic Plan',
        description: 'For small projects',
        price: 9.99,
        maxApps: 3,
        maxUsers: 5,
        entryRetentionDays: 7,
        maxEntries: 5000,
        features: {
            emailNotifications: true,
            webhooks: true,
            apiAccess: true
        }
    },
    {
        type: 'GOLD',
        name: 'Gold Plan',
        description: 'For growing businesses',
        price: 29.99,
        maxApps: 10,
        maxUsers: 20,
        entryRetentionDays: 30,
        maxEntries: 50000,
        features: {
            emailNotifications: true,
            webhooks: true,
            apiAccess: true,
            prioritySupport: true
        }
    },
    {
        type: 'PREMIUM',
        name: 'Premium Plan',
        description: 'Enterprise-grade solution',
        price: 99.99,
        maxApps: 100,
        maxUsers: 500,
        entryRetentionDays: 365,
        maxEntries: 0, // unlimited
        features: {
            emailNotifications: true,
            webhooks: true,
            apiAccess: true,
            prioritySupport: true,
            sso: true,
            customRetention: true
        }
    }
];