'use server';

import { db } from '@/lib/db';
import { bookmark, major, career } from '@/db/schema/schema';
import { eq, inArray, and } from 'drizzle-orm';

export async function getBookmarkedItemsWithDetails(userId: string) {
  try {
    console.log('Getting bookmarked items with details for user:', userId);
    
    // Fetch all bookmarks for the user
    const userBookmarks = await db
      .select()
      .from(bookmark)
      .where(eq(bookmark.userId, userId));
    
    console.log('Found user bookmarks:', userBookmarks);
    
    // Separate major and career bookmark IDs
    const majorBookmarks = userBookmarks.filter(b => b.itemType === 'major');
    const careerBookmarks = userBookmarks.filter(b => b.itemType === 'career');
    
    console.log('Major bookmarks:', majorBookmarks);
    console.log('Career bookmarks:', careerBookmarks);
    
    // Get the actual major and career data
    const majorIds = majorBookmarks.map(b => b.itemId);
    const careerIds = careerBookmarks.map(b => b.itemId);
    
    console.log('Major IDs to fetch:', majorIds);
    console.log('Career IDs to fetch:', careerIds);
    
    let fetchedMajors = [];
    let fetchedCareers = [];
    
    if (majorIds.length > 0) {
      fetchedMajors = await db
        .select()
        .from(major)
        .where(inArray(major.id, majorIds));
      console.log('Fetched majors:', fetchedMajors);
    }
    
    if (careerIds.length > 0) {
      fetchedCareers = await db
        .select()
        .from(career)
        .where(inArray(career.id, careerIds));
      console.log('Fetched careers:', fetchedCareers);
    }
    
    return {
      bookmarkedMajors: fetchedMajors.map(m => ({
        id: m.id,
        name: m.name,
        description: m.description,
        riasecTypes: m.riasecTypes,
        degreeLevel: m.degreeLevel
      })),
      bookmarkedCareers: fetchedCareers.map(c => ({
        id: c.id,
        name: c.title,
        description: c.description,
        riasecTypes: c.riasecTypes,
        industry: c.industry || 'General'
      }))
    };
  } catch (error) {
    console.error('Error getting bookmarked items with details:', error);
    return { bookmarkedMajors: [], bookmarkedCareers: [] };
  }
}