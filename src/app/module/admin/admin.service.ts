import {
    UserRole,
    UserStatus,
    ComplaintStatus,
    PaymentStatus,
} from "../../../generated/prisma/enums";

import { prisma } from "../../lib/prisma";

import type {
    UpdateUserRoleInput,
    UpdateUserStatusInput,
} from "./admin.validation";

// =====================================================
// GET ALL USERS
// =====================================================
const getAllUsers = async () => {
    const users =
        await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                avatar: true,
                role: true,
                status: true,
                emailVerified: true,
                createdAt: true,
                updatedAt: true,

                _count: {
                    select: {
                        complaints: true,
                        payments: true,
                        reviews: true,
                    },
                },
            },

            orderBy: {
                createdAt: "desc",
            },
        });

    return users;
};

// =====================================================
// GET SINGLE USER
// =====================================================
const getUserById = async (
    userId: string
) => {
    const user =
        await prisma.user.findUnique({
            where: {
                id: userId,
            },

            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                avatar: true,
                role: true,
                status: true,
                emailVerified: true,
                createdAt: true,
                updatedAt: true,

                complaints: {
                    select: {
                        id: true,
                        title: true,
                        status: true,
                        priority: true,
                        createdAt: true,
                    },

                    orderBy: {
                        createdAt: "desc",
                    },
                },

                payments: {
                    select: {
                        id: true,
                        amount: true,
                        currency: true,
                        method: true,
                        status: true,
                        transactionId: true,
                        paidAt: true,
                        createdAt: true,
                    },

                    orderBy: {
                        createdAt: "desc",
                    },
                },

                reviews: {
                    select: {
                        id: true,
                        rating: true,
                        comment: true,
                        status: true,
                        createdAt: true,
                    },

                    orderBy: {
                        createdAt: "desc",
                    },
                },
            },
        });

    if (!user) {
        throw new Error(
            "User not found."
        );
    }

    return user;
};

// =====================================================
// GET ALL TECHNICIANS
// =====================================================
const getAllTechnicians = async () => {
    const technicians =
        await prisma.user.findMany({
            where: {
                role: UserRole.TECHNICIAN,
            },

            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                avatar: true,
                role: true,
                status: true,
                emailVerified: true,
                createdAt: true,
                updatedAt: true,

                _count: {
                    select: {
                        complaints: true,
                        payments: true,
                        reviews: true,
                        technicianAssignments: true,
                    },
                },
            },

            orderBy: {
                createdAt: "desc",
            },
        });

    return technicians;
};

// =====================================================
// UPDATE USER STATUS
// =====================================================
const updateUserStatus = async (
    userId: string,
    payload: UpdateUserStatusInput
) => {
    const user =
        await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

    if (!user) {
        throw new Error(
            "User not found."
        );
    }

    // -------------------------------------------------
    // ADMIN ACCOUNT PROTECTION
    // -------------------------------------------------
    if (
        user.role === UserRole.ADMIN &&
        payload.status !== UserStatus.ACTIVE
    ) {
        throw new Error(
            "Admin account cannot be blocked or deactivated."
        );
    }

    const updatedUser =
        await prisma.user.update({
            where: {
                id: userId,
            },

            data: {
                status: payload.status,
            },

            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                status: true,
                emailVerified: true,
                updatedAt: true,
            },
        });

    return updatedUser;
};

// =====================================================
// UPDATE USER ROLE
// =====================================================
const updateUserRole = async (
    userId: string,
    payload: UpdateUserRoleInput
) => {
    const user =
        await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

    if (!user) {
        throw new Error(
            "User not found."
        );
    }

    // -------------------------------------------------
    // PREVENT ADMIN DEMOTION
    // -------------------------------------------------
    if (
        user.role === UserRole.ADMIN &&
        payload.role !== UserRole.ADMIN
    ) {
        throw new Error(
            "Admin role cannot be changed."
        );
    }

    const updatedUser =
        await prisma.user.update({
            where: {
                id: userId,
            },

            data: {
                role: payload.role,
            },

            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                status: true,
                emailVerified: true,
                updatedAt: true,
            },
        });

    return updatedUser;
};

// =====================================================
// DELETE USER
// =====================================================
const deleteUser = async (
    userId: string
) => {
    const user =
        await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

    if (!user) {
        throw new Error(
            "User not found."
        );
    }

    // -------------------------------------------------
    // ADMIN ACCOUNT PROTECTION
    // -------------------------------------------------
    if (
        user.role === UserRole.ADMIN
    ) {
        throw new Error(
            "Admin account cannot be deleted."
        );
    }

    // -------------------------------------------------
    // CHECK ACTIVE ASSIGNMENTS
    // -------------------------------------------------
    if (
        user.role === UserRole.TECHNICIAN
    ) {
        const activeAssignment =
            await prisma.assignment.findFirst({
                where: {
                    technicianId: userId,
                    status: {
                        in: [
                            "PENDING",
                            "ACCEPTED",
                            "IN_PROGRESS",
                        ],
                    },
                },
            });

        if (activeAssignment) {
            throw new Error(
                "Technician with active assignments cannot be deleted."
            );
        }
    }

    // -------------------------------------------------
    // DELETE USER
    // -------------------------------------------------
    await prisma.user.delete({
        where: {
            id: userId,
        },
    });

    return null;
};

// =====================================================
// ADMIN DASHBOARD
// =====================================================
const getDashboard = async () => {
    const [
        totalUsers,
        totalTechnicians,
        totalAdmins,
        totalAreas,
        totalSchedules,
        totalComplaints,
        pendingComplaints,
        resolvedComplaints,
        totalAssignments,
        totalPayments,
        paidPayments,
        totalReviews,
    ] = await prisma.$transaction([
        prisma.user.count({
            where: {
                role: UserRole.USER,
            },
        }),

        prisma.user.count({
            where: {
                role: UserRole.TECHNICIAN,
            },
        }),

        prisma.user.count({
            where: {
                role: UserRole.ADMIN,
            },
        }),

        prisma.area.count(),

        prisma.loadSheddingSchedule.count(),

        prisma.complaint.count(),

        prisma.complaint.count({
            where: {
                status: ComplaintStatus.PENDING,
            },
        }),

        prisma.complaint.count({
            where: {
                status: ComplaintStatus.RESOLVED,
            },
        }),

        prisma.assignment.count(),

        prisma.payment.count(),

        prisma.payment.count({
            where: {
                status: PaymentStatus.PAID,
            },
        }),

        prisma.review.count(),
    ]);

    return {
        users: {
            total: totalUsers,
        },

        technicians: {
            total: totalTechnicians,
        },

        admins: {
            total: totalAdmins,
        },

        areas: {
            total: totalAreas,
        },

        schedules: {
            total: totalSchedules,
        },

        complaints: {
            total: totalComplaints,
            pending: pendingComplaints,
            resolved: resolvedComplaints,
        },

        assignments: {
            total: totalAssignments,
        },

        payments: {
            total: totalPayments,
            paid: paidPayments,
        },

        reviews: {
            total: totalReviews,
        },
    };
};

export const adminService = {
    getAllUsers,
    getUserById,
    getAllTechnicians,
    updateUserStatus,
    updateUserRole,
    deleteUser,
    getDashboard,
};