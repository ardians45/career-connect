// Lokasi: /src/lib/db/auth.ts

import { pgTable, text, timestamp, boolean, integer, varchar } from "drizzle-orm/pg-core";
import { relations } from 'drizzle-orm';
// Impor tabel dari schema.ts untuk mendefinisikan relasi
import { testResult, savedRecommendation, counselingSession } from './schema';

// ============================================
// AUTHENTICATION TABLES
// ============================================

export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").notNull().default(false),
    image: text("image"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),

    // Kolom kustom untuk CareerConnect
    schoolName: text('school_name'),
    grade: integer('grade'),
    phone: varchar('phone', { length: 20 }),
    role: text('role').notNull().default('student'), // 'student' atau 'teacher'
});

export const session = pgTable("session", {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});


// ============================================
// AUTH RELATIONS
// ============================================

export const userRelations = relations(user, ({ many }) => ({
    sessions: many(session),
    accounts: many(account),
    // Relasi ke tabel di schema.ts
    testResults: many(testResult),
    savedRecommendations: many(savedRecommendation),
    counselingSessionsAsTeacher: many(counselingSession, { relationName: 'teacher' }),
    counselingSessionsAsStudent: many(counselingSession, { relationName: 'student' }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
    user: one(user, {
        fields: [session.userId],
        references: [user.id],
    }),
}));

export const accountRelations = relations(account, ({ one }) => ({
    user: one(user, {
        fields: [account.userId],
        references: [user.id],
    }),
}));