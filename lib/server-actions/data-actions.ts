'use server';

import { db } from '@/lib/db';
import { major, career } from '@/db/schema/schema';
import { eq, inArray } from 'drizzle-orm';

export async function getMajorsByIds(ids: string[]) {
  if (ids.length === 0) return [];
  return await db.select().from(major).where(inArray(major.id, ids));
}

export async function getCareersByIds(ids: string[]) {
  if (ids.length === 0) return [];
  return await db.select().from(career).where(inArray(career.id, ids));
}