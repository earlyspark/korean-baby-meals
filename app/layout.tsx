import type { Metadata } from "next";
import { Inter, Nunito_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Korean Baby Meals - Toddler Recipes by Ingredient",
    template: "%s | Korean Baby Meals"
  },
  description: "Quick, nutritious meal ideas for babies and toddlers — search ingredients in your pantry, and find batch-friendly recipes and freezer-ready options for busy parents. Vibe-coded by a working mom.",
  keywords: [
    "korean baby food",
    "toddler recipes",
    "asian baby meals",
    "ingredient search",
    "batch cooking",
    "freezer friendly recipes",
    "food processor recipes",
    "korean toddler food"
  ],
  authors: [{ name: "Korean Baby Meals" }],
  creator: "Korean Baby Meals",
  publisher: "Korean Baby Meals",
  metadataBase: new URL("https://koreanbabymeals.com"),
  alternates: {
    canonical: "https://koreanbabymeals.com"
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://koreanbabymeals.com",
    siteName: "Korean Baby Meals",
    title: "Korean Baby Meals - Toddler Recipes by Ingredient",
    description: "Quick, nutritious meal ideas for babies and toddlers — search ingredients in your pantry, and find batch-friendly recipes and freezer-ready options for busy parents. Vibe-coded by a working mom.",
    images: [
      {
        url: "/og-logo.png",
        width: 1200,
        height: 630,
        alt: "Korean Baby Meals - Toddler Recipe Search"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Korean Baby Meals - Toddler Recipes by Ingredient",
    description: "Find Korean and Asian toddler recipes (12+ months) by searching ingredients in your pantry.",
    images: ["/og-logo.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${nunitoSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
