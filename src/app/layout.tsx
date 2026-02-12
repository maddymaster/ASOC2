import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { MissionControlProvider } from "@/context/MissionControlContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "DataFrontier Mission Control",
    description: "AI-Driven Sales Intelligence Platform",
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
