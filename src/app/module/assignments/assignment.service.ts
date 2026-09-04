import {
    AssignmentStatus,
    ComplaintStatus,
    UserRole,
} from "../../../generated/prisma/enums";

import { prisma } from "../../lib/prisma";

import type {
    CreateAssignmentInput,
    UpdateAssignmentInput,
} from "./assignment.validation";


// =====================================================
// CREATE ASSIGNMENT
// ADMIN ONLY
// =====================================================

const createAssignment = async (
    adminId: string,
    payload: CreateAssignmentInput
) => {

    const result = await prisma.$transaction(async (tx) => {

        // ---------------------------------------------
        // Check complaint
        // ---------------------------------------------

        const complaint = await tx.complaint.findUnique({
            where: {
                id: payload.complaintId,
            },

            include: {
                assignment: true,
            },
        });


        if (!complaint) {
            throw new Error("Complaint not found.");
        }


        // ---------------------------------------------
        // Check complaint status
        // ---------------------------------------------

        if (
            complaint.status !== ComplaintStatus.PENDING
        ) {
            throw new Error(
                "Only pending complaints can be assigned."
            );
        }


        // ---------------------------------------------
        // Check existing assignment
        // ---------------------------------------------

        if (complaint.assignment) {
            throw new Error(
                "This complaint is already assigned."
            );
        }


        // ---------------------------------------------
        // Check technician
        // ---------------------------------------------

        const technician = await tx.user.findUnique({
            where: {
                id: payload.technicianId,
            },
        });


        if (!technician) {
            throw new Error(
                "Technician not found."
            );
        }


        // ---------------------------------------------
        // Check technician role
        // ---------------------------------------------

        if (
            technician.role !== UserRole.TECHNICIAN
        ) {
            throw new Error(
                "Selected user is not a technician."
            );
        }


        // ---------------------------------------------
        // Check technician status
        // ---------------------------------------------

        if (
            technician.status !== "ACTIVE"
        ) {
            throw new Error(
                "Technician account is not active."
            );
        }


        // ---------------------------------------------
        // Create assignment
        // ---------------------------------------------

        const assignment = await tx.assignment.create({
            data: {
                complaintId:
                    payload.complaintId,

                technicianId:
                    payload.technicianId,

                assignedById:
                    adminId,

                status:
                    AssignmentStatus.PENDING,
            },

            include: {
                complaint: {
                    include: {
                        area: true,
                    },
                },

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
        });


        // ---------------------------------------------
        // Update complaint
        // ---------------------------------------------

        await tx.complaint.update({
            where: {
                id: payload.complaintId,
            },

            data: {
                status:
                    ComplaintStatus.ASSIGNED,
            },
        });


        return assignment;
    });


    return result;
};


// =====================================================
// GET ALL ASSIGNMENTS
// ADMIN → ALL
// TECHNICIAN → OWN
// =====================================================

const getAssignments = async (
    userId: string,
    role: UserRole
) => {

    const where =
        role === UserRole.ADMIN
            ? {}
            : {
                technicianId: userId,
            };


    const assignments =
        await prisma.assignment.findMany({

            where,

            include: {
                complaint: {
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
                    },
                },

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

            orderBy: {
                createdAt: "desc",
            },
        });


    return assignments;
};


// =====================================================
// GET SINGLE ASSIGNMENT
// =====================================================

const getAssignmentById = async (
    assignmentId: string,
    userId: string,
    role: UserRole
) => {

    const assignment =
        await prisma.assignment.findUnique({

            where: {
                id: assignmentId,
            },

            include: {
                complaint: {
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
                    },
                },

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
        });


    if (!assignment) {
        throw new Error(
            "Assignment not found."
        );
    }


    // Technician can only access own assignment

    if (
        role === UserRole.TECHNICIAN &&
        assignment.technicianId !== userId
    ) {
        throw new Error(
            "Forbidden. This assignment is not assigned to you."
        );
    }


    return assignment;
};


// =====================================================
// UPDATE ASSIGNMENT
// TECHNICIAN / ADMIN
// =====================================================

const updateAssignment = async (
    assignmentId: string,
    userId: string,
    role: UserRole,
    payload: UpdateAssignmentInput
) => {

    const assignment =
        await prisma.assignment.findUnique({

            where: {
                id: assignmentId,
            },

            include: {
                complaint: true,
            },
        });


    if (!assignment) {
        throw new Error(
            "Assignment not found."
        );
    }


    // =================================================
    // TECHNICIAN
    // =================================================

    if (role === UserRole.TECHNICIAN) {

        if (
            assignment.technicianId !== userId
        ) {
            throw new Error(
                "Forbidden. This assignment is not assigned to you."
            );
        }


        const currentStatus =
            assignment.status;

        const newStatus =
            payload.status;


        // ---------------------------------------------
        // ACCEPT
        // ---------------------------------------------

        if (
            newStatus === AssignmentStatus.ACCEPTED
        ) {

            if (
                currentStatus !==
                AssignmentStatus.PENDING
            ) {
                throw new Error(
                    "Only pending assignments can be accepted."
                );
            }
        }


        // ---------------------------------------------
        // START WORK
        // ---------------------------------------------

        if (
            newStatus ===
            AssignmentStatus.IN_PROGRESS
        ) {

            if (
                currentStatus !==
                AssignmentStatus.ACCEPTED
            ) {
                throw new Error(
                    "Assignment must be accepted before starting work."
                );
            }
        }


        // ---------------------------------------------
        // COMPLETE
        // ---------------------------------------------

        if (
            newStatus ===
            AssignmentStatus.COMPLETED
        ) {

            if (
                currentStatus !==
                AssignmentStatus.IN_PROGRESS
            ) {
                throw new Error(
                    "Assignment must be in progress before completing."
                );
            }
        }


        // ---------------------------------------------
        // REJECT
        // ---------------------------------------------

        if (
            newStatus ===
            AssignmentStatus.REJECTED
        ) {

            if (
                currentStatus !==
                AssignmentStatus.PENDING
            ) {
                throw new Error(
                    "Only pending assignments can be rejected."
                );
            }
        }


        // Technician cannot cancel
        if (
            newStatus ===
            AssignmentStatus.CANCELLED
        ) {
            throw new Error(
                "Technician cannot cancel an assignment."
            );
        }


        const result =
            await prisma.$transaction(
                async (tx) => {

                    const updatedAssignment =
                        await tx.assignment.update({

                            where: {
                                id: assignmentId,
                            },

                            data: {
                                status:
                                    newStatus,
                            },

                            include: {
                                complaint: true,

                                technician: {
                                    select: {
                                        id: true,
                                        name: true,
                                        email: true,
                                        phone: true,
                                    },
                                },
                            },
                        });


                    // ---------------------------------
                    // COMPLETED
                    // ---------------------------------

                    if (
                        newStatus ===
                        AssignmentStatus.COMPLETED
                    ) {

                        await tx.complaint.update({
                            where: {
                                id: assignment.complaintId,
                            },

                            data: {
                                status:
                                    ComplaintStatus.RESOLVED,

                                resolvedAt:
                                    new Date(),
                            },
                        });
                    }


                    return updatedAssignment;
                }
            );


        return result;
    }


    // =================================================
    // ADMIN
    // =================================================

    if (role === UserRole.ADMIN) {

        // Admin can update status

        const result =
            await prisma.$transaction(
                async (tx) => {

                    const updatedAssignment =
                        await tx.assignment.update({

                            where: {
                                id: assignmentId,
                            },

                            data: {
                                status:
                                    payload.status,
                            },

                            include: {
                                complaint: true,

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
                        });


                    // If admin marks completed
                    if (
                        payload.status ===
                        AssignmentStatus.COMPLETED
                    ) {

                        await tx.complaint.update({
                            where: {
                                id: assignment.complaintId,
                            },

                            data: {
                                status:
                                    ComplaintStatus.RESOLVED,

                                resolvedAt:
                                    new Date(),
                            },
                        });
                    }


                    // If cancelled/rejected
                    if (
                        payload.status ===
                        AssignmentStatus.CANCELLED ||
                        payload.status ===
                        AssignmentStatus.REJECTED
                    ) {

                        await tx.complaint.update({
                            where: {
                                id: assignment.complaintId,
                            },

                            data: {
                                status:
                                    ComplaintStatus.PENDING,

                                resolvedAt:
                                    null,
                            },
                        });
                    }


                    return updatedAssignment;
                }
            );


        return result;
    }


    throw new Error(
        "Invalid user role."
    );
};


// =====================================================
// DELETE ASSIGNMENT
// ADMIN ONLY
// =====================================================

const deleteAssignment = async (
    assignmentId: string
) => {

    const assignment =
        await prisma.assignment.findUnique({

            where: {
                id: assignmentId,
            },
        });


    if (!assignment) {
        throw new Error(
            "Assignment not found."
        );
    }


    if (
        assignment.status ===
        AssignmentStatus.IN_PROGRESS
    ) {
        throw new Error(
            "You cannot delete an assignment while work is in progress."
        );
    }


    if (
        assignment.status ===
        AssignmentStatus.COMPLETED
    ) {
        throw new Error(
            "Completed assignments cannot be deleted."
        );
    }


    await prisma.$transaction(
        async (tx) => {

            await tx.assignment.delete({
                where: {
                    id: assignmentId,
                },
            });


            await tx.complaint.update({
                where: {
                    id: assignment.complaintId,
                },

                data: {
                    status:
                        ComplaintStatus.PENDING,

                    resolvedAt:
                        null,
                },
            });
        }
    );


    return null;
};


export const assignmentService = {
    createAssignment,
    getAssignments,
    getAssignmentById,
    updateAssignment,
    deleteAssignment,
};