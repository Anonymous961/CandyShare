import { PrismaClient } from './generated/prisma'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
    // Clear existing test files first
    await prisma.file.deleteMany({
        where: {
            originalName: {
                in: ["test-no-password.pdf", "test-with-password.pdf"]
            }
        }
    });

    // Get or create a test user
    let user = await prisma.user.findUnique({
        where: { email: "testuser@example.com" }
    });

    if (!user) {
        user = await prisma.user.create({
            data: {
                email: "testuser@example.com",
                name: "Test User",
            },
        });
    }

    const tierMapping = {
        "anonymous": "ANONYMOUS",
        "free": "FREE",
        "pro": "PRO"
    };
    const tier = "pro"
    const prismaTier = tierMapping[tier as keyof typeof tierMapping] || "ANONYMOUS";

    // Create a PRO file WITHOUT password
    const proFileNoPassword = await prisma.file.create({
        data: {
            originalName: "test-no-password.pdf",
            uniqueName: "uploads/pro/1234567891_test-no-password.pdf",
            url: "uploads/pro/1234567891_test-no-password.pdf",
            mimetype: "application/pdf",
            size: 500000, // 500KB
            uploadedAt: new Date(),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            status: "ACTIVE",
            user: { connect: { id: user.id } },
            tier: prismaTier as any,
            password: null, // No password
            downloadCount: 0,
            lastDownloadedAt: null
        },
    });

    // Create a PRO file WITH password
    const hashedPassword = await bcrypt.hash("test123", 10);

    const proFileWithPassword = await prisma.file.create({
        data: {
            originalName: "test-with-password.pdf",
            uniqueName: "uploads/pro/1234567892_test-with-password.pdf",
            url: "uploads/pro/1234567892_test-with-password.pdf",
            mimetype: "application/pdf",
            size: 750000, // 750KB
            uploadedAt: new Date(),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            status: "ACTIVE",
            user: { connect: { id: user.id } },
            tier: "PRO",
            password: hashedPassword, // Password protected!
            downloadCount: 0,
            lastDownloadedAt: null
        },
    });

    console.log("🎉 Test files created!");
    console.log("📁 File IDs:");
    console.log(`  - No password: ${proFileNoPassword.id}`);
    console.log(`  - With password: ${proFileWithPassword.id}`);
    console.log("\n🔐 Password: test123");
    console.log("\n🔗 Test URLs:");
    console.log(`  - No password: http://localhost:3000/download/${proFileNoPassword.id}`);
    console.log(`  - With password: http://localhost:3000/download/${proFileWithPassword.id}`);
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
