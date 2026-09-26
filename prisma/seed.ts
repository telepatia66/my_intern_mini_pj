import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const adminPassword = await bcrypt.hash("Admin@123", 10);
    const internPassword = await bcrypt.hash("Intern@123", 10);

    const admin = await prisma.user.upsert({
        where: { email: "admin@test.com" },
        update: {},
        create: {
            email: "admin@test.com",
            passwordHash: adminPassword,
            name: "Admin Tester",
            role: "admin",
        },
    });

    const intern = await prisma.user.upsert({
        where: { email: "intern@test.com" },
        update: {},
        create: {
            email: "intern@test.com",
            passwordHash: internPassword,
            name: "Intern Tester",
            role: "intern",
        },
    });

    console.log("Seeded:", { admin: admin.email, intern: intern.email });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });