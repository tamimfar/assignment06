import {
    PrismaClient,
    UserRole,
    UserStatus,
    ScheduleStatus,
    ComplaintPriority,
    ComplaintStatus,
    AssignmentStatus,
    PaymentMethod,
    PaymentStatus,
    ReviewStatus,
    AuthProvider,
} from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import config from "../src/app/config";

const prisma = new PrismaClient({
    adapter: new PrismaPg({
        connectionString: config.DATABASE_URL,
    })
});

async function main() {
    console.log("🌱 Seeding database...");

    // ============================================================
    // PASSWORD
    // ============================================================

    const adminPassword = await bcrypt.hash(
        "Admin@12345",
        12
    );

    const technicianPassword = await bcrypt.hash(
        "Technician@12345",
        12
    );

    const userPassword = await bcrypt.hash(
        "User@12345",
        12
    );

    // ============================================================
    // USERS
    // ============================================================

    const admin = await prisma.user.upsert({
        where: {
            email: "admin@powersafe.com",
        },
        update: {},
        create: {
            name: "System Admin",
            email: "admin@powersafe.com",
            password: adminPassword,
            authProvider: AuthProvider.CRENTIAL,
            phone: "01710000001",
            role: UserRole.ADMIN,
            status: UserStatus.ACTIVE,
            emailVerified: true,
        },
    });

    const technician1 = await prisma.user.upsert({
        where: {
            email: "technician1@powersafe.com",
        },
        update: {},
        create: {
            name: "Rahim Technician",
            email: "technician1@powersafe.com",
            password: technicianPassword,
            authProvider: AuthProvider.CRENTIAL,
            phone: "01710000002",
            role: UserRole.TECHNICIAN,
            status: UserStatus.ACTIVE,
            emailVerified: true,
        },
    });

    const technician2 = await prisma.user.upsert({
        where: {
            email: "technician2@powersafe.com",
        },
        update: {},
        create: {
            name: "Karim Technician",
            email: "technician2@powersafe.com",
            password: technicianPassword,
            authProvider: AuthProvider.CRENTIAL,
            phone: "01710000003",
            role: UserRole.TECHNICIAN,
            status: UserStatus.ACTIVE,
            emailVerified: true,
        },
    });

    const user1 = await prisma.user.upsert({
        where: {
            email: "user1@example.com",
        },
        update: {},
        create: {
            name: "John Doe",
            email: "user1@example.com",
            password: userPassword,
            authProvider: AuthProvider.CRENTIAL,
            phone: "01710000004",
            role: UserRole.USER,
            status: UserStatus.ACTIVE,
            emailVerified: true,
        },
    });

    const user2 = await prisma.user.upsert({
        where: {
            email: "user2@example.com",
        },
        update: {},
        create: {
            name: "Jane Doe",
            email: "user2@example.com",
            password: userPassword,
            authProvider: AuthProvider.CRENTIAL,
            phone: "01710000005",
            role: UserRole.USER,
            status: UserStatus.ACTIVE,
            emailVerified: true,
        },
    });

    console.log("✅ Users created");

    // ============================================================
    // AREAS
    // ============================================================

    const area1 = await prisma.area.create({
        data: {
            name: "Brahmanbaria Sadar",
            district: "Brahmanbaria",
            division: "Chattogram",
            description:
                "Main urban area of Brahmanbaria Sadar.",
            isActive: true,
        },
    });

    const area2 = await prisma.area.create({
        data: {
            name: "Kasba",
            district: "Brahmanbaria",
            division: "Chattogram",
            description:
                "Kasba residential and commercial area.",
            isActive: true,
        },
    });

    const area3 = await prisma.area.create({
        data: {
            name: "Akhaura",
            district: "Brahmanbaria",
            division: "Chattogram",
            description:
                "Akhaura town and surrounding areas.",
            isActive: true,
        },
    });

    console.log("✅ Areas created");

    // ============================================================
    // LOAD SHEDDING SCHEDULES
    // ============================================================

    const schedule1 =
        await prisma.loadSheddingSchedule.create({
            data: {
                areaId: area1.id,
                date: new Date("2026-09-07"),
                startTime: "10:00",
                endTime: "12:00",
                reason: "Scheduled maintenance",
                status: ScheduleStatus.SCHEDULED,
            },
        });

    const schedule2 =
        await prisma.loadSheddingSchedule.create({
            data: {
                areaId: area1.id,
                date: new Date("2026-09-08"),
                startTime: "14:00",
                endTime: "16:00",
                reason: "Grid maintenance",
                status: ScheduleStatus.SCHEDULED,
            },
        });

    const schedule3 =
        await prisma.loadSheddingSchedule.create({
            data: {
                areaId: area2.id,
                date: new Date("2026-09-07"),
                startTime: "09:00",
                endTime: "11:00",
                reason: "Transformer maintenance",
                status: ScheduleStatus.SCHEDULED,
            },
        });

    const schedule4 =
        await prisma.loadSheddingSchedule.create({
            data: {
                areaId: area3.id,
                date: new Date("2026-09-09"),
                startTime: "15:00",
                endTime: "17:00",
                reason: "Emergency power line maintenance",
                status: ScheduleStatus.SCHEDULED,
            },
        });

    console.log("✅ Schedules created");

    // ============================================================
    // COMPLAINTS
    // ============================================================

    const complaint1 = await prisma.complaint.create({
        data: {
            userId: user1.id,
            areaId: area1.id,
            title: "No electricity at home",
            description:
                "There has been no electricity connection at my home since morning.",
            priority: ComplaintPriority.HIGH,
            status: ComplaintStatus.PENDING,
            address:
                "College Road, Brahmanbaria Sadar",
        },
    });

    const complaint2 = await prisma.complaint.create({
        data: {
            userId: user2.id,
            areaId: area2.id,
            title: "Frequent power outage",
            description:
                "Electricity is going off frequently in our residential area.",
            priority: ComplaintPriority.MEDIUM,
            status: ComplaintStatus.PENDING,
            address: "Kasba Main Road, Brahmanbaria",
        },
    });

    const complaint3 = await prisma.complaint.create({
        data: {
            userId: user1.id,
            areaId: area3.id,
            title: "Damaged electrical connection",
            description:
                "The electrical connection near my house appears to be damaged.",
            priority: ComplaintPriority.URGENT,
            status: ComplaintStatus.PENDING,
            address: "Akhaura Station Road",
        },
    });

    console.log("✅ Complaints created");

    // ============================================================
    // ASSIGNMENTS
    // ============================================================

    const assignment1 =
        await prisma.assignment.create({
            data: {
                complaintId: complaint1.id,
                technicianId: technician1.id,
                assignedById: admin.id,
                status: AssignmentStatus.COMPLETED,
            },
        });

    const assignment2 =
        await prisma.assignment.create({
            data: {
                complaintId: complaint2.id,
                technicianId: technician2.id,
                assignedById: admin.id,
                status: AssignmentStatus.ACCEPTED,
            },
        });

    console.log("✅ Assignments created");

    // ============================================================
    // UPDATE COMPLAINT STATUS
    // ============================================================

    await prisma.complaint.update({
        where: {
            id: complaint1.id,
        },
        data: {
            status: ComplaintStatus.RESOLVED,
            resolvedAt: new Date(),
        },
    });

    await prisma.complaint.update({
        where: {
            id: complaint2.id,
        },
        data: {
            status: ComplaintStatus.ASSIGNED,
        },
    });

    // ============================================================
    // PAYMENT
    // ============================================================

    const payment1 = await prisma.payment.create({
        data: {
            userId: user1.id,
            complaintId: complaint1.id,
            amount: "100.00",
            currency: "BDT",
            method: PaymentMethod.BKASH,
            status: PaymentStatus.PAID,
            transactionId: "SEED-TRX-100001",
            paymentId: "SEED-PAY-100001",
            gatewayResponse: {
                source: "seed",
                transactionId: "SEED-TRX-100001",
            },
            paidAt: new Date(),
        },
    });

    console.log("✅ Payment created");

    // ============================================================
    // REVIEW
    // ============================================================

    const review1 = await prisma.review.create({
        data: {
            userId: user1.id,
            complaintId: complaint1.id,
            rating: 5,
            comment:
                "Excellent service. The technician solved the problem quickly.",
            status: ReviewStatus.PUBLISHED,
        },
    });

    console.log("✅ Review created");

    // ============================================================
    // SUMMARY
    // ============================================================

    console.log("");
    console.log("========================================");
    console.log("🎉 DATABASE SEEDED SUCCESSFULLY");
    console.log("========================================");
    console.log("");

    console.log("👑 ADMIN");
    console.log("Email: admin@powersafe.com");
    console.log("Password: Admin@12345");
    console.log("");

    console.log("👨‍🔧 TECHNICIAN 1");
    console.log("Email: technician1@powersafe.com");
    console.log("Password: Technician@12345");
    console.log("");

    console.log("👨‍🔧 TECHNICIAN 2");
    console.log("Email: technician2@powersafe.com");
    console.log("Password: Technician@12345");
    console.log("");

    console.log("👤 USER 1");
    console.log("Email: user1@example.com");
    console.log("Password: User@12345");
    console.log("");

    console.log("👤 USER 2");
    console.log("Email: user2@example.com");
    console.log("");

    console.log("========================================");
    console.log("📊 CREATED DATA");
    console.log("========================================");
    console.log(`Admin: ${admin.id}`);
    console.log(`Technician 1: ${technician1.id}`);
    console.log(`Technician 2: ${technician2.id}`);
    console.log(`User 1: ${user1.id}`);
    console.log(`User 2: ${user2.id}`);
    console.log(`Area 1: ${area1.id}`);
    console.log(`Area 2: ${area2.id}`);
    console.log(`Area 3: ${area3.id}`);
    console.log(`Complaint 1: ${complaint1.id}`);
    console.log(`Complaint 2: ${complaint2.id}`);
    console.log(`Complaint 3: ${complaint3.id}`);
    console.log(`Assignment 1: ${assignment1.id}`);
    console.log(`Assignment 2: ${assignment2.id}`);
    console.log(`Payment: ${payment1.id}`);
    console.log(`Review: ${review1.id}`);
    console.log("");
}

main()
    .catch((error) => {
        console.error("❌ Seed failed:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });