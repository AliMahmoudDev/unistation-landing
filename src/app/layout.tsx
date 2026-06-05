import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "UniStation | الدراسة في جورجيا - بوابتك للتعليم العالي",
  description:
    "UniStation - وكالتك التعليمية المتخصصة في الدراسة في جورجيا. تقدم برامج الطب البشري، طب الأسنان، الصيدلة والهندسة في أفضل الجامعات الجورجية المعتمدة دولياً.",
  keywords: [
    "الدراسة في جورجيا",
    "طب في جورجيا",
    "جامعات جورجيا",
    "UniStation",
    "دراسة الطب بالإنجليزية",
  ],
  icons: {
    icon: "/logos/Logo 01.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${cairo.variable} antialiased bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}
