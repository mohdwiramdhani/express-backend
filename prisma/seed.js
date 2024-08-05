import { PrismaClient } from "@prisma/client";
import { logger } from "./config/logging.js";

const prisma = new PrismaClient();

const createRoles = async () => {
    const roles = [
        { id: 1, name: "admin" },
        { id: 2, name: "staff" }
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

createRoles()
    .catch((e) => {
        logger.error('Error creating roles:', e);
        prisma.$disconnect();
    })
    .finally(() => {
        prisma.$disconnect();
    });