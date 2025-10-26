'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bookmark, GraduationCap, Briefcase, X } from 'lucide-react';
import { useSession } from '@/lib/auth-client';
import { toast } from 'sonner';

interface Major {
  id: string;
  name: string;
  description: string;
  riasecTypes: string;
  degreeLevel: string;
}

interface Career {
  id: string;
  name: string;
  description: string;
  riasecTypes: string;
  industry: string;
}

const RecommendationsPage = () => {
  const [bookmarkedMajors, setBookmarkedMajors] = useState<any[]>([]); // We'll fetch real data
  const [bookmarkedCareers, setBookmarkedCareers] = useState<any[]>([]); // We'll fetch real data
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();

  // Load bookmarked items from localStorage
  useEffect(() => {
    const loadBookmarks = () => {
      setLoading(true);
      
      try {
        // Load bookmarked major objects from localStorage
        const storedMajorBookmarks = localStorage.getItem('bookmarkedMajors');
        const majorBookmarks = storedMajorBookmarks ? JSON.parse(storedMajorBookmarks) : [];
        
        // Load bookmarked career objects from localStorage
        const storedCareerBookmarks = localStorage.getItem('bookmarkedCareers');
        const careerBookmarks = storedCareerBookmarks ? JSON.parse(storedCareerBookmarks) : [];
        
        // Update state with stored details
        setBookmarkedMajors(majorBookmarks);
        setBookmarkedCareers(careerBookmarks);
      } catch (error) {
        console.error('Error loading bookmarks from localStorage:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBookmarks();
  }, []);

  // Function to remove a bookmarked major
  const removeBookmarkedMajor = (id: string) => {
    // Update the UI immediately
    setBookmarkedMajors(prev => prev.filter(major => major.id !== id));
    
    // Update localStorage
    try {
      const storedBookmarks = localStorage.getItem('bookmarkedMajors');
      const currentBookmarks = storedBookmarks ? JSON.parse(storedBookmarks) : [];
      const updatedBookmarks = currentBookmarks.filter((bookmark: any) => bookmark.id !== id);
      localStorage.setItem('bookmarkedMajors', JSON.stringify(updatedBookmarks));
      
      toast.success('Bookmark removed');
    } catch (error) {
      console.error('Error removing bookmarked major:', error);
      toast.error('Failed to remove bookmark');
    }
  };

  // Function to remove a bookmarked career
  const removeBookmarkedCareer = (id: string) => {
    // Update the UI immediately
    setBookmarkedCareers(prev => prev.filter(career => career.id !== id));
    
    // Update localStorage
    try {
      const storedBookmarks = localStorage.getItem('bookmarkedCareers');
      const currentBookmarks = storedBookmarks ? JSON.parse(storedBookmarks) : [];
      const updatedBookmarks = currentBookmarks.filter((bookmark: any) => bookmark.id !== id);
      localStorage.setItem('bookmarkedCareers', JSON.stringify(updatedBookmarks));
      
      toast.success('Bookmark removed');
    } catch (error) {
      console.error('Error removing bookmarked career:', error);
      toast.error('Failed to remove bookmark');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rencana Karir Saya</h1>
          <p className="text-muted-foreground mt-2">
            Daftar pendek jurusan dan profesi yang telah Anda bookmark untuk bahan diskusi lebih lanjut
          </p>
        </div>
      </div>

      {/* Bookmarked Majors Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Jurusan Pilihan</h2>
          <Badge variant="secondary" className="ml-2">
            {bookmarkedMajors.length}
          </Badge>
        </div>

        {bookmarkedMajors.length === 0 ? (
          <div className="text-center py-8 border border-dashed rounded-lg">
            <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Belum ada jurusan yang di-bookmark</p>
            <p className="text-sm text-muted-foreground mt-1">
              Jelajahi halaman Jurusan dan bookmark jurusan yang Anda minati
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarkedMajors.map((major) => (
              <Card key={major.id} className="hover:shadow-lg transition-shadow h-full flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="flex items-center justify-between flex-grow">
                      <span>{major.name}</span>
                      <Badge variant="secondary">{major.degreeLevel}</Badge>
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => removeBookmarkedMajor(major.id)}
                      aria-label="Hapus bookmark"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground mb-4">{major.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline">Tipe: {major.riasecTypes}</Badge>
                  </div>
                  <div className="mt-auto">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        console.log(`View details for ${major.name}`);
                      }}
                    >
                      Lihat Detail
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Bookmarked Careers Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Profesi Pilihan</h2>
          <Badge variant="secondary" className="ml-2">
            {bookmarkedCareers.length}
          </Badge>
        </div>

        {bookmarkedCareers.length === 0 ? (
          <div className="text-center py-8 border border-dashed rounded-lg">
            <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Belum ada profesi yang di-bookmark</p>
            <p className="text-sm text-muted-foreground mt-1">
              Jelajahi halaman Profesi dan bookmark profesi yang Anda minati
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarkedCareers.map((career) => (
              <Card key={career.id} className="hover:shadow-lg transition-shadow h-full flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="flex items-center justify-between flex-grow">
                      <span>{career.name}</span>
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => removeBookmarkedCareer(career.id)}
                      aria-label="Hapus bookmark"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground mb-4">{career.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline">Tipe: {career.riasecTypes}</Badge>
                    <Badge variant="outline">{career.industry}</Badge>
                  </div>
                  <div className="mt-auto">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        console.log(`View details for ${career.name}`);
                      }}
                    >
                      Lihat Detail
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationsPage;