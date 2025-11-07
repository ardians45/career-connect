import { pgTable, foreignKey, unique, text, timestamp, integer, boolean, jsonb, varchar, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const session = pgTable("session", {
	id: text().primaryKey().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	token: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "session_user_id_user_id_fk"
		}).onDelete("cascade"),
	unique("session_token_unique").on(table.token),
]);

export const bookmark = pgTable("bookmark", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	itemId: text("item_id").notNull(),
	itemType: text("item_type").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "bookmark_user_id_user_id_fk"
		}).onDelete("cascade"),
	unique("bookmark_user_id_item_id_item_type_unique").on(table.userId, table.itemId, table.itemType),
]);

export const counselingSession = pgTable("counseling_session", {
	id: text().primaryKey().notNull(),
	teacherId: text("teacher_id").notNull(),
	studentId: text("student_id").notNull(),
	testResultId: text("test_result_id"),
	sessionDate: timestamp("session_date", { mode: 'string' }).notNull(),
	notes: text(),
	recommendations: text(),
	followUpDate: timestamp("follow_up_date", { mode: 'string' }),
	status: text().default('scheduled').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.teacherId],
			foreignColumns: [user.id],
			name: "counseling_session_teacher_id_user_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.studentId],
			foreignColumns: [user.id],
			name: "counseling_session_student_id_user_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.testResultId],
			foreignColumns: [testResult.id],
			name: "counseling_session_test_result_id_test_result_id_fk"
		}).onDelete("set null"),
]);

export const verification = pgTable("verification", {
	id: text().primaryKey().notNull(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const major = pgTable("major", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	description: text().notNull(),
	riasecTypes: text("riasec_types").notNull(),
	degreeLevel: text("degree_level").notNull(),
	studyDuration: integer("study_duration"),
	averageTuition: integer("average_tuition"),
	jobOutlook: text("job_outlook"),
	averageSalary: integer("average_salary"),
	popularityScore: integer("popularity_score").default(0),
	imageUrl: text("image_url"),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const career = pgTable("career", {
	id: text().primaryKey().notNull(),
	title: text().notNull(),
	description: text().notNull(),
	riasecTypes: text("riasec_types").notNull(),
	industry: text(),
	experienceLevel: text("experience_level"),
	requiredSkills: jsonb("required_skills"),
	educationRequirement: text("education_requirement"),
	salaryRange: jsonb("salary_range"),
	jobGrowthRate: integer("job_growth_rate"),
	popularityScore: integer("popularity_score").default(0),
	imageUrl: text("image_url"),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const user = pgTable("user", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	image: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	schoolName: text("school_name"),
	grade: integer(),
	phone: varchar({ length: 20 }),
	role: text().default('student').notNull(),
}, (table) => [
	unique("user_email_unique").on(table.email),
]);

export const testQuestion = pgTable("test_question", {
	id: text().primaryKey().notNull(),
	questionText: text("question_text").notNull(),
	category: varchar({ length: 1 }).notNull(),
	order: integer().notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const account = pgTable("account", {
	id: text().primaryKey().notNull(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id").notNull(),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at", { mode: 'string' }),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { mode: 'string' }),
	scope: text(),
	password: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "account_user_id_user_id_fk"
		}).onDelete("cascade"),
]);

export const testResult = pgTable("test_result", {
	id: text().primaryKey().notNull(),
	userId: text("user_id"),
	guestSessionId: text("guest_session_id"),
	realisticScore: integer("realistic_score").default(0).notNull(),
	investigativeScore: integer("investigative_score").default(0).notNull(),
	artisticScore: integer("artistic_score").default(0).notNull(),
	socialScore: integer("social_score").default(0).notNull(),
	enterprisingScore: integer("enterprising_score").default(0).notNull(),
	conventionalScore: integer("conventional_score").default(0).notNull(),
	dominantType: varchar("dominant_type", { length: 1 }).notNull(),
	secondaryType: varchar("secondary_type", { length: 1 }),
	tertiaryType: varchar("tertiary_type", { length: 1 }),
	completedAt: timestamp("completed_at", { mode: 'string' }).defaultNow().notNull(),
	testDuration: integer("test_duration"),
	totalQuestions: integer("total_questions").notNull(),
	rawAnswers: jsonb("raw_answers"),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "test_result_user_id_user_id_fk"
		}).onDelete("cascade"),
]);

export const savedRecommendation = pgTable("saved_recommendation", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	testResultId: text("test_result_id"),
	recommendationType: text("recommendation_type").notNull(),
	recommendationId: text("recommendation_id").notNull(),
	notes: text(),
	savedAt: timestamp("saved_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "saved_recommendation_user_id_user_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.testResultId],
			foreignColumns: [testResult.id],
			name: "saved_recommendation_test_result_id_test_result_id_fk"
		}).onDelete("set null"),
]);

export const majorCareer = pgTable("major_career", {
	majorId: text("major_id").notNull(),
	careerId: text("career_id").notNull(),
	relevanceScore: integer("relevance_score").default(100),
}, (table) => [
	foreignKey({
			columns: [table.majorId],
			foreignColumns: [major.id],
			name: "major_career_major_id_major_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.careerId],
			foreignColumns: [career.id],
			name: "major_career_career_id_career_id_fk"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.majorId, table.careerId], name: "major_career_major_id_career_id_pk"}),
]);
