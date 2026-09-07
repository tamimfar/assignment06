import path from "path";
import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "Load Shedding & Power Management API",
            version: "1.0.0",
            description:
                "REST API for Load Shedding & Power Management Platform.",
        },

        servers: [
            {
                url: "https://assignment6-wheat-seven.vercel.app",
                description: "Local development server",
            },
        ],

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
    },

    apis: [
    path.resolve(
        process.cwd(),
        "src/app/module/admin/admin.route.ts"
    ),
    path.resolve(
        process.cwd(),
        "src/app/module/auth/auth.route.ts"
    ),
     path.resolve(
        process.cwd(),
        "src/app/module/areas/area.route.ts"
    ),
    path.resolve(
        process.cwd(),
        "src/app/module/schedules/schedule.route.ts"
    ),
    path.resolve(
        process.cwd(),
        "src/app/module/complaints/complaint.route.ts"
    ),
    path.resolve(
        process.cwd(),
        "src/app/module/assignments/assignment.route.ts"
    ),
    path.resolve(
        process.cwd(),
        "src/app/module/payments/payment.route.ts"
    ),
    path.resolve(
        process.cwd(),
        "src/app/module/reviews/review.route.ts"
    ),
    path.resolve(
        process.cwd(),
        "src/app/module/uploadimg/img.route.ts"
    ),
],
};

const swaggerSpec = swaggerJsdoc(options);


    
    Object.keys(
        (swaggerSpec as { paths?: Record<string, unknown> }).paths || {}
    )


export { swaggerSpec };