
import { ComplaintStatus, UserRole, PaymentStatus, PaymentMethod } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

import { getBkashIdToken } from "../../lib/bkash";

import config from "../../config";

import type {
    CreatePaymentInput,
} from "./payment.validation";


// =====================================================
// CREATE BKASH PAYMENT
// =====================================================

const createBkashPayment = async (
    userId: string,
    payload: CreatePaymentInput
) => {

    // -------------------------------------------------
    // Find complaint
    // -------------------------------------------------

    const complaint = await prisma.complaint.findUnique({
        where: {
            id: payload.complaintId,
        },

        include: {
            payment: true,
        },
    });


    if (!complaint) {
        throw new Error(
            "Complaint not found."
        );
    }


    // -------------------------------------------------
    // Check ownership
    // -------------------------------------------------

    if (complaint.userId !== userId) {
        throw new Error(
            "You can only pay for your own complaint."
        );
    }


    // -------------------------------------------------
    // Complaint must be resolved
    // -------------------------------------------------

    if (
        complaint.status !==
        ComplaintStatus.RESOLVED
    ) {
        throw new Error(
            "Payment is available only after the complaint is resolved."
        );
    }


    // -------------------------------------------------
    // Check existing payment
    // -------------------------------------------------

    if (complaint.payment) {

        if (
            complaint.payment.status ===
            PaymentStatus.PAID
        ) {
            throw new Error(
                "This complaint has already been paid."
            );
        }

        if (
            complaint.payment.status ===
            PaymentStatus.PROCESSING
        ) {
            throw new Error(
                "A payment is already being processed."
            );
        }
    }


    // -------------------------------------------------
    // Get amount
    // -------------------------------------------------
    //
    // IMPORTANT:
    // For now we use a fixed service charge.
    // Later you can add serviceCharge to Complaint.
    //

    const amount = "100.00";


    // -------------------------------------------------
    // Get bKash token
    // -------------------------------------------------

    const idToken =
        await getBkashIdToken();


    // -------------------------------------------------
    // Generate invoice number
    // -------------------------------------------------

    const invoiceNumber =
        `INV-${Date.now()}`;


    // -------------------------------------------------
    // Create payment record first
    // -------------------------------------------------

    const payment =
        await prisma.payment.upsert({

            where: {
                complaintId:
                    payload.complaintId,
            },

            update: {
                amount,
                method:
                    PaymentMethod.BKASH,
                status:
                    PaymentStatus.PENDING,
            },

            create: {
                userId,

                complaintId:
                    payload.complaintId,

                amount,

                currency: "BDT",

                method:
                    PaymentMethod.BKASH,

                status:
                    PaymentStatus.PENDING,
            },
        });


    // -------------------------------------------------
    // bKash Create Payment
    // -------------------------------------------------

    const response = await fetch(
        `${config.bkash_base_url}/tokenized/checkout/create`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",

                authorization: idToken ?? "",

                "x-app-key": config.bkash_app_key,
            },

            body: JSON.stringify({
                mode: "001",

                payerReference:
                    userId,

                callbackURL:
                    config.bkash_callback_url,

                amount,

                currency: "BDT",

                intent: "sale",

                merchantInvoiceNumber:
                    invoiceNumber,
            }),
        }
    );


    const result = await response.json();


    // -------------------------------------------------
    // bKash error
    // -------------------------------------------------

    if (
        !response.ok ||
        result.statusCode !== "0000"
    ) {

        await prisma.payment.update({
            where: {
                id: payment.id,
            },

            data: {
                status:
                    PaymentStatus.FAILED,

                gatewayResponse:
                    result,
            },
        });


        throw new Error(
            result.statusMessage ||
            "Failed to create bKash payment."
        );
    }


    // -------------------------------------------------
    // Save bKash payment ID
    // -------------------------------------------------

    const updatedPayment =
        await prisma.payment.update({

            where: {
                id: payment.id,
            },

            data: {
                paymentId:
                    result.paymentID,

                status:
                    PaymentStatus.PROCESSING,

                gatewayResponse:
                    result,
            },
        });


    return {
        payment: updatedPayment,

        bkash: {
            paymentID:
                result.paymentID,

            bkashURL:
                result.bkashURL,

            amount,

            currency: "BDT",

            transactionStatus:
                result.transactionStatus,
        },
    };
};


// =====================================================
// EXECUTE PAYMENT
// =====================================================

const executeBkashPayment = async (
    userId: string,
    paymentId: string
) => {

    // -------------------------------------------------
    // Find our payment
    // -------------------------------------------------

    const payment =
        await prisma.payment.findFirst({

            where: {
                paymentId,

                userId,
            },

            include: {
                complaint: true,
            },
        });


    if (!payment) {
        throw new Error(
            "Payment not found."
        );
    }


    if (
        payment.status ===
        PaymentStatus.PAID
    ) {
        throw new Error(
            "This payment has already been completed."
        );
    }


    // -------------------------------------------------
    // Get bKash token
    // -------------------------------------------------

    const idToken =
        await getBkashIdToken();


    // -------------------------------------------------
    // Execute
    // -------------------------------------------------

    const response = await fetch(
        `${config.bkash_base_url}/tokenized/checkout/execute`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",

                authorization: idToken ?? "",

                "x-app-key":
                    config.bkash_app_key,
            },

            body: JSON.stringify({
                paymentID: paymentId,
            }),
        }
    );


    const result = await response.json();


    // -------------------------------------------------
    // Failed
    // -------------------------------------------------

    if (
        !response.ok ||
        result.statusCode !== "0000"
    ) {

        await prisma.payment.update({
            where: {
                id: payment.id,
            },

            data: {
                status:
                    PaymentStatus.FAILED,

                gatewayResponse:
                    result,
            },
        });


        throw new Error(
            result.statusMessage ||
            "Failed to execute bKash payment."
        );
    }


    // -------------------------------------------------
    // Successful transaction
    // -------------------------------------------------

    const transactionId =
        result.trxID;


    // -------------------------------------------------
    // Transaction
    // -------------------------------------------------

    const updatedPayment =
        await prisma.$transaction(
            async (tx) => {

                const updated =
                    await tx.payment.update({

                        where: {
                            id: payment.id,
                        },

                        data: {

                            status:
                                PaymentStatus.PAID,

                            transactionId,

                            paidAt:
                                new Date(),

                            gatewayResponse:
                                result,
                        },
                    });


                return updated;
            }
        );


    return {
        payment: updatedPayment,

        bkashResponse:
            result,
    };
};


// =====================================================
// GET MY PAYMENTS
// =====================================================

const getMyPayments = async (
    userId: string
) => {

    return prisma.payment.findMany({

        where: {
            userId,
        },

        include: {
            complaint: {
                include: {
                    area: true,
                },
            },
        },

        orderBy: {
            createdAt: "desc",
        },
    });
};


// =====================================================
// GET PAYMENT BY ID
// =====================================================

const getPaymentById = async (
    paymentId: string,
    userId: string
) => {

    const payment =
        await prisma.payment.findUnique({

            where: {
                id: paymentId,
            },

            include: {
                complaint: {
                    include: {
                        area: true,
                    },
                },

                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
            },
        });


    if (!payment) {
        throw new Error(
            "Payment not found."
        );
    }


    if (payment.userId !== userId) {
        throw new Error(
            "Forbidden. You can only access your own payment."
        );
    }


    return payment;
};


// =====================================================
// ADMIN → GET ALL PAYMENTS
// =====================================================

const getAllPayments = async () => {

    return prisma.payment.findMany({

        include: {
            complaint: {
                include: {
                    area: true,
                },
            },

            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                },
            },
        },

        orderBy: {
            createdAt: "desc",
        },
    });
};


export const paymentService = {
    createBkashPayment,
    executeBkashPayment,
    getMyPayments,
    getPaymentById,
    getAllPayments,
};