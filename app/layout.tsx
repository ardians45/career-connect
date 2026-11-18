import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "CareerConnect — Asesmen Minat Karir & Jurusan Kuliah Siswa SMK",
  description:
    "Platform asesmen psikometri berbasis RIASEC untuk membantu siswa SMK menentukan jurusan kuliah linier dan arah karir masa depan.",
  icons: {
    icon: "/logo-cc.png",
  },
  other: {
    "site-kind": "software",
    "page-type": "software",
  },
};
    
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" data-type="software" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Geist:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Parkinsans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body
        className="antialiased"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
