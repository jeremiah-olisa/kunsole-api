import { Prisma, PlanType } from "@prisma/client";

const plans: Prisma.PlanCreateManyInput[] = [
    {
        id: '680dd33a1431506c8d668eca',
        type: PlanType.SYSTEM,
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
        id: '680dd33a1431506c8d668ecb',
        type: PlanType.SYSTEM,
        name: 'Basic Plan',
        description: 'For small projects',
        price: 4000,
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
        id: '680dd33a1431506c8d668ecc',
        type: PlanType.SYSTEM,
        name: 'Gold Plan',
        description: 'For growing businesses',
        price: 13000,
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
        id: '680dd33a1431506c8d668ecd',
        type: PlanType.SYSTEM,
        name: 'Premium Plan',
        description: 'Enterprise-grade solution',
        price: 40000,
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

export async function seedPlans() {

    for (const { id: planId, ...plan } of plans) {
        const planResult = await prisma.plan.upsert({
            where: { id: planId }, // Find by id
            update: plan, // Update the plan if it exists
            create: { id: planId, ...plan }, // Create the plan if it doesn't exist
        });

        console.log(`Upserted plan: ${planResult.name}`);
    }
}
