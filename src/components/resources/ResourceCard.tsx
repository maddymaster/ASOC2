"use client";

import Image from 'next/image';
import { Download, FileText, Lock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { DownloadModal } from './DownloadModal';

export interface ResourceProps {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    pdfUrl: string;
    isLocked?: boolean;
}

interface ResourceCardProps {
    resource: ResourceProps;
    isVerified: boolean;
}

export function ResourceCard({ resource, isVerified }: ResourceCardProps) {
    const handleDownload = () => {
        // Direct download logic
        const link = document.createElement('a');
        link.href = resource.pdfUrl;
        link.download = resource.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const DownloadButton = (
        <Button
            onClick={isVerified ? handleDownload : undefined}
            className={`w-full group ${isVerified
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
        >
            {isVerified ? (
                <>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                </>
            ) : (
                <>
                    <Lock className="mr-2 h-4 w-4 group-hover:hidden" />
                    <Download className="mr-2 h-4 w-4 hidden group-hover:block" />
                    Unlock Access
                </>
            )}
        </Button>
    );

    return (
        <div className="group relative overflow-hidden rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/10">
            {/* Thumbnail */}
            <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                <Image
                    src={resource.thumbnailUrl}
                    alt={resource.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-80" />
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col gap-3 relative">
                <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider">
                    <FileText className="h-3 w-3" />
                    Whitepaper
                </div>

                <h3 className="text-xl font-bold text-white leading-tight group-hover:text-blue-200 transition-colors">
                    {resource.title}
                </h3>

                <p className="text-slate-300 text-sm line-clamp-3 mb-2">
                    {resource.description}
                </p>

                <div className="mt-auto">
                    {isVerified ? (
                        DownloadButton
                    ) : (
                        <DownloadModal resourceTitle={resource.title} trigger={DownloadButton} />
                    )}
                </div>
            </div>
        </div>
    );
}
