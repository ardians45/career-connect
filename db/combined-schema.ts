// File ini digunakan khusus untuk drizzle-kit
// Impor semua schema secara individual untuk menghindari konflik referensi silang
import { 
  user,
  session,
  account,
  verification,
  userRelations,
  sessionRelations,
  accountRelations
} from './schema/auth';

import {
  testResult,
  testQuestion,
  bookmark,
  major,
  career,
  majorCareer,
  savedRecommendation,
  counselingSession,
  testResultRelations,
  majorRelations,
  careerRelations,
  majorCareerRelations,
  savedRecommendationRelations,
  bookmarkRelations,
  counselingSessionRelations
} from './schema/schema';

// Gabungkan semua schema
export const schema = {
  // Auth tables
  user,
  session,
  account,
  verification,
  // Main tables
  testResult,
  testQuestion,
  bookmark,
  major,
  career,
  majorCareer,
  savedRecommendation,
  counselingSession,
  // Relations
  userRelations,
  sessionRelations,
  accountRelations,
  testResultRelations,
  majorRelations,
  careerRelations,
  majorCareerRelations,
  savedRecommendationRelations,
  bookmarkRelations,
  counselingSessionRelations,
};

// Ekspor juga secara individual untuk kompatibilitas
export * from './schema/auth';
export * from './schema/schema';