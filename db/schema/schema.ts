// Lokasi: /src/lib/db/schema.ts

import { pgTable, text, timestamp, integer, varchar, boolean, jsonb, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
// Impor tabel 'user' dari file auth.ts untuk referensi
import { user } from './auth';

// ============================================
// CAREER CONNECT CORE TABLES
// ============================================

export const testResult = pgTable('test_result', {
    id: text('id').primaryKey(),
    userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
    guestSessionId: text('guest_session_id'),
    realisticScore: integer('realistic_score').notNull().default(0),
    investigativeScore: integer('investigative_score').notNull().default(0),
    artisticScore: integer('artistic_score').notNull().default(0),
    socialScore: integer('social_score').notNull().default(0),
    enterprisingScore: integer('enterprising_score').notNull().default(0),
    conventionalScore: integer('conventional_score').notNull().default(0),
    dominantType: varchar('dominant_type', { length: 1 }).notNull(),
    secondaryType: varchar('secondary_type', { length: 1 }),
    tertiaryType: varchar('tertiary_type', { length: 1 }),
    completedAt: timestamp('completed_at').notNull().defaultNow(),
    testDuration: integer('test_duration'),
    totalQuestions: integer('total_questions').notNull(),
    rawAnswers: jsonb('raw_answers'),
});

export const testQuestion = pgTable('test_question', {
    id: text('id').primaryKey(),
    questionText: text('question_text').notNull(),
    category: varchar('category', { length: 1 }).notNull(),
    order: integer('order').notNull(),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const major = pgTable('major', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description').notNull(),
    riasecTypes: text('riasec_types').notNull(),
    degreeLevel: text('degree_level').notNull(),
    studyDuration: integer('study_duration'),
    averageTuition: integer('average_tuition'),
    jobOutlook: text('job_outlook'),
    averageSalary: integer('average_salary'),
    popularityScore: integer('popularity_score').default(0),
    imageUrl: text('image_url'),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const career = pgTable('career', {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    riasecTypes: text('riasec_types').notNull(),
    industry: text('industry'),
    experienceLevel: text('experience_level'),
    requiredSkills: jsonb('required_skills'),
    educationRequirement: text('education_requirement'),
    salaryRange: jsonb('salary_range'),
    jobGrowthRate: integer('job_growth_rate'),
    popularityScore: integer('popularity_score').default(0),
    imageUrl: text('image_url'),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const majorCareer = pgTable('major_career', {
    majorId: text('major_id').notNull().references(() => major.id, { onDelete: 'cascade' }),
    careerId: text('career_id').notNull().references(() => career.id, { onDelete: 'cascade' }),
    relevanceScore: integer('relevance_score').default(100),
}, (table) => ({
    pk: primaryKey({ columns: [table.majorId, table.careerId] }),
}));

export const savedRecommendation = pgTable('saved_recommendation', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    testResultId: text('test_result_id').references(() => testResult.id, { onDelete: 'set null' }),
    recommendationType: text('recommendation_type').notNull(),
    recommendationId: text('recommendation_id').notNull(),
    notes: text('notes'),
    savedAt: timestamp('saved_at').notNull().defaultNow(),
});

export const counselingSession = pgTable('counseling_session', {
    id: text('id').primaryKey(),
    teacherId: text('teacher_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    studentId: text('student_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    testResultId: text('test_result_id').references(() => testResult.id, { onDelete: 'set null' }),
    sessionDate: timestamp('session_date').notNull(),
    notes: text('notes'),
    recommendations: text('recommendations'),
    followUpDate: timestamp('follow_up_date'),
    status: text('status').notNull().default('scheduled'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ============================================
// CORE RELATIONS
// ============================================

export const testResultRelations = relations(testResult, ({ one, many }) => ({
    user: one(user, {
        fields: [testResult.userId],
        references: [user.id],
    }),
    savedRecommendations: many(savedRecommendation),
    counselingSessions: many(counselingSession),
}));

export const majorRelations = relations(major, ({ many }) => ({
    majorCareers: many(majorCareer),
}));

export const careerRelations = relations(career, ({ many }) => ({
    majorCareers: many(majorCareer),
}));

export const majorCareerRelations = relations(majorCareer, ({ one }) => ({
    major: one(major, {
        fields: [majorCareer.majorId],
        references: [major.id],
    }),
    career: one(career, {
        fields: [majorCareer.careerId],
        references: [career.id],
    }),
}));

export const savedRecommendationRelations = relations(savedRecommendation, ({ one }) => ({
    user: one(user, {
        fields: [savedRecommendation.userId],
        references: [user.id],
    }),
    testResult: one(testResult, {
        fields: [savedRecommendation.testResultId],
        references: [testResult.id],
    }),
}));

export const counselingSessionRelations = relations(counselingSession, ({ one }) => ({
    teacher: one(user, {
        relationName: 'teacher',
        fields: [counselingSession.teacherId],
        references: [user.id],
    }),
    student: one(user, {
        relationName: 'student',
        fields: [counselingSession.studentId],
        references: [user.id],
    }),
    testResult: one(testResult, {
        fields: [counselingSession.testResultId],
        references: [testResult.id],
    }),
}));