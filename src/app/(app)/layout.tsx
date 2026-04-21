import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "../globals.css";
import { PostHogProvider } from "@/components/PostHogProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KRAAK — Trouve les opportunités faites pour toi",
  description:
    "Réponds à 10 questions et découvre les bourses, formations et programmes qui correspondent vraiment à ton profil. Résultat en moins de 3 minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
