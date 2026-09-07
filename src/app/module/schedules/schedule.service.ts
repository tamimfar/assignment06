import { prisma } from "../../lib/prisma";


interface CreateSchedulePayload {
    areaId: string;
    date: string;
    startTime: string;
    endTime: string;
    reason?: string;
}


interface UpdateSchedulePayload {
    areaId?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
    reason?: string;
    status?:
        | "SCHEDULED"
        | "IN_PROGRESS"
        | "COMPLETED"
        | "CANCELLED";
}


// ------------------------------------------------------------
// Helper: Validate time
// ------------------------------------------------------------

const validateTimeRange = (
    startTime: string,
    endTime: string
) => {

    if (startTime >= endTime) {
        throw new Error(
            "Start time must be earlier than end time."
        );
    }
};


// ------------------------------------------------------------
// Helper: Check area
// ------------------------------------------------------------

const checkArea = async (areaId: string) => {

    const area = await prisma.area.findUnique({
        where: {
            id: areaId,
        },
    });

    if (!area) {
        throw new Error("Area not found.");
    }

    if (!area.isActive) {
        throw new Error(
            "This area is inactive. You cannot create a schedule for this area."
        );
    }

    return area;
};


// ------------------------------------------------------------
// Helper: Check overlapping schedule
// ------------------------------------------------------------

const checkScheduleOverlap = async (
    areaId: string,
    date: Date,
    startTime: string,
    endTime: string,
    excludeId?: string
) => {

    const schedules = await prisma.loadSheddingSchedule.findMany({
        where: {
            areaId,
            date,

            ...(excludeId && {
                NOT: {
                    id: excludeId,
                },
            }),
        },
    });


    const hasOverlap = schedules.some((schedule) => {

        const existingStart = schedule.startTime;
        const existingEnd = schedule.endTime;

        return (
            startTime < existingEnd &&
            endTime > existingStart
        );
    });


    if (hasOverlap) {
        throw new Error(
            "This schedule overlaps with an existing schedule for this area."
        );
    }
};


// ------------------------------------------------------------
// Create Schedule
// ------------------------------------------------------------

const createSchedule = async (
    payload: CreateSchedulePayload
) => {

    await checkArea(payload.areaId);


    validateTimeRange(
        payload.startTime,
        payload.endTime
    );


    const date = new Date(
        `${payload.date}T00:00:00.000Z`
    );


    await checkScheduleOverlap(
        payload.areaId,
        date,
        payload.startTime,
        payload.endTime
    );


    const schedule =
        await prisma.loadSheddingSchedule.create({
            data: {
                areaId: payload.areaId,
                date,
                startTime: payload.startTime,
                endTime: payload.endTime,
                reason: payload.reason,
                status: "SCHEDULED",
            },

            include: {
                area: true,
            },
        });


    return schedule;
};


// ------------------------------------------------------------
// Get All Schedules
// ------------------------------------------------------------

const getAllSchedules = async (query: {
    search?: string;
    areaId?: string;
    status?: string;
    date?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    page?: string;
    limit?: string;
}) => {
    const {
        search,
        areaId,
        status,
        date,
        sortBy = "date",
        sortOrder = "asc",
        page = "1",
        limit = "10",
    } = query;

    const pageNumber = Math.max(Number(page) || 1, 1);
    const limitNumber = Math.min(
        Math.max(Number(limit) || 10, 1),
        100
    );

    const skip = (pageNumber - 1) * limitNumber;

    const where: any = {};

    // Search
    if (search) {
        where.OR = [
            {
                reason: {
                    contains: search,
                    mode: "insensitive",
                },
            },
            {
                area: {
                    name: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
            },
        ];
    }

    // Filter by area
    if (areaId) {
        where.areaId = areaId;
    }

    // Filter by status
    if (status) {
        where.status = status;
    }

    // Filter by date
    if (date) {
        where.date = date;
    }

    // Allowed sorting fields
    const allowedSortFields = [
        "date",
        "startTime",
        "endTime",
        "createdAt",
        "updatedAt",
    ];

    const safeSortBy = allowedSortFields.includes(sortBy)
        ? sortBy
        : "date";

    const safeSortOrder =
        sortOrder === "desc" ? "desc" : "asc";

    const [schedules, total] = await prisma.$transaction([
        prisma.loadSheddingSchedule.findMany({
            where,
            include: {
                area: true,
            },
            orderBy: {
                [safeSortBy]: safeSortOrder,
            },
            skip,
            take: limitNumber,
        }),

        prisma.loadSheddingSchedule.count({
            where,
        }),
    ]);

    return {
        schedules,
        meta: {
            page: pageNumber,
            limit: limitNumber,
            total,
            totalPages: Math.ceil(total / limitNumber),
        },
    };
};


// ------------------------------------------------------------
// Get Schedule By ID
// ------------------------------------------------------------

const getScheduleById = async (
    id: string
) => {

    const schedule =
        await prisma.loadSheddingSchedule.findUnique({

            where: {
                id,
            },

            include: {
                area: true,
            },
        });


    if (!schedule) {
        throw new Error(
            "Load shedding schedule not found."
        );
    }


    return schedule;
};


// ------------------------------------------------------------
// Update Schedule
// ------------------------------------------------------------

const updateSchedule = async (
    id: string,
    payload: UpdateSchedulePayload
) => {

    const existingSchedule =
        await prisma.loadSheddingSchedule.findUnique({
            where: {
                id,
            },
        });


    if (!existingSchedule) {
        throw new Error(
            "Load shedding schedule not found."
        );
    }


    const areaId =
        payload.areaId ?? existingSchedule.areaId;


    const date =
        payload.date
            ? new Date(
                `${payload.date}T00:00:00.000Z`
            )
            : existingSchedule.date;


    const startTime =
        payload.startTime ??
        existingSchedule.startTime;


    const endTime =
        payload.endTime ??
        existingSchedule.endTime;


    await checkArea(areaId);


    validateTimeRange(
        startTime,
        endTime
    );


    await checkScheduleOverlap(
        areaId,
        date,
        startTime,
        endTime,
        id
    );


    const schedule =
        await prisma.loadSheddingSchedule.update({

            where: {
                id,
            },

            data: {
                ...(payload.areaId && {
                    areaId: payload.areaId,
                }),

                ...(payload.date && {
                    date,
                }),

                ...(payload.startTime && {
                    startTime,
                }),

                ...(payload.endTime && {
                    endTime,
                }),

                ...(payload.reason !== undefined && {
                    reason: payload.reason,
                }),

                ...(payload.status && {
                    status: payload.status,
                }),
            },

            include: {
                area: true,
            },
        });


    return schedule;
};


// ------------------------------------------------------------
// Delete Schedule
// ------------------------------------------------------------

const deleteSchedule = async (
    id: string
) => {

    const existingSchedule =
        await prisma.loadSheddingSchedule.findUnique({
            where: {
                id,
            },
        });


    if (!existingSchedule) {
        throw new Error(
            "Load shedding schedule not found."
        );
    }


    await prisma.loadSheddingSchedule.delete({
        where: {
            id,
        },
    });


    return null;
};


export const scheduleService = {
    createSchedule,
    getAllSchedules,
    getScheduleById,
    updateSchedule,
    deleteSchedule,
};