import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { account, session, user, verification } from "@/db/schema/auth";

// Create a pool with the exact connection string to ensure correct database
const authPool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Create a separate drizzle instance specifically for auth
const authDb = drizzle(authPool, {
    schema: {
        user,
        account,
        session,
        verification
    }
});

export const auth = betterAuth({
    database: drizzleAdapter(authDb, {
        provider: "pg",
        schema: {
            user: user,
            account: account,
            session: session,
            verification: verification,
        }
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
    },
    user: {
        additionalFields: {
            schoolName: {
                type: "string",
                required: false,
                editable: true
            },
            grade: {
                type: "number",
                required: false,
                editable: true
            },
            phone: {
                type: "string",
                required: false,
                editable: true
            }
        }
    },
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
    session: {
        expiresIn: 7 * 24 * 60 * 60,
        updateAge: 24 * 60 * 60,
    },
});