"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";

export default function ProfilePage() {
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 1000);
    };

    return (
        <div className="min-h-screen bg-muted/20 p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Profile & Settings</h1>
                        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
                    </div>
                    <Link href="/dashboard">
                        <Button variant="outline">Back to Dashboard</Button>
                    </Link>
                </div>

                <div className="grid gap-8 md:grid-cols-[1fr_250px]">
                    <div className="space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Personal Information</CardTitle>
                                <CardDescription>Update your personal details here.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>First Name</Label>
                                        <Input defaultValue="Sarah" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Last Name</Label>
                                        <Input defaultValue="Connor" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input defaultValue="sarah@techflow.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Role</Label>
                                    <Input defaultValue="Sales Agent" disabled className="bg-muted" />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={handleSave} disabled={isLoading}>
                                    {isLoading ? "Saving..." : "Save Changes"}
                                </Button>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Notifications</CardTitle>
                                <CardDescription>Configure how you receive alerts.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between space-x-2">
                                    <Label htmlFor="email-notifs" className="flex flex-col space-y-1">
                                        <span>Email Notifications</span>
                                        <span className="font-normal leading-snug text-muted-foreground">
                                            Receive emails about new leads and campaign updates.
                                        </span>
                                    </Label>
                                    <Switch id="email-notifs" defaultChecked />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between space-x-2">
                                    <Label htmlFor="sms-notifs" className="flex flex-col space-y-1">
                                        <span>SMS Notifications</span>
                                        <span className="font-normal leading-snug text-muted-foreground">
                                            Receive text messages for urgent alerts.
                                        </span>
                                    </Label>
                                    <Switch id="sms-notifs" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Picture</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center gap-4">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage src="/avatars/01.png" alt="@shadcn" />
                                    <AvatarFallback className="text-2xl">SC</AvatarFallback>
                                </Avatar>
                                <Button variant="outline" size="sm" className="w-full">Change Avatar</Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
