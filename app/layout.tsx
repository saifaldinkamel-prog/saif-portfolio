import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import { TransitionProvider } from "@/components/transition/TransitionProvider";
import { CustomCursor } from "@/components/fx/CustomCursor";
import "./globals.css";

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["600"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

const DESCRIPTION =
  "Portfolio of Saifaldin Kamel, a software engineer in Giza, Egypt with a strength in frontend and mobile — currently building PocketBalance, a real Android finance app.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Saifaldin Kamel — Software Engineer",
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: "Saif.dev",
    title: "Saifaldin Kamel — Software Engineer",
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bricolageGrotesque.variable} ${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="antialiased">
        <TransitionProvider>{children}</TransitionProvider>
        <CustomCursor />
      </body>
    </html>
  );
}
