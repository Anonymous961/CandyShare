import { PrismaClient } from '../generated/prisma'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
    // Clear existing test files first
    await prisma.file.deleteMany({
        where: {
            originalName: {
                in: [
                    "test-no-password.pdf",
                    "test-with-password.pdf",
                    "alice-document.pdf",
                    "bob-presentation.pptx",
                    "charlie-secret.txt"
                ]
            }
        }
    });

    // Clear existing test users first
    await prisma.user.deleteMany({
        where: {
            email: {
                in: [
                    "testuser@example.com",
                    "alice@example.com",
                    "bob@example.com",
                    "charlie@example.com"
                ]
            }
        }
    });

    // Create multiple test users
    const users = await Promise.all([
        prisma.user.create({
            data: {
                email: "testuser@example.com",
                name: "Test User",
            },
        }),
        prisma.user.create({
            data: {
                email: "alice@example.com",
                name: "Alice Johnson",
            },
        }),
        prisma.user.create({
            data: {
                email: "bob@example.com",
                name: "Bob Smith",
            },
        }),
        prisma.user.create({
            data: {
                email: "charlie@example.com",
                name: "Charlie Brown",
            },
        })
    ]);

    const user = users[0]; // Use first user for the main test files

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

    // Create additional files for other users
    const aliceFile = await prisma.file.create({
        data: {
            originalName: "alice-document.pdf",
            uniqueName: "uploads/free/alice_document.pdf",
            url: "uploads/free/alice_document.pdf",
            mimetype: "application/pdf",
            size: 250000, // 250KB
            uploadedAt: new Date(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            status: "ACTIVE",
            user: { connect: { id: users[1].id } },
            tier: "FREE",
            password: null,
            downloadCount: 0,
            lastDownloadedAt: null
        },
    });

    const bobFile = await prisma.file.create({
        data: {
            originalName: "bob-presentation.pptx",
            uniqueName: "uploads/anonymous/bob_presentation.pptx",
            url: "uploads/anonymous/bob_presentation.pptx",
            mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            size: 1200000, // 1.2MB
            uploadedAt: new Date(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
            status: "ACTIVE",
            user: { connect: { id: users[2].id } },
            tier: "ANONYMOUS",
            password: null,
            downloadCount: 0,
            lastDownloadedAt: null
        },
    });

    const charlieFile = await prisma.file.create({
        data: {
            originalName: "charlie-secret.txt",
            uniqueName: "uploads/pro/charlie_secret.txt",
            url: "uploads/pro/charlie_secret.txt",
            mimetype: "text/plain",
            size: 5000, // 5KB
            uploadedAt: new Date(),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            status: "ACTIVE",
            user: { connect: { id: users[3].id } },
            tier: "PRO",
            password: await bcrypt.hash("charlie123", 10),
            downloadCount: 0,
            lastDownloadedAt: null
        },
    });

    console.log("🎉 Test data created!");
    console.log("\n👥 Users created:");
    users.forEach((u, i) => {
        console.log(`  ${i + 1}. ${u.name} (${u.email})`);
    });

    console.log("\n📁 Files created:");
    console.log(`  - PRO (no password): ${proFileNoPassword.id}`);
    console.log(`  - PRO (with password): ${proFileWithPassword.id}`);
    console.log(`  - FREE (Alice): ${aliceFile.id}`);
    console.log(`  - ANONYMOUS (Bob): ${bobFile.id}`);
    console.log(`  - PRO (Charlie, password): ${charlieFile.id}`);

    console.log("\n🔐 Passwords:");
    console.log(`  - testuser PRO file: test123`);
    console.log(`  - charlie PRO file: charlie123`);

    console.log("\n🔗 Test URLs:");
    console.log(`  - PRO (no password): http://localhost:3000/download/${proFileNoPassword.id}`);
    console.log(`  - PRO (with password): http://localhost:3000/download/${proFileWithPassword.id}`);
    console.log(`  - FREE (Alice): http://localhost:3000/download/${aliceFile.id}`);
    console.log(`  - ANONYMOUS (Bob): http://localhost:3000/download/${bobFile.id}`);
    console.log(`  - PRO (Charlie, password): http://localhost:3000/download/${charlieFile.id}`);
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
