import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Joel Ebenka | DevOps and Cloud Engineer",
  description: "Portfolio of Joel Ebenka, DevOps and Cloud Engineer working across AWS, Azure and GCP.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;800&family=IBM+Plex+Mono&family=IBM+Plex+Sans:wght@400;600&display=swap" />
      </head>
      <body>{children}</body>
    </html>
  );
}
