import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { logger } from "../src/config/logging.js";

const prisma = new PrismaClient();

const createRoles = async () => {
    const roles = [
        { id: 1, name: "admin" },
        { id: 2, name: "staff" },
        { id: 3, name: "member" }
    ];

    for (const role of roles) {
        const countRole = await prisma.role.count({
            where: {
                id: role.id
            }
        });

        if (countRole === 0) {
            await prisma.role.create({
                data: role
            });
            logger.info(`Role ${role.name} created successfully.`);
        } else {
            logger.info(`Role ${role.name} already exists.`);
        }
    }
};

const createAdminUser = async () => {
    const adminUsername = "admin";
    const adminPassword = "12345";
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const countAdmin = await prisma.user.count({
        where: {
            username: adminUsername
        }
    });

    if (countAdmin === 0) {
        const adminUser = await prisma.user.create({
            data: {
                username: adminUsername,
                password: hashedPassword,
                roleId: 1,
            }
        });

        await prisma.profile.create({
            data: {
                userId: adminUser.id,
            }
        });

        logger.info(`Admin user created successfully with username: ${adminUsername}`);
    } else {
        logger.info(`Admin user with username ${adminUsername} already exists.`);
    }
};

createRoles()
    .then(createAdminUser)
    .catch((e) => {
        logger.error('Error creating roles or admin user:', e);
        prisma.$disconnect();
    })
    .finally(() => {
        prisma.$disconnect();
    });