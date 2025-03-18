import type { Metadata } from "next";

import { Poppins } from "next/font/google"; // Correct import for Poppins
import "./globals.css";
import { ThemeProvider } from "next-themes";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster";

const poppins = Poppins({
  // Correct Poppins import
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "500", "600", "700", "800", "900"], // Add weights as needed
});

export const metadata: Metadata = {
  title: "Expenzaar",
  description: "Generated by create next app",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/favicon/faviconlight.png",
        href: "/favicon/faviconlight.png",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/favicon/favicondark.png",
        href: "/favicon/favicondark.png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
