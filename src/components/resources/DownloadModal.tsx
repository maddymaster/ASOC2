"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface DownloadModalProps {
    resourceTitle: string;
    trigger: React.ReactNode;
}

export function DownloadModal({ resourceTitle, trigger }: DownloadModalProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const [formData, setFormData] = useState({
        firstName: "",
        email: "",
        company: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch("/api/leads/capture", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || "Failed to capture lead");

            setIsSuccess(true);
            toast.success("Verification email sent!");
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-[#0f172a] border-slate-800 text-slate-100">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-white">
                        {isSuccess ? "Check your email" : "Unlock this Resource"}
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                        {isSuccess
                            ? `We've sent a verification link to ${formData.email}. Click it to download "${resourceTitle}".`
                            : `Enter your details to get instant access to "${resourceTitle}".`}
                    </DialogDescription>
                </DialogHeader>

                {isSuccess ? (
                    <div className="flex flex-col items-center justify-center py-6 space-y-4">
                        <CheckCircle2 className="w-16 h-16 text-green-500" />
                        <p className="text-center text-sm text-slate-400">
                            (You can close this window now)
                        </p>
                        <Button
                            variant="outline"
                            onClick={() => setOpen(false)}
                            className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                        >
                            Close
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="firstName" className="text-slate-200">
                                Full Name
                            </Label>
                            <Input
                                id="firstName"
                                required
                                className="bg-slate-900 border-slate-700 text-white focus:border-blue-500"
                                placeholder="John Doe"
                                value={formData.firstName}
                                onChange={(e) =>
                                    setFormData({ ...formData, firstName: e.target.value })
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-slate-200">
                                Work Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                className="bg-slate-900 border-slate-700 text-white focus:border-blue-500"
                                placeholder="john@company.com"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="company" className="text-slate-200">
                                Company
                            </Label>
                            <Input
                                id="company"
                                required
                                className="bg-slate-900 border-slate-700 text-white focus:border-blue-500"
                                placeholder="Acme Inc."
                                value={formData.company}
                                onChange={(e) =>
                                    setFormData({ ...formData, company: e.target.value })
                                }
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white mt-2 w-full font-medium"
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isLoading ? "Verifying..." : "Verify & Download PDF"}
                        </Button>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
