import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { bookmark } from '@/db/schema/schema';
import { eq, and } from 'drizzle-orm';
import { authClient } from '@/lib/auth-client';

export async function GET(request: NextRequest) {
  try {
    // Verify user session
    const session = await authClient.getSession();
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    
    // Fetch all bookmarks for the user
    const userBookmarks = await db
      .select()
      .from(bookmark)
      .where(eq(bookmark.userId, userId));

    return Response.json(userBookmarks);
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify user session
    const session = await authClient.getSession();
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { itemId, itemType } = await request.json();

    if (!itemId || !itemType) {
      return Response.json({ error: 'itemId and itemType are required' }, { status: 400 });
    }

    // Check if bookmark already exists to avoid duplicates
    const existingBookmark = await db.query.bookmark.findFirst({
      where: and(
        eq(bookmark.userId, userId),
        eq(bookmark.itemId, itemId),
        eq(bookmark.itemType, itemType)
      )
    });

    if (existingBookmark) {
      return Response.json({ message: 'Bookmark already exists' }, { status: 200 });
    }

    // Create the bookmark
    const newBookmark = await db
      .insert(bookmark)
      .values({
        id: `bookmark_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        itemId,
        itemType,
        createdAt: new Date(),
      })
      .returning();

    return Response.json({ success: true, bookmark: newBookmark[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating bookmark:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Verify user session
    const session = await authClient.getSession();
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');
    const itemType = searchParams.get('itemType');

    if (!itemId || !itemType) {
      return Response.json({ error: 'itemId and itemType are required' }, { status: 400 });
    }

    // Delete the specific bookmark
    await db
      .delete(bookmark)
      .where(
        and(
          eq(bookmark.userId, userId),
          eq(bookmark.itemId, itemId),
          eq(bookmark.itemType, itemType)
        )
      );

    return Response.json({ success: true, message: 'Bookmark deleted' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}