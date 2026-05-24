import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ASO Audit Chat",
  description: "Get actionable App Store Optimization insights for your iOS app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
