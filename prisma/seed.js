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
            where: { id: role.id }
        });

        if (countRole === 0) {
            await prisma.role.create({ data: role });
            logger.info(`Role ${role.name} created successfully.`);
        } else {
            logger.info(`Role ${role.name} already exists.`);
        }
    }
};

const createWorkUnits = async () => {
    const workUnits = [
        { name: "Dinas Bina Marga" },
        { name: "Dinas Perpustakaan" },
        { name: "BPS" }
    ];

    for (const workUnit of workUnits) {
        const countWorkUnit = await prisma.workUnit.count({
            where: { name: workUnit.name }
        });

        if (countWorkUnit === 0) {
            await prisma.workUnit.create({ data: workUnit });
            logger.info(`Work unit ${workUnit.name} created successfully.`);
        } else {
            logger.info(`Work unit ${workUnit.name} already exists.`);
        }
    }
};

const createUser = async (username, password, roleId) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const countUser = await prisma.user.count({
        where: { username }
    });

    if (countUser === 0) {
        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                roleId
            }
        });

        await prisma.profile.create({
            data: { userId: user.id }
        });

        logger.info(`${roleId === 1 ? 'Admin' : 'Staff'} user created successfully with username: ${username}`);
    } else {
        logger.info(`${roleId === 1 ? 'Admin' : 'Staff'} user with username ${username} already exists.`);
    }
};

const createMember = async (fullName, nik, phoneNumber, address, dateOfBirth, workUnitName) => {

    const usernamePassword = nik;

    const hashedPassword = await bcrypt.hash(usernamePassword, 10);

    const countMember = await prisma.member.count({
        where: { username: usernamePassword }
    });

    const workUnit = await prisma.workUnit.findFirst({
        where: { name: workUnitName }
    });

    if (countMember === 0) {
        const member = await prisma.member.create({
            data: {
                username: usernamePassword,
                password: hashedPassword,
                roleId: 3
            }
        });

        await prisma.memberProfile.create({
            data: {
                fullName,
                nik,
                phoneNumber,
                address,
                dateOfBirth,
                workUnitId: workUnit?.id,
                memberId: member.id
            }
        });

        logger.info(`Member created successfully with username: ${usernamePassword}`);
    } else {
        logger.info(`Member with username ${usernamePassword} already exists.`);
    }
};

const seed = async () => {
    try {
        await createRoles();
        await createWorkUnits();
        await createUser("admin", "12345", 1);
        await createUser("staff", "12345", 2);
        await createMember("Uzumaki Naruto", "7204070203880002", "08123456789", "Jl. Lama", new Date("1988-03-02"), "Dinas Bina Marga");
        await createMember("Jane Smith", "7204060101980001", "08234567890", "Jl. Baru", new Date("1998-01-01"), "Dinas Perpustakaan");
    } catch (error) {
        logger.error('Error during seeding process:', error);
    } finally {
        await prisma.$disconnect();
    }
};

seed();