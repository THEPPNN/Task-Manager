import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle2, Clock2, List, Plus } from 'lucide-react';
import { route } from 'ziggy-js';

interface DashboardProps {
    stats: {
        total_lists: number;
        total_tasks: number;
        completed_tasks: number;
        incomplete_tasks: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({
    stats = {
        total_lists: 0,
        total_tasks: 0,
        completed_tasks: 0,
        incomplete_tasks: 0,
    },
}: DashboardProps) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 400);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            {loading ? (
                <div className="loadingCard flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                        <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        </div>
                        <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        </div>
                        <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        </div>
                    </div>
                    <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
            ) : (
                <div className="dataCard flex h-full flex-1 flex-col gap-6 rounded-xl p-4 bg-gradient-to-br from-background to-muted/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                Dashboard
                            </h1>
                            <p className="text-sm text-muted-foreground">Welcome back! Here's a quick overview of your tasks and lists.</p>
                            {/* <Link href="/lists">
                                <Button className="bg-primary text-white shadow-lg hover:bg-primary/90">
                                    View all lists
                                </Button>
                            </Link>
                            <Link href="/tasks">
                                <Button className="bg-primary text-white shadow-lg hover:bg-primary/90">
                                    <Link className="mr-2 h-4 w-4">
                                        View all tasks
                                    </Link>
                                </Button>
                            </Link> */}
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/20 border-blue-500/20">
                            <CardHeader className="flex flex-row items-center justiry-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-blue-500">
                                    Total Lists
                                </CardTitle>
                                <List className="h-4 w-4 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-blue-500">
                                    {stats.total_lists}
                                </div>
                                <p className="text-sm text-blue-500/80">
                                    Total number of lists
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/20">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-purple-500">
                                    Total Tasks
                                </CardTitle>
                                <CheckCircle2 className="h-4 w-4 text-purple-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-purple-500">
                                    {stats.total_tasks}
                                </div>
                                <p className="text-sm text-purple-500/80">
                                    All your tasks
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 to-yellow-600/20">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-yellow-500">
                                    incomplete tasks
                                </CardTitle>
                                <Clock2 className="h-4 w-4 text-yellow-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-yellow-500">
                                    {stats.incomplete_tasks}
                                </div>
                                <p className="text-sm text-yellow-500/80">
                                    Total number of incomplete tasks
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-green-500/20 bg-gradient-to-br from-green-500/10 to-green-600/20">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-green-500">
                                    Completed tasks
                                </CardTitle>
                                <Clock2 className="h-4 w-4 text-green-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-500">
                                    {stats.completed_tasks}
                                </div>
                                <p className="text-sm text-green-500/80">
                                    Total number of completed tasks
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Card className="border-primary/20">
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Quick Stats
                                </CardTitle>
                            </CardHeader>
                            <div className="grid gap-4 p-2">
                                <Link href="/lists">
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start"
                                    >
                                        <List className="mr-2 h-4 w-4" /> View all
                                    </Button>
                                </Link>
                                <Link href="/tasks">
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start"
                                    >
                                        <CheckCircle2 className="mr-2 h-4 w-4" />{' '}
                                        View all
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                        <Card className="border-primary/20">
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Recent Activity
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="rounded-full bg-primary/10 p-2">
                                            <Plus className="h-4 w-4 text-primary" />
                                        </div>
                                        <p className="text-sm font-medium">Welcome to Task Manager</p>
                                        <p className='text-xs text-gray-500'>Get started by creating your first list or Task</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
