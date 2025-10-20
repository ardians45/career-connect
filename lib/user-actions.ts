'use server';

import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { user } from '@/db/schema/auth';
import { auth } from './auth';

// Fungsi untuk memperbarui profil pengguna
export async function updateUserProfile(
  userId: string,
  profileData: {
    name?: string;
    schoolName?: string;
    grade?: number;
    phone?: string;
  }
) {
  try {
    const result = await db
      .update(user)
      .set({
        ...profileData,
        updatedAt: new Date(),
      })
      .where(eq(user.id, userId))
      .returning();

    return { success: true, user: result[0] };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error: 'Failed to update profile' };
  }
}

// Fungsi untuk mendapatkan profil pengguna
export async function getUserProfile(userId: string) {
  try {
    const userData = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        schoolName: user.schoolName,
        grade: user.grade,
        phone: user.phone,
        image: user.image,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (userData.length > 0) {
      return userData[0];
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}