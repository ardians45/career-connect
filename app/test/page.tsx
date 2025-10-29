'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { 
  RotateCcw, 
  ArrowRight, 
  Lightbulb, 
  CheckCircle2, 
  Clock,
  User,
  GraduationCap
} from 'lucide-react';

// Mock test questions data
const mockQuestions = [
  // Realistic (4 questions)
  {
    id: 1,
    text: "Saya menikmati bekerja dengan alat dan mesin",
    category: 'R' // Realistic
  },
  {
    id: 2,
    text: "Saya senang melakukan kegiatan yang membutuhkan keterampilan tangan",
    category: 'R'
  },
  {
    id: 3,
    text: "Saya tertarik pada pekerjaan teknis atau kerajinan tangan",
    category: 'R'
  },
  {
    id: 4,
    text: "Saya senang memperbaiki atau merakit barang-barang",
    category: 'R'
  },
  
  // Investigative (3 questions)
  {
    id: 5,
    text: "Saya menikmati menganalisis data dan informasi",
    category: 'I' // Investigative
  },
  {
    id: 6,
    text: "Saya tertarik pada riset ilmiah dan eksperimen",
    category: 'I'
  },
  {
    id: 7,
    text: "Saya suka memecahkan masalah dengan pendekatan logis",
    category: 'I'
  },
  
  // Artistic (3 questions)
  {
    id: 8,
    text: "Saya tertarik pada seni dan desain kreatif",
    category: 'A' // Artistic
  },
  {
    id: 9,
    text: "Saya senang mengekspresikan ide melalui seni atau tulisan",
    category: 'A'
  },
  {
    id: 10,
    text: "Saya merasa bebas dan kreatif dalam mengekspresikan diri",
    category: 'A'
  },
  
  // Social (3 questions)
  {
    id: 11,
    text: "Saya suka membantu orang dalam menyelesaikan masalah",
    category: 'S' // Social
  },
  {
    id: 12,
    text: "Saya merasa puas ketika berhasil membimbing orang lain",
    category: 'S'
  },
  {
    id: 13,
    text: "Saya senang mengajar atau melatih orang lain",
    category: 'S'
  },
  
  // Enterprising (4 questions)
  {
    id: 14,
    text: "Saya percaya diri dalam memimpin proyek atau tim",
    category: 'E' // Enterprising
  },
  {
    id: 15,
    text: "Saya suka bernegosiasi untuk mencapai kesepakatan",
    category: 'E'
  },
  {
    id: 16,
    text: "Saya merasa nyaman berbicara di depan umum",
    category: 'E'
  },
  {
    id: 17,
    text: "Saya tertarik pada pekerjaan yang melibatkan persuasi",
    category: 'E'
  },
  
  // Conventional (3 questions)
  {
    id: 18,
    text: "Saya menyukai pekerjaan yang terstruktur dan terorganisir",
    category: 'C' // Conventional
  },
  {
    id: 19,
    text: "Saya merasa nyaman dengan tugas administrasi dan data",
    category: 'C'
  },
  {
    id: 20,
    text: "Saya suka bekerja dengan angka dan informasi terperinci",
    category: 'C'
  }
];

// RIASEC category descriptions
const riasecDescriptions: Record<string, string> = {
  'R': 'Realistic (Practical)',
  'I': 'Investigative (Analytical)',
  'A': 'Artistic (Creative)',
  'S': 'Social (Helping)',
  'E': 'Enterprising (Leading)',
  'C': 'Conventional (Organized)'
};

const TestPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes in seconds
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState(false);

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTestStarted && timeRemaining > 0) {
      timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      // Time's up - automatically submit
      handleSubmitTest();
    }
    return () => clearTimeout(timer);
  }, [isTestStarted, timeRemaining]);

  // Check if we're in guest mode (no session)
  useEffect(() => {
    if (!session) {
      setIsGuestMode(true);
    }
  }, [session]);

  const handleAnswerSelect = (questionId: number, value: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      handleSubmitTest();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmitTest = async () => {
    // Calculate scores for each RIASEC category
    const scores: Record<string, number> = {
      'R': 0, 'I': 0, 'A': 0, 'S': 0, 'E': 0, 'C': 0
    };

    mockQuestions.forEach(question => {
      const answer = answers[question.id];
      if (answer !== undefined) {
        scores[question.category] += answer;
      }
    });

    // Sort categories by score to find dominant types
    const sortedCategories = Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .map(([category]) => category);

    const dominantType = sortedCategories[0];
    const secondaryType = sortedCategories[1];
    const tertiaryType = sortedCategories[2];

    // In a real app, we would save the results to the backend
    // For now, we'll just navigate to the results page with the data
    const resultData = {
      id: 'test-' + Date.now(),
      scores,
      dominantType,
      secondaryType,
      tertiaryType,
      completedAt: new Date().toISOString(),
      testDuration: 300 - timeRemaining,
      totalQuestions: mockQuestions.length,
      rawAnswers: answers
    };

    // For logged-in users, save the result immediately to the database
    if (session) {
      try {
        console.log('Sending test result data:', {
          userId: session.user.id,
          realisticScore: resultData.scores.R,
          investigativeScore: resultData.scores.I,
          artisticScore: resultData.scores.A,
          socialScore: resultData.scores.S,
          enterprisingScore: resultData.scores.E,
          conventionalScore: resultData.scores.C,
          dominantType: resultData.dominantType,
          secondaryType: resultData.secondaryType,
          tertiaryType: resultData.tertiaryType,
          testDuration: resultData.testDuration,
          totalQuestions: resultData.totalQuestions,
          rawAnswers: resultData.rawAnswers,
        });

        // Prepare data with proper null/undefined handling for optional fields
        const testDataToSend = {
          userId: session.user.id,
          realisticScore: resultData.scores.R,
          investigativeScore: resultData.scores.I,
          artisticScore: resultData.scores.A,
          socialScore: resultData.scores.S,
          enterprisingScore: resultData.scores.E,
          conventionalScore: resultData.scores.C,
          dominantType: resultData.dominantType || 'X', // Provide default value
          secondaryType: resultData.secondaryType || undefined,
          tertiaryType: resultData.tertiaryType || undefined,
          testDuration: resultData.testDuration,
          totalQuestions: resultData.totalQuestions,
          rawAnswers: resultData.rawAnswers,
        };

        const response = await fetch('/api/test-results', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(testDataToSend),
        });

        console.log('Response status:', response.status);
        if (!response.ok) {
          console.error('Response error:', await response.text());
        }

        if (response.ok) {
          const savedResult = await response.json();
          console.log('Saved result:', savedResult);
          router.push(`/results/${savedResult.id}`);
          return; // Exit early after redirecting
        } else {
          console.error('Failed to save result, falling back to temporary storage');
        }
      } catch (error) {
        console.error('Error saving result:', error);
        // If saving fails, fall back to temporary storage
      }
    }
    
    // For guest users or if saving fails, use sessionStorage for temporary results
    sessionStorage.setItem('tempResult', JSON.stringify(resultData));
    router.push('/results');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQ = mockQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / mockQuestions.length) * 100;

  if (!isTestStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Lightbulb className="h-10 w-10 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">RIASEC Career Assessment</CardTitle>
            <CardDescription className="mt-2">
              Selamat datang di tes minat bakat CareerConnect berbasis RIASEC
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Tentang Tes Ini:</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li>Tes ini terdiri dari {mockQuestions.length} pertanyaan</li>
                <li>Anda akan diberi waktu 5 menit untuk menyelesaikan tes</li>
                <li>Jawab sesuai dengan minat dan preferensi Anda</li>
                <li>Hasil akan menunjukkan tipe kepribadian RIASEC Anda</li>
              </ul>
            </div>
            
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Kategori RIASEC:</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {Object.entries(riasecDescriptions).map(([code, description]) => (
                  <Badge key={code} variant="secondary" className="flex items-center gap-1">
                    <span className="font-mono">{code}</span>
                    <span>{description}</span>
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            {isGuestMode && (
              <p className="text-sm text-muted-foreground mb-4 flex items-center gap-1">
                <User className="h-4 w-4" />
                Mode tamu: Hasil tidak akan disimpan
              </p>
            )}
            <Button 
              className="w-full" 
              onClick={() => setIsTestStarted(true)}
            >
              Mulai Tes
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">RIASEC Assessment</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span>{formatTime(timeRemaining)}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setIsTestStarted(false);
                  setAnswers({});
                  setCurrentQuestion(0);
                  setTimeRemaining(300);
                }}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Ulangi
              </Button>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>
                    Pertanyaan {currentQuestion + 1} dari {mockQuestions.length}
                  </CardTitle>
                  <CardDescription>
                    Pilih seberapa sesuai dengan Anda
                  </CardDescription>
                </div>
                <Badge variant="outline">
                  {riasecDescriptions[currentQ.category]}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <p className="text-lg">{currentQ.text}</p>
              </div>
              
              <Progress value={progress} className="w-full mb-6" />
              
              <RadioGroup 
                value={answers[currentQ.id]?.toString() || ""} 
                onValueChange={(value) => handleAnswerSelect(currentQ.id, parseInt(value))}
                className="space-y-4"
              >
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                  <RadioGroupItem value="1" id={`option-1-${currentQ.id}`} />
                  <Label htmlFor={`option-1-${currentQ.id}`} className="flex-1">
                    Sangat Tidak Cocok
                  </Label>
                </div>
                
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                  <RadioGroupItem value="2" id={`option-2-${currentQ.id}`} />
                  <Label htmlFor={`option-2-${currentQ.id}`} className="flex-1">
                    Tidak Cocok
                  </Label>
                </div>
                
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                  <RadioGroupItem value="3" id={`option-3-${currentQ.id}`} />
                  <Label htmlFor={`option-3-${currentQ.id}`} className="flex-1">
                    Netral
                  </Label>
                </div>
                
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                  <RadioGroupItem value="4" id={`option-4-${currentQ.id}`} />
                  <Label htmlFor={`option-4-${currentQ.id}`} className="flex-1">
                    Cocok
                  </Label>
                </div>
                
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                  <RadioGroupItem value="5" id={`option-5-${currentQ.id}`} />
                  <Label htmlFor={`option-5-${currentQ.id}`} className="flex-1">
                    Sangat Cocok
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handlePreviousQuestion}
                disabled={currentQuestion === 0}
              >
                Sebelumnya
              </Button>
              <Button 
                onClick={handleNextQuestion}
                disabled={answers[currentQ.id] === undefined}
              >
                {currentQuestion === mockQuestions.length - 1 ? 'Selesai' : 'Selanjutnya'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
          
          {/* Question navigation */}
          <div className="mt-6">
            <h3 className="font-medium mb-2">Navigasi Soal:</h3>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              {mockQuestions.map((_, index) => (
                <Button
                  key={index}
                  variant={index === currentQuestion ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentQuestion(index)}
                  className="h-8"
                >
                  {index + 1}
                  {answers[mockQuestions[index].id] !== undefined && (
                    <CheckCircle2 className="h-3 w-3 ml-1" />
                  )}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;