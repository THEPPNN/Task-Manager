import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { CheckCircle2, Pencil, Plus, XCircle, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { route } from 'ziggy-js';

interface List {
    id: number;
    title: string;
    description: string | null;
    tasks_count: number;
}

interface Props {
    lists: List[];
    flash: {
        success: string | null;
        error: string | null;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Lists',
        href: '/lists',
    },
];

export default function ListsIndex({ lists, flash }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingList, setEditingList] = useState<List | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');

    const { data, setData, post, put, processing, errors, reset, delete: destroy } = useForm({
        title: '',
        description: '',
    });

    // handle success/error flash
    useEffect(() => {
        if (flash?.success) {
            setToastMessage(flash.success);
            setToastType('success');
            setShowToast(true);
        } else if (flash?.error) {
            setToastMessage(flash.error);
            setToastType('error');
            setShowToast(true);
        }
    }, [flash]);

    // auto-hide toast
    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    // ✅ handlers
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (editingList) {
            let updateRoute;
            try {
                updateRoute = route?.('lists.update', editingList.id);
            } catch (error) {
                updateRoute = undefined;
            }
            put(updateRoute || `/lists/${editingList.id}`, {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                    setEditingList(null);
                },
            });
        } else {
            let storeRoute;
            try {
                storeRoute = route?.('lists.store');
            } catch (error) {
                storeRoute = undefined;
            }
            post(storeRoute || '/lists', {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
                onError: () => {
                    setToastMessage('Failed to create list');
                    setToastType('error');
                    setShowToast(true);
                }
            });
        }
    };

    const handleEdit = (list: List) => {
        setEditingList(list);
        setData('title', list.title);
        setData('description', list.description || '');
        setIsOpen(true);
    };

    const handleDelete = (listId: number) => {
        let destroyRoute;
        try {
            destroyRoute = route?.('lists.destroy', listId);
        } catch (error) {
            destroyRoute = undefined;
        }
        destroy(destroyRoute || `/lists/${listId}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Lists" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* ✅ Toast */}
                {showToast && (
                    <div
                        className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg p-4 shadow-lg ${
                            toastType === 'success'
                                ? 'bg-green-500 text-white'
                                : 'bg-red-500 text-white'
                        } animate-in slide-in-from-top-5 fade-in`}
                    >
                        {toastType === 'success' ? (
                            <CheckCircle2 className="size-4" />
                        ) : (
                            <XCircle className="size-4" />
                        )}
                        <span>{toastMessage}</span>
                    </div>
                )}

                {/* ✅ Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Lists</h1>

                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="size-4" />
                                New List
                            </Button>
                        </DialogTrigger>

                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    {editingList ? 'Edit List' : 'New List'}
                                </DialogTitle>
                            </DialogHeader>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) =>
                                            setData('title', e.target.value)
                                        }
                                        required
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-red-500">
                                            {errors.title}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">
                                        Description
                                    </Label>
                                    <Input
                                        id="description"
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-red-500">
                                            {errors.description}
                                        </p>
                                    )}
                                </div>

                                <Button type="submit" disabled={processing}>
                                    {editingList ? 'Update' : 'Create'}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* ✅ Lists grid */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
                    {lists.map((list) => (
                        <Card
                            key={list.id}
                            className="transition-colors hover:bg-accent/50"
                        >
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="font-medium text-lg">
                                    {list.title}
                                </CardTitle>
                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleEdit(list)}
                                    >
                                        <Pencil className="size-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                            handleDelete(list.id)
                                        }
                                    >
                                        <Trash className="size-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-2">
                                    {list.description}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {list.tasks_count} tasks
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}