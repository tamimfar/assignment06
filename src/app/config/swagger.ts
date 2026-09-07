import path from "path";
import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Load Shedding & Power Management API",
            version: "1.0.0",
            description: "REST API for Load Shedding & Power Management Platform.",
        },
        servers: [
            {
                url: "https://assignment6-wheat-seven.vercel.app",
                description: "Production Server",
            },
            {
                url: "http://localhost:5000",
                description: "Local development server",
            }
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
        path.join(process.cwd(), "src/app/module/**/*.route.ts"),
        path.join(process.cwd(), "dist/app/module/**/*.route.js") // Targets compiled JS on Vercel
    ],
};

export const swaggerSpec = swaggerJsdoc(options);