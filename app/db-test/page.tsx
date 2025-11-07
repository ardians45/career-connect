'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function DatabaseTestPage() {
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [dbInfo, setDbInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loadingInfo, setLoadingInfo] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-db');
      const data = await response.json();
      setDbStatus(data);
    } catch (error) {
      setDbStatus({
        success: false,
        message: 'Gagal menghubungi endpoint',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  const testDbInfo = async () => {
    setLoadingInfo(true);
    try {
      const response = await fetch('/api/db-info');
      const data = await response.json();
      setDbInfo(data);
    } catch (error) {
      setDbInfo({
        success: false,
        message: 'Gagal menghubungi endpoint',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoadingInfo(false);
    }
  };

  useEffect(() => {
    // Test koneksi secara otomatis saat halaman dimuat
    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-background py-6">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Testing Koneksi Database Neon</h1>
          <p className="text-muted-foreground mt-2">
            Halaman ini untuk memastikan aplikasi terkoneksi dengan database Neon
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Status Koneksi Database
            </CardTitle>
            <CardDescription>
              Uji koneksi dasar ke database Neon
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <span>Test Koneksi:</span>
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Memeriksa...</span>
                </div>
              ) : (
                <Button onClick={testConnection} size="sm">
                  Uji Koneksi
                </Button>
              )}
            </div>

            {dbStatus && (
              <div className="space-y-2 p-4 rounded-lg bg-muted">
                <div className="flex items-center gap-2">
                  {dbStatus.success ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="font-medium text-green-600">Koneksi Berhasil</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-red-500" />
                      <span className="font-medium text-red-600">Koneksi Gagal</span>
                    </>
                  )}
                </div>
                <p>{dbStatus.message}</p>
                {dbStatus.timestamp && (
                  <p className="text-sm text-muted-foreground">
                    Timestamp: {new Date(dbStatus.timestamp).toLocaleString('id-ID')}
                  </p>
                )}
                {dbStatus.error && (
                  <p className="text-sm text-red-500">
                    Error: {dbStatus.error}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Informasi Database
            </CardTitle>
            <CardDescription>
              Detail tentang struktur dan isi database
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <span>Detail Database:</span>
              {loadingInfo ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Mengambil data...</span>
                </div>
              ) : (
                <Button onClick={testDbInfo} size="sm">
                  Ambil Informasi
                </Button>
              )}
            </div>

            {dbInfo && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted">
                  <div className="flex items-center gap-2 mb-2">
                    {dbInfo.success ? (
                      <>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="font-medium">Informasi Database Tersedia</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5 text-red-500" />
                        <span className="font-medium text-red-600">Gagal mengambil informasi</span>
                      </>
                    )}
                  </div>
                  
                  {dbInfo.success && (
                    <>
                      <p className="mb-2"><strong>Total Tabel:</strong> {dbInfo.totalTables}</p>
                      <p className="mb-2"><strong>Jumlah Pengguna:</strong> {dbInfo.userCount}</p>
                      
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Daftar Tabel:</h4>
                        <div className="flex flex-wrap gap-2">
                          {dbInfo.tables?.map((table: string, index: number) => (
                            <Badge key={index} variant="secondary" className="px-2 py-1">
                              {table}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  
                  {dbInfo.error && (
                    <p className="text-sm text-red-500">
                      Error: {dbInfo.error}
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Gunakan endpoint ini untuk memverifikasi koneksi database:</p>
          <div className="mt-2 space-y-1">
            <p className="font-mono bg-muted p-2 rounded">GET /api/test-db</p>
            <p className="font-mono bg-muted p-2 rounded">GET /api/db-info</p>
          </div>
        </div>
      </div>
    </div>
  );
}