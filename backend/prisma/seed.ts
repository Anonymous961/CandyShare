import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    const user = await prisma.user.create({
        data: {
            email: "testuser@example.com",
            name: "Test User",
        },
    });

    await prisma.file.create({
        data: {
            originalName: "example.txt",
            uniqueName: "uploads/testuser/example.txt",
            url: "uploads/testuser/example.txt",
            mimetype: "text/plain",
            size: 1234,
            uploadedAt: new Date(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
            status: "ACTIVE",
            userId: user.id,
        },
    });

    console.log("Seeded DB with test user and file!");
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })