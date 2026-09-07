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
        description: "Production server",
      },
      {
        url: "http://localhost:5000",
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
    "./src/app/module/**/*.route.ts",
  ],
};

export const swaggerSpec = swaggerJsdoc(options);