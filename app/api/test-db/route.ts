import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Test koneksi dengan menjalankan query sederhana
    const result = await db.execute('SELECT NOW() as current_time');
    
    return NextResponse.json({
      success: true,
      message: 'Koneksi ke database Neon berhasil!',
      timestamp: result.rows[0]?.current_time,
      database: 'Neon'
    });
  } catch (error) {
    console.error('Database connection error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Koneksi ke database gagal',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}