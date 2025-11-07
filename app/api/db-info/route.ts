import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Query untuk mendapatkan nama-nama tabel di database
    const tablesResult = await db.execute(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    const tables = tablesResult.rows.map(row => row.table_name);
    
    // Ambil jumlah pengguna sebagai contoh data
    const userCountResult = await db.execute('SELECT COUNT(*) as count FROM "user"');
    const userCount = parseInt(userCountResult.rows[0]?.count) || 0;
    
    return NextResponse.json({
      success: true,
      message: 'Koneksi database Neon berhasil',
      tables,
      userCount,
      totalTables: tables.length
    });
  } catch (error) {
    console.error('Database query error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Gagal mengakses database',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}