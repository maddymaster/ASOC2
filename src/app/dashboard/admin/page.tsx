"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Shield, UserPlus, Trash2, Key, Search } from "lucide-react";
import Link from "next/link";
import { useMissionControl } from "@/context/MissionControlContext";

// Mock Data for Admin Prototype
const MOCK_USERS = [
    { id: '1', name: 'Admin User', email: 'admin@missioncontrol.ai', role: 'SUPER_ADMIN', status: 'Active' },
    { id: '2', name: 'Sarah Connor', email: 'sarah@techflow.com', role: 'SALES_AGENT', status: 'Active' },
    { id: '3', name: 'John Doe', email: 'john@techflow.com', role: 'SALES_AGENT', status: 'Inactive' },
];

const MOCK_AUDIT_LOGS = [
    { id: '101', action: 'CAMPAIGN_START', user: 'Admin User', details: 'Started "Q1 FinTech" campaign', timestamp: '2 mins ago' },
    { id: '102', action: 'USER_ADD', user: 'Admin User', details: 'Added "Sarah Connor"', timestamp: '1 hour ago' },
    { id: '103', action: 'EXPORT_LEADS', user: 'Sarah Connor', details: 'Exported 50 leads to CSV', timestamp: '3 hours ago' },
];

export default function AdminPage() {
    const [users, setUsers] = useState(MOCK_USERS);
    const [searchTerm, setSearchTerm] = useState("");
    const { setActiveTab } = useMissionControl();

    const handleDelete = (id: string) => {
        if (confirm("Are you sure? This action cannot be undone.")) {
            setUsers(prev => prev.filter(u => u.id !== id));
        }
    };

    return (
        <div className="min-h-screen bg-muted/20 p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Admin Console</h1>
                        <p className="text-muted-foreground">Manage users, roles, and system audit logs.</p>
                    </div>
                    <Link href="/dashboard" onClick={() => setActiveTab('strategy')}>
                        <Button variant="outline">Back to Dashboard</Button>
                    </Link>
                </div>

                {/* User Management */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>User Management</CardTitle>
                            <CardDescription>Manage access and roles for your team.</CardDescription>
                        </div>
                        <Button className="bg-purple-600 hover:bg-purple-700">
                            <UserPlus className="h-4 w-4 mr-2" /> Add User
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-2 mb-4">
                            <Search className="h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="max-w-sm"
                            />
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase())).map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Badge variant={user.role === 'SUPER_ADMIN' ? "default" : "secondary"}>
                                                {user.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {user.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(user.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Audit Logs */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-purple-600" />
                            System Audit Logs
                        </CardTitle>
                        <CardDescription>Real-time log of all critical system actions.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Timestamp</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Action</TableHead>
                                    <TableHead>Details</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {MOCK_AUDIT_LOGS.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell className="text-muted-foreground text-xs">{log.timestamp}</TableCell>
                                        <TableCell className="font-medium">{log.user}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{log.action}</Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{log.details}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
