import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TaskMatrix — Enterprise Agile Task Management System",
  description: "Enterprise-grade Agile project management dashboard built with Next.js 14, Zustand state management, and protected route guards.",
  keywords: ["Agile", "Kanban", "Project Management", "Next.js 14", "TypeScript", "Zustand", "TaskMatrix"],
  authors: [{ name: "Shashank" }],
  creator: "Shashank",
  publisher: "TaskMatrix",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "TaskMatrix — Enterprise Agile Task Management System",
    description: "Enterprise-grade Agile project management dashboard built with Next.js 14.",
    url: "https://prodesk-capstone-taskmatrix-sprint-one.vercel.app",
    siteName: "TaskMatrix",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TaskMatrix — Enterprise Agile Task Management System",
    description: "Enterprise-grade Agile project management dashboard built with Next.js 14.",
  },
};

export const viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}