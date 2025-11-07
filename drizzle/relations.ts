import { relations } from "drizzle-orm/relations";
import { user, session, bookmark, counselingSession, testResult, account, savedRecommendation, major, majorCareer, career } from "./schema";

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	sessions: many(session),
	bookmarks: many(bookmark),
	counselingSessions_teacherId: many(counselingSession, {
		relationName: "counselingSession_teacherId_user_id"
	}),
	counselingSessions_studentId: many(counselingSession, {
		relationName: "counselingSession_studentId_user_id"
	}),
	accounts: many(account),
	testResults: many(testResult),
	savedRecommendations: many(savedRecommendation),
}));

export const bookmarkRelations = relations(bookmark, ({one}) => ({
	user: one(user, {
		fields: [bookmark.userId],
		references: [user.id]
	}),
}));

export const counselingSessionRelations = relations(counselingSession, ({one}) => ({
	user_teacherId: one(user, {
		fields: [counselingSession.teacherId],
		references: [user.id],
		relationName: "counselingSession_teacherId_user_id"
	}),
	user_studentId: one(user, {
		fields: [counselingSession.studentId],
		references: [user.id],
		relationName: "counselingSession_studentId_user_id"
	}),
	testResult: one(testResult, {
		fields: [counselingSession.testResultId],
		references: [testResult.id]
	}),
}));

export const testResultRelations = relations(testResult, ({one, many}) => ({
	counselingSessions: many(counselingSession),
	user: one(user, {
		fields: [testResult.userId],
		references: [user.id]
	}),
	savedRecommendations: many(savedRecommendation),
}));

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const savedRecommendationRelations = relations(savedRecommendation, ({one}) => ({
	user: one(user, {
		fields: [savedRecommendation.userId],
		references: [user.id]
	}),
	testResult: one(testResult, {
		fields: [savedRecommendation.testResultId],
		references: [testResult.id]
	}),
}));

export const majorCareerRelations = relations(majorCareer, ({one}) => ({
	major: one(major, {
		fields: [majorCareer.majorId],
		references: [major.id]
	}),
	career: one(career, {
		fields: [majorCareer.careerId],
		references: [career.id]
	}),
}));

export const majorRelations = relations(major, ({many}) => ({
	majorCareers: many(majorCareer),
}));

export const careerRelations = relations(career, ({many}) => ({
	majorCareers: many(majorCareer),
}));