"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard, Download } from "lucide-react";
import Link from "next/link";

export default function BillingPage() {
    return (
        <div className="min-h-screen bg-muted/20 p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Billing & Subscription</h1>
                        <p className="text-muted-foreground">Manage your plan and payment details.</p>
                    </div>
                    <Link href="/dashboard">
                        <Button variant="outline">Back to Dashboard</Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Current Plan</CardTitle>
                        <CardDescription>You are currently on the <span className="font-bold text-black border-b border-purple-500">Growth Plan</span>.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-lg">Growth Tier</h3>
                                    <Badge className="bg-purple-600 hover:bg-purple-700">Active</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">$99.00 / month • Renews Oct 24, 2024</p>
                            </div>
                            <Button variant="outline">Manage Subscription</Button>
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center gap-2 text-sm">
                                <Check className="h-4 w-4 text-green-500" /> 1,000 Leads / month
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Check className="h-4 w-4 text-green-500" /> Voice AI Agents
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Check className="h-4 w-4 text-green-500" /> Priority Support
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="border-t bg-muted/10 px-6 py-4">
                        <p className="text-xs text-muted-foreground">
                            Usage this month: 452 / 1,000 leads used.
                        </p>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Payment Method</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-16 bg-gradient-to-br from-gray-800 to-black rounded-md flex items-center justify-center text-white font-bold text-xs">
                                VISA
                            </div>
                            <div>
                                <p className="font-medium">Visa ending in 4242</p>
                                <p className="text-sm text-muted-foreground">Expires 12/28</p>
                            </div>
                            <Button variant="ghost" className="ml-auto text-purple-600">Edit</Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Invoice History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { date: "Oct 24, 2024", amount: "$99.00", status: "Paid" },
                                { date: "Sep 24, 2024", amount: "$99.00", status: "Paid" },
                                { date: "Aug 24, 2024", amount: "$99.00", status: "Paid" },
                            ].map((invoice, i) => (
                                <div key={i} className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0">
                                    <div>
                                        <p className="font-medium">{invoice.date}</p>
                                        <p className="text-xs text-muted-foreground">Invoice #INV-{2024001 + i}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm">{invoice.amount}</span>
                                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">{invoice.status}</Badge>
                                        <Button size="icon" variant="ghost">
                                            <Download className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
