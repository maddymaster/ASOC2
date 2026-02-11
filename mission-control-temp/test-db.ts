import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

async function main() {
    try {
        console.log('Connecting to database...');
        // Attempt to query the database
        const userCount = await prisma.user.count();
        console.log(`Successfully connected! User count: ${userCount}`);

        const sessionCount = await prisma.chatSession.count();
        console.log(`ChatSession count: ${sessionCount}`);

        // Create a dummy session to verify write access
        const user = await prisma.user.findFirst();
        if (user) {
            console.log(`Found user: ${user.id}, creating test session...`);
            const session = await prisma.chatSession.create({
                data: {
                    userId: user.id,
                    title: 'Test Session',
                }
            });
            console.log(`Created session: ${session.id}`);

            // Clean up
            await prisma.chatSession.delete({ where: { id: session.id } });
            console.log('Deleted test session.');
        } else {
            console.log('No users found to create session.');
        }

    } catch (error) {
        console.error('Error connecting to database:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
