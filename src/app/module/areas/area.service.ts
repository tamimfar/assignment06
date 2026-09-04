import { prisma } from "../../lib/prisma";

const createArea = async (payload: {
    name: string;
    district: string;
    division: string;
    description?: string;
}) => {

    const existingArea = await prisma.area.findFirst({
        where: {
            name: payload.name,
            district: payload.district,
        },
    });

    if (existingArea) {
        throw new Error(
            "This area already exists in this district."
        );
    }

    const area = await prisma.area.create({
        data: {
            name: payload.name,
            district: payload.district,
            division: payload.division,
            description: payload.description,
        },
    });

    return area;
};


const getAllAreas = async () => {

    const areas = await prisma.area.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });

    return areas;
};


const getAreaById = async (id: string) => {

    const area = await prisma.area.findUnique({
        where: {
            id,
        },
    });

    if (!area) {
        throw new Error("Area not found.");
    }

    return area;
};


const updateArea = async (
    id: string,
    payload: {
        name?: string;
        district?: string;
        division?: string;
        description?: string;
        isActive?: boolean;
    }
) => {

    const existingArea = await prisma.area.findUnique({
        where: {
            id,
        },
    });

    if (!existingArea) {
        throw new Error("Area not found.");
    }

    const area = await prisma.area.update({
        where: {
            id,
        },
        data: payload,
    });

    return area;
};


const deleteArea = async (id: string) => {

    const existingArea = await prisma.area.findUnique({
        where: {
            id,
        },
    });

    if (!existingArea) {
        throw new Error("Area not found.");
    }

    /*
     * Check whether this area is being used
     * by schedules or complaints.
     */

    const scheduleCount = await prisma.loadSheddingSchedule.count({
        where: {
            areaId: id,
        },
    });

    const complaintCount = await prisma.complaint.count({
        where: {
            areaId: id,
        },
    });

    if (scheduleCount > 0 || complaintCount > 0) {
        throw new Error(
            "This area cannot be deleted because it is already being used."
        );
    }

    await prisma.area.delete({
        where: {
            id,
        },
    });

    return null;
};


export const areaService = {
    createArea,
    getAllAreas,
    getAreaById,
    updateArea,
    deleteArea,
};