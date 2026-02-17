import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { MissionControlProvider } from "@/context/MissionControlContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    metadataBase: new URL("https://mission-control.datafrontier.ai"),
    title: {
        default: "DataFrontier | Autonomous Revenue Infrastructure",
        template: "%s | DataFrontier"
    },
    description: "The operating system for autonomous revenue. Replace manual SDR work with AI agents that research, qualify, and engage leads at scale.",
    keywords: ["Autonomous Sales Agents", "AI SDR", "Enterprise Lead Generation", "B2B Sales Automation", "Revenue Operations AI", "Generative AI for Sales"],
    authors: [{ name: "DataFrontier Inc." }],
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://mission-control.datafrontier.ai",
        title: "DataFrontier | Autonomous Revenue Infrastructure",
        description: "Scale your sales team with autonomous agents. 10x pipeline, 0 manual work.",
        siteName: "DataFrontier Mission Control",
        images: [
            {
                url: "/assets/og-image.png", // We'll need to ensure this asset exists or is created
                width: 1200,
                height: 630,
                alt: "DataFrontier Mission Control Dashboard",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "DataFrontier | Autonomous Revenue Infrastructure",
        description: "Scale your sales team with autonomous agents. 10x pipeline, 0 manual work.",
        creator: "@DataFrontierAI",
        images: ["/assets/og-image.png"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <MissionControlProvider>
                    {children}
                    <Toaster />
                </MissionControlProvider>
            </body>
        </html>
    );
}
