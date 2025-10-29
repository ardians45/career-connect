'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useSession } from '@/lib/auth-client';
import { Camera, Save, User, Globe, Moon, Sun } from 'lucide-react';

export default function SettingsPage() {
  const { data: session } = useSession();
  const [name, setName] = useState(session?.user?.name || '');
  const [email, setEmail] = useState(session?.user?.email || '');
  const [avatar, setAvatar] = useState(session?.user?.image || '');
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('id');

  useEffect(() => {
    // Set initial values from session
    setName(session?.user?.name || '');
    setEmail(session?.user?.email || '');
    setAvatar(session?.user?.image || '');
    
    // Check for saved preferences in localStorage
    const savedDarkMode = localStorage.getItem('theme') === 'dark';
    const savedLanguage = localStorage.getItem('language') || 'id';
    
    setDarkMode(savedDarkMode);
    setLanguage(savedLanguage);
  }, [session]);

  const handleSaveSettings = () => {
    // Save preferences to localStorage
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('language', language);
    
    // In a real app, you would also save user profile changes to the backend
    console.log('Settings saved:', { name, email, avatar, darkMode, language });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatar(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pengaturan</h1>
        <p className="text-muted-foreground">Atur preferensi akun dan tampilan Anda</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profil
            </CardTitle>
            <CardDescription>Perbarui informasi profil Anda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={avatar} alt="Profile picture" />
                <AvatarFallback>
                  {name
                    .split(' ')
                    .map(n => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-2">
                <Label htmlFor="avatar-upload" className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    <span className="text-sm">Ganti Foto</span>
                  </div>
                  <Input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </Label>
                <p className="text-xs text-muted-foreground">JPG, PNG (Max 5MB)</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Anda"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={email}
                disabled
                placeholder="Email Anda"
              />
            </div>
            
            <Button className="w-full flex items-center gap-2" onClick={handleSaveSettings}>
              <Save className="h-4 w-4" />
              Simpan Perubahan
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Moon className="h-5 w-5" />
                Tema
              </CardTitle>
              <CardDescription>Pilih tema tampilan aplikasi</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mode Gelap</Label>
                  <p className="text-xs text-muted-foreground">Ganti antara mode terang dan gelap</p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
              </div>
              
              <div className="flex items-center gap-4 pt-2">
                <Button
                  variant={darkMode ? "default" : "outline"}
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => setDarkMode(false)}
                >
                  <Sun className="h-4 w-4" />
                  Mode Terang
                </Button>
                <Button
                  variant={darkMode ? "outline" : "default"}
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => setDarkMode(true)}
                >
                  <Moon className="h-4 w-4" />
                  Mode Gelap
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Bahasa
              </CardTitle>
              <CardDescription>Atur bahasa tampilan aplikasi</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">Pilih Bahasa</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Pilih bahasa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="id">Indonesia</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Bahasa yang dipilih akan berlaku untuk seluruh antarmuka aplikasi.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}