import { ComplaintStatus,UserRole } from "../../../generated/prisma/enums";

import { prisma } from "../../lib/prisma";
import type {
    CreateComplaintInput,
    UpdateComplaintInput,
} from "./complaint.validation";

const createComplaint = async (
    userId: string,
    payload: CreateComplaintInput
) => {
    // Check area
    const area = await prisma.area.findUnique({
        where: {
            id: payload.areaId,
        },
    });

    if (!area) {
        throw new Error("Area not found.");
    }

    if (!area.isActive) {
        throw new Error("This area is currently inactive.");
    }

    const complaint = await prisma.complaint.create({
        data: {
            userId,

            areaId: payload.areaId,

            title: payload.title,

            description: payload.description,

            priority: payload.priority,

            address: payload.address,

            status: ComplaintStatus.PENDING,
        },

        include: {
            area: true,
        },
    });

    return complaint;
};


const getComplaints = async (
    userId: string,
    role: UserRole
) => {
    let where = {};

    // USER → only own complaints
    if (role === UserRole.USER) {
        where = {
            userId,
        };
    }

    // TECHNICIAN → only assigned complaints
    if (role === UserRole.TECHNICIAN) {
        where = {
            assignment: {
                technicianId: userId,
            },
        };
    }

    // ADMIN → all complaints
    if (role === UserRole.ADMIN) {
        where = {};
    }

    const complaints = await prisma.complaint.findMany({
        where,

        include: {
            area: true,

            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                },
            },

            assignment: {
                include: {
                    technician: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phone: true,
                        },
                    },

                    assignedBy: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            },

            payment: true,

            review: true,
        },

        orderBy: {
            createdAt: "desc",
        },
    });

    return complaints;
};


const getComplaintById = async (
    complaintId: string,
    userId: string,
    role: UserRole
) => {
    const complaint = await prisma.complaint.findUnique({
        where: {
            id: complaintId,
        },

        include: {
            area: true,

            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                },
            },

            assignment: {
                include: {
                    technician: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phone: true,
                        },
                    },

                    assignedBy: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            },

            payment: true,

            review: true,
        },
    });

    if (!complaint) {
        throw new Error("Complaint not found.");
    }

    // USER can only see own complaint
    if (
        role === UserRole.USER &&
        complaint.userId !== userId
    ) {
        throw new Error(
            "Forbidden. You can only access your own complaints."
        );
    }

    // TECHNICIAN can only see assigned complaint
    if (role === UserRole.TECHNICIAN) {
        if (
            !complaint.assignment ||
            complaint.assignment.technicianId !== userId
        ) {
            throw new Error(
                "Forbidden. This complaint is not assigned to you."
            );
        }
    }

    return complaint;
};


const updateComplaint = async (
    complaintId: string,
    userId: string,
    role: UserRole,
    payload: UpdateComplaintInput
) => {
    const complaint = await prisma.complaint.findUnique({
        where: {
            id: complaintId,
        },

        include: {
            assignment: true,
        },
    });

    if (!complaint) {
        throw new Error("Complaint not found.");
    }


    // ==========================================
    // USER
    // ==========================================

    if (role === UserRole.USER) {

        if (complaint.userId !== userId) {
            throw new Error(
                "Forbidden. You can only update your own complaint."
            );
        }

        if (complaint.status !== ComplaintStatus.PENDING) {
            throw new Error(
                "You can only update a complaint while it is pending."
            );
        }

        // User cannot change complaint status
        if (payload.status) {
            if (payload.status !== ComplaintStatus.CANCELLED) {
                throw new Error(
                    "You cannot change the complaint status."
                );
            }
        }

        const {
            status,
            ...userUpdateData
        } = payload;

        const updateData = status
            ? {
                ...userUpdateData,
                status: ComplaintStatus.CANCELLED,
            }
            : userUpdateData;

        return prisma.complaint.update({
            where: {
                id: complaintId,
            },

            data: updateData,

            include: {
                area: true,
            },
        });
    }


    // ==========================================
    // TECHNICIAN
    // ==========================================

    if (role === UserRole.TECHNICIAN) {

        if (
            !complaint.assignment ||
            complaint.assignment.technicianId !== userId
        ) {
            throw new Error(
                "Forbidden. This complaint is not assigned to you."
            );
        }

        // Technician can only update status
    

        if (
            !payload.status ||
            (payload.status !== ComplaintStatus.IN_PROGRESS &&
                payload.status !== ComplaintStatus.RESOLVED)
        ) {
            throw new Error(
                "Technician can only change status to IN_PROGRESS or RESOLVED."
            );
        }

        // Status flow
        if (
            payload.status === ComplaintStatus.IN_PROGRESS &&
            complaint.status !== ComplaintStatus.ASSIGNED
        ) {
            throw new Error(
                "Complaint must be assigned before starting work."
            );
        }

        if (
            payload.status === ComplaintStatus.RESOLVED &&
            complaint.status !== ComplaintStatus.IN_PROGRESS
        ) {
            throw new Error(
                "Complaint must be in progress before resolving."
            );
        }

        return prisma.complaint.update({
            where: {
                id: complaintId,
            },

            data: {
                status: payload.status,

                resolvedAt:
                    payload.status === ComplaintStatus.RESOLVED
                        ? new Date()
                        : null,
            },

            include: {
                area: true,

                assignment: {
                    include: {
                        technician: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                phone: true,
                            },
                        },
                    },
                },
            },
        });
    }


    // ==========================================
    // ADMIN
    // ==========================================

    if (role === UserRole.ADMIN) {

        let resolvedAt = complaint.resolvedAt;

        if (payload.status === ComplaintStatus.RESOLVED) {
            resolvedAt = new Date();
        }

        if (
            payload.status &&
            payload.status !== ComplaintStatus.RESOLVED
        ) {
            resolvedAt = null;
        }

        return prisma.complaint.update({
            where: {
                id: complaintId,
            },

            data: {
                ...(payload.areaId !== undefined && {
                    areaId: payload.areaId,
                }),

                ...(payload.title !== undefined && {
                    title: payload.title,
                }),

                ...(payload.description !== undefined && {
                    description: payload.description,
                }),

                ...(payload.priority !== undefined && {
                    priority: payload.priority,
                }),

                ...(payload.address !== undefined && {
                    address: payload.address,
                }),

                ...(payload.status !== undefined && {
                    status: payload.status,
                }),

                resolvedAt,
            },

            include: {
                area: true,

                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                    },
                },

                assignment: true,
            },
        });
    }

    throw new Error("Invalid user role.");
};


const deleteComplaint = async (
    complaintId: string,
    userId: string,
    role: UserRole
) => {
    const complaint = await prisma.complaint.findUnique({
        where: {
            id: complaintId,
        },

        include: {
            assignment: true,
            payment: true,
            review: true,
        },
    });

    if (!complaint) {
        throw new Error("Complaint not found.");
    }


    // USER permission
    if (role === UserRole.USER) {

        if (complaint.userId !== userId) {
            throw new Error(
                "Forbidden. You can only delete your own complaint."
            );
        }

        if (complaint.status !== ComplaintStatus.PENDING) {
            throw new Error(
                "You can only delete a pending complaint."
            );
        }
    }


    // TECHNICIAN cannot delete
    if (role === UserRole.TECHNICIAN) {
        throw new Error(
            "Forbidden. Technician cannot delete complaints."
        );
    }


    // Don't delete if related records exist
    if (
        complaint.assignment ||
        complaint.payment ||
        complaint.review
    ) {
        throw new Error(
            "This complaint cannot be deleted because it is already being processed."
        );
    }


    await prisma.complaint.delete({
        where: {
            id: complaintId,
        },
    });

    return null;
};


export const complaintService = {
    createComplaint,
    getComplaints,
    getComplaintById,
    updateComplaint,
    deleteComplaint,
};