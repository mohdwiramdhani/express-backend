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
        { name: "SMP 3 Tolitoli" },
        { name: "SMP 2 Tolitoli" },
        { name: "SMP 1 Tolitoli" },
        { name: "SMK 1 Tolitoli" },
        { name: "SMA 1 Tolitoli" }
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

const createMember = async (memberNumber, fullName, nik, phoneNumber, address, dateOfBirth, workUnitName) => {
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
                memberNumber,
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

const createMultipleMembers = async (count) => {
    const workUnits = await prisma.workUnit.findMany();

    for (let i = 1; i <= count; i++) {
        const memberNumber = `${i.toString().padStart(3, '0')}`;
        const fullName = `Member ${i}`;

        const nikBase = "720407020388";
        const nik = `${nikBase}${i.toString().padStart(4, '0')}`;

        const phoneNumber = `0812345678${i.toString().padStart(3, '0')}`;
        const address = `Jl. Contoh No.${i}`;
        const dateOfBirth = new Date("1990-01-01");

        const randomWorkUnit = workUnits[Math.floor(Math.random() * workUnits.length)];

        await createMember(memberNumber, fullName, nik, phoneNumber, address, dateOfBirth, randomWorkUnit.name);
    }
};


const seed = async () => {
    try {
        await createRoles();
        await createWorkUnits();
        await createUser("admin", "12345", 1);
        await createUser("staff", "12345", 2);
        await createMultipleMembers(100);
    } catch (error) {
        logger.error('Error during seeding process:', error);
    } finally {
        await prisma.$disconnect();
    }
};

seed();