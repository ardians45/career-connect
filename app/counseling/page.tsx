'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Calendar,
  Clock,
  User,
  GraduationCap,
  BookOpen,
  MessageCircle,
  Plus,
  Search,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import { useSession } from '@/lib/auth-client';

// Mock data for counseling sessions
const mockSessions = [
  {
    id: '1',
    teacherName: 'Budi Santoso, M.Pd',
    teacherSubject: 'BK',
    studentName: 'John Doe',
    sessionDate: '2024-10-15T09:00:00Z',
    status: 'scheduled',
    notes: 'Siswa membutuhkan bimbingan tentang pemilihan jurusan STEM',
    recommendations: 'Minat yang kuat pada bidang teknologi dan sains',
    testResultId: 'result-123',
    followUpDate: '2024-11-15T09:00:00Z'
  },
  {
    id: '2',
    teacherName: 'Siti Rahayu, S.Psi',
    teacherSubject: 'BK',
    studentName: 'Jane Smith',
    sessionDate: '2024-10-10T14:00:00Z',
    status: 'completed',
    notes: 'Membahas hasil tes RIASEC dengan tipe dominan Social',
    recommendations: 'Rekomendasi jurusan Psikologi atau Pendidikan',
    testResultId: 'result-456',
    followUpDate: null
  },
  {
    id: '3',
    teacherName: 'Ahmad Kurniawan, M.Si',
    teacherSubject: 'BK',
    studentName: 'Michael Chen',
    sessionDate: '2024-10-20T10:30:00Z',
    status: 'in-progress',
    notes: 'Sesi konseling lanjutan untuk pemilihan karir',
    recommendations: 'Rekomendasi magang di perusahaan teknologi',
    testResultId: 'result-789',
    followUpDate: '2024-11-20T10:30:00Z'
  }
];

const CounselingPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [sessions, setSessions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newSession, setNewSession] = useState({
    teacherId: '',
    studentId: '',
    sessionDate: '',
    notes: ''
  });

  useEffect(() => {
    // In a real app, fetch data from backend
    setSessions(mockSessions);
  }, []);

  const handleScheduleSession = () => {
    // In a real app, send data to backend
    alert('Sesi berhasil dijadwalkan!');
    // Reset form
    setNewSession({
      teacherId: '',
      studentId: '',
      sessionDate: '',
      notes: ''
    });
  };

  const filteredSessions = sessions.filter(session => 
    session.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.notes.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const upcomingSessions = filteredSessions.filter(
    session => session.status === 'scheduled' || session.status === 'in-progress'
  );
  
  const completedSessions = filteredSessions.filter(
    session => session.status === 'completed'
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-6">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Sesi Konseling BK</h1>
          <p className="text-muted-foreground mt-2">
            Jadwalkan dan kelola sesi konseling karir Anda
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Cari nama siswa atau guru..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-6 text-lg"
          />
        </div>

        {/* Schedule New Session Card - Only visible for teachers */}
        {session?.user?.role === 'teacher' && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Jadwalkan Sesi Baru
              </CardTitle>
              <CardDescription>
                Atur pertemuan konseling karir dengan siswa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Siswa</label>
                  <Input 
                    placeholder="Pilih siswa..." 
                    value={newSession.studentId}
                    onChange={(e) => setNewSession({...newSession, studentId: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Tanggal & Waktu</label>
                  <Input 
                    type="datetime-local"
                    value={newSession.sessionDate}
                    onChange={(e) => setNewSession({...newSession, sessionDate: e.target.value})}
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="text-sm font-medium mb-2 block">Catatan Awal</label>
                <Textarea 
                  placeholder="Catatan tentang tujuan sesi konseling..."
                  value={newSession.notes}
                  onChange={(e) => setNewSession({...newSession, notes: e.target.value})}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleScheduleSession}>
                Jadwalkan Sesi
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">Akan Datang</TabsTrigger>
            <TabsTrigger value="completed">Selesai</TabsTrigger>
            <TabsTrigger value="all">Semua Sesi</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Sessions Content */}
        <TabsContent value="upcoming">
          <div className="space-y-6">
            {upcomingSessions.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Tidak ada sesi mendatang</h3>
                  <p className="text-muted-foreground mb-4">
                    Belum ada sesi konseling yang dijadwalkan
                  </p>
                  {session?.user?.role === 'teacher' && (
                    <Button onClick={() => setActiveTab('all')}>
                      Atur Sesi Baru
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              upcomingSessions.map((session) => (
                <Card key={session.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {session.studentName}
                        </CardTitle>
                        <CardDescription>
                          {session.teacherName} • {session.teacherSubject}
                        </CardDescription>
                      </div>
                      <Badge 
                        className="capitalize"
                        variant={
                          session.status === 'scheduled' ? 'default' : 
                          session.status === 'in-progress' ? 'secondary' : 'outline'
                        }
                      >
                        {session.status === 'scheduled' ? 'Dijadwalkan' : 
                         session.status === 'in-progress' ? 'Sedang Berlangsung' : 'Selesai'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(session.sessionDate)}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {session.notes}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <GraduationCap className="h-3 w-3" />
                        Test ID: {session.testResultId}
                      </Badge>
                      {session.followUpDate && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Tindak Lanjut: {new Date(session.followUpDate).toLocaleDateString('id-ID')}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline"
                      onClick={() => router.push(`/results/${session.testResultId}`)}
                    >
                      Lihat Hasil Tes
                    </Button>
                    <Button>
                      Bergabung ke Sesi
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="space-y-6">
            {completedSessions.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Belum ada sesi selesai</h3>
                  <p className="text-muted-foreground">
                    Sesi konseling yang telah selesai akan muncul di sini
                  </p>
                </CardContent>
              </Card>
            ) : (
              completedSessions.map((session) => (
                <Card key={session.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {session.studentName}
                        </CardTitle>
                        <CardDescription>
                          {session.teacherName} • {session.teacherSubject}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {session.status === 'scheduled' ? 'Dijadwalkan' : 
                         session.status === 'in-progress' ? 'Sedang Berlangsung' : 'Selesai'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(session.sessionDate)}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {session.notes}
                    </div>
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Rekomendasi:</h4>
                      <p className="text-sm">{session.recommendations}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline"
                      onClick={() => router.push(`/results/${session.testResultId}`)}
                    >
                      Lihat Hasil Tes
                    </Button>
                    <Button>
                      Lihat Laporan
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="all">
          <div className="space-y-6">
            {filteredSessions.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Tidak ada sesi ditemukan</h3>
                  <p className="text-muted-foreground">
                    Tidak ditemukan sesi konseling untuk pencarian Anda
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredSessions.map((session) => (
                <Card key={session.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {session.studentName}
                        </CardTitle>
                        <CardDescription>
                          {session.teacherName} • {session.teacherSubject}
                        </CardDescription>
                      </div>
                      <Badge 
                        className="capitalize"
                        variant={
                          session.status === 'scheduled' ? 'default' : 
                          session.status === 'in-progress' ? 'secondary' : 'outline'
                        }
                      >
                        {session.status === 'scheduled' ? 'Dijadwalkan' : 
                         session.status === 'in-progress' ? 'Sedang Berlangsung' : 'Selesai'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(session.sessionDate)}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {session.notes}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <GraduationCap className="h-3 w-3" />
                        Test ID: {session.testResultId}
                      </Badge>
                      {session.followUpDate && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Tindak Lanjut: {new Date(session.followUpDate).toLocaleDateString('id-ID')}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline"
                      onClick={() => router.push(`/results/${session.testResultId}`)}
                    >
                      Lihat Hasil Tes
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline">
                        Detail
                      </Button>
                      <Button>
                        {session.status === 'completed' ? 'Lihat Laporan' : 
                         session.status === 'in-progress' ? 'Gabung Sesi' : 'Atur Ulang'}
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </div>
    </div>
  );
};

export default CounselingPage;