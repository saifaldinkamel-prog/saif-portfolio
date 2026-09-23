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

export const metadata: Metadata = {
  title: "Saifaldin Kamel — Frontend & Mobile Developer",
  description:
    "Portfolio of Saifaldin Kamel, a frontend and mobile developer in Giza, Egypt. Built in the dark.",
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
