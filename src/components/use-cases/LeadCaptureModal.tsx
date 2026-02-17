"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, Lock } from "lucide-react";
import { toast } from "sonner";

interface LeadCaptureModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LeadCaptureModal({ isOpen, onClose }: LeadCaptureModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        email: '',
        company: '',
        role: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/leads/capture', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to submit');
            }

            setIsSuccess(true);
            toast.success("Verification email sent!");
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-800 text-slate-50 z-[200]">
                {!isSuccess ? (
                    <>
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-white">Unlock the 2026 Strategy</DialogTitle>
                            <DialogDescription className="text-slate-400">
                                Enter your details below to securely receive the Whitepaper and access the full playbook.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                            <div className="grid gap-2">
                                <Label htmlFor="firstName" className="text-slate-300">First Name</Label>
                                <Input
                                    id="firstName"
                                    placeholder="Jane"
                                    className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-600 focus-visible:ring-blue-500"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-slate-300">Work Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="jane@company.com"
                                    className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-600 focus-visible:ring-blue-500"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="company" className="text-slate-300">Company</Label>
                                    <Input
                                        id="company"
                                        placeholder="Acme Inc."
                                        className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-600 focus-visible:ring-blue-500"
                                        value={formData.company}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="role" className="text-slate-300">Role</Label>
                                    <Input
                                        id="role"
                                        placeholder="VP Sales"
                                        className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-600 focus-visible:ring-blue-500"
                                        value={formData.role}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    'Get Access'
                                )}
                            </Button>

                            <p className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-1">
                                <Lock className="h-3 w-3" />
                                Secure double opt-in verification. No spam.
                            </p>
                        </form>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                        <div className="h-16 w-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-2">
                            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-white">Check your email!</h3>
                        <p className="text-slate-400 max-w-xs mx-auto">
                            We've sent a verification link to <strong>{formData.email}</strong>.
                            Click it to instantly download the PDF.
                        </p>
                        <Button variant="outline" onClick={onClose} className="mt-4 border-slate-700 hover:bg-slate-800 text-slate-300">
                            Close
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
