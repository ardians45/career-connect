'use server';

import { db } from '@/lib/db';
import { bookmark } from '@/db/schema/schema';
import { eq, and } from 'drizzle-orm';
import { authClient } from '@/lib/auth-client';

export async function toggleBookmark(userId: string, itemId: string, itemType: string) {
  try {
    console.log('ToggleBookmark called with:', { userId, itemId, itemType });
    
    // Check if bookmark already exists
    const existingBookmark = await db.query.bookmark.findFirst({
      where: and(
        eq(bookmark.userId, userId),
        eq(bookmark.itemId, itemId),
        eq(bookmark.itemType, itemType)
      )
    });

    console.log('Existing bookmark:', existingBookmark);

    if (existingBookmark) {
      // If exists, remove it (unbookmark)
      console.log('Removing existing bookmark');
      await db.delete(bookmark)
        .where(
          and(
            eq(bookmark.userId, userId),
            eq(bookmark.itemId, itemId),
            eq(bookmark.itemType, itemType)
          )
        );
      
      return { success: true, isBookmarked: false };
    } else {
      // If doesn't exist, create it
      console.log('Creating new bookmark');
      await db.insert(bookmark).values({
        id: `bookmark_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        itemId,
        itemType,
        createdAt: new Date(),
      });
      
      return { success: true, isBookmarked: true };
    }
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to toggle bookmark' };
  }
}

export async function getBookmarksByUserId(userId: string) {
  try {
    console.log('Getting bookmarks for user:', userId);
    const bookmarks = await db
      .select()
      .from(bookmark)
      .where(eq(bookmark.userId, userId));
    
    console.log('Found bookmarks:', bookmarks);
    return bookmarks;
  } catch (error) {
    console.error('Error getting bookmarks:', error);
    return [];
  }
}

export async function isBookmarked(userId: string, itemId: string, itemType: string) {
  try {
    console.log('Checking bookmark status for:', { userId, itemId, itemType });
    
    const existingBookmark = await db.query.bookmark.findFirst({
      where: and(
        eq(bookmark.userId, userId),
        eq(bookmark.itemId, itemId),
        eq(bookmark.itemType, itemType)
      )
    });
    
    console.log('Bookmark exists:', !!existingBookmark);
    return !!existingBookmark;
  } catch (error) {
    console.error('Error checking bookmark status:', error);
    return false;
  }
}