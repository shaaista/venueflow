import swaggerJsdoc from "swagger-jsdoc";
import { env } from "./env.js";

export const openapiSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "VenueFlow API",
      version: "1.0.0",
      description:
        "Multi-tenant Venue & Event Enquiry CRM API. All tenant-scoped routes require a Bearer access token and resolve the active organization from the token (or `X-Organization-Id` header).",
    },
    servers: [{ url: `${env.APP_URL}/api/v1` }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            error: {
              type: "object",
              properties: {
                code: { type: "string" },
                message: { type: "string" },
              },
            },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/modules/**/*.routes.ts"],
});
