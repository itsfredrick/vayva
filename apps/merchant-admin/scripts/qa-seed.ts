import { prisma } from '@vayva/db';
import { hash } from 'bcryptjs';

async function main() {
    const password = await hash('password123', 12);

    // 1. User A: New (Onboarding Incomplete)
    const userAEmail = 'qa_new@vayva.ng';
    await prisma.user.upsert({
        where: { email: userAEmail },
        update: {},
        create: {
            email: userAEmail,
            firstName: 'QA',
            lastName: 'New',
            password,
            isEmailVerified: true,
            memberships: {
                create: {
                    role: 'owner',
                    role_enum: 'OWNER',
                    store: {
                        create: {
                            name: 'QA New Store',
                            slug: 'qa-new-store',
                            onboardingCompleted: false,
                            category: 'retail'
                        }
                    }
                }
            }
        }
    });
    console.log('Created User A: qa_new@vayva.ng');

    // 2. User B: Existing (Onboarding Complete, Retail)
    const userBEmail = 'qa_existing@vayva.ng';
    await prisma.user.upsert({
        where: { email: userBEmail },
        update: {},
        create: {
            email: userBEmail,
            firstName: 'QA',
            lastName: 'Existing',
            password,
            isEmailVerified: true,
            memberships: {
                create: {
                    role: 'owner',
                    role_enum: 'OWNER',
                    store: {
                        create: {
                            name: 'QA Existing Store',
                            slug: 'qa-existing-store',
                            onboardingCompleted: true,
                            industrySlug: 'fashion',
                            settings: {
                                modules: { dashboard: true, catalog: true, sales: true }
                            }
                        }
                    }
                }
            }
        }
    });
    console.log('Created User B: qa_existing@vayva.ng');

    // 3. User C: Unverified
    const userCEmail = 'qa_unverified@vayva.ng';
    await prisma.user.upsert({
        where: { email: userCEmail },
        update: {},
        create: {
            email: userCEmail,
            firstName: 'QA',
            lastName: 'Unverified',
            password,
            isEmailVerified: false,
            memberships: {
                create: {
                    role: 'owner',
                    role_enum: 'OWNER',
                    store: {
                        create: {
                            name: 'QA Unverified Store',
                            slug: 'qa-unverified-store',
                            onboardingCompleted: false
                        }
                    }
                }
            }
        }
    });
    console.log('Created User C: qa_unverified@vayva.ng');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
