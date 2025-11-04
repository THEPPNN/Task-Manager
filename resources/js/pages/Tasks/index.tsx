import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import {
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    List,
    Pencil,
    Plus,
    Search,
    Trash,
    XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { route } from 'ziggy-js';

interface Task {
    id: number;
    title: string;
    description: string | null;
    is_completed: boolean;
    due_date: string | null;
    list_id: number;
    list: {
        id: number;
        title: string;
    };
}

interface List {
    id: number;
    title: string;
}

interface Props {
    tasks: {
        data: Task[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    lists: List[];
    filters: {
        search: string | null;
        filter: string | null;
    };
    flash: {
        success: string | null;
        error: string | null;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: '/tasks',
    },
];

export default function TasksIndex({ tasks, lists, filters, flash }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [completedFilter, setCompletedFilter] = useState<
        'all' | 'completed' | 'incomplete'
    >(filters.filter as 'all');

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

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    const {
        data,
        setData,
        post,
        put,
        processing,
        reset,
        get,
        delete: destroy,
    } = useForm({
        title: '',
        description: '',
        due_date: '',
        list_id: '',
        is_completed: false as boolean,
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (editingTask) {
            let updateRoute;
            try {
                updateRoute = route?.('tasks.update', editingTask.id);
            } catch (error) {
                updateRoute = undefined;
            }
            put(updateRoute || `/tasks/${editingTask.id}`, {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                    setEditingTask(null);
                },
            });
        } else {
            let storeRoute;
            try {
                storeRoute = route?.('tasks.store');
            } catch (error) {
                storeRoute = undefined;
            }
            post(storeRoute || '/tasks', {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
                onError: () => {
                    setToastMessage('Failed to create task');
                    setToastType('error');
                    setShowToast(true);
                },
            });
        }
    };
    const handleEdit = (task: Task) => {
        setEditingTask(task);
        setData({
            title: task.title,
            description: task.description || '',
            due_date: task.due_date || '',
            list_id: task.list_id.toString(),
            is_completed: task.is_completed,
        });
        setIsOpen(true);
    };
    const handleDelete = (taskId: number) => {
        let destroyRoute;
        try {
            destroyRoute = route?.('tasks.destroy', taskId);
        } catch (error) {
            destroyRoute = undefined;
        }
        destroy(destroyRoute || `/tasks/${taskId}`, {
            onSuccess: () => {
                setToastMessage('Task deleted successfully');
                setToastType('success');
                setShowToast(true);
            },
        });
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const url =
            typeof route === 'function' ? route('tasks.index') : '/tasks';

        router.get(
            url,
            {
                search: searchTerm,
                filter: completedFilter,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };
 
    const handlePageChange = (page: number) => {
        router.get(
            route('tasks.index'),
            { page, search: searchTerm, filter: completedFilter },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tasks" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl bg-gradient-to-br from-background to-muted/20 p-6">
                {showToast && (
                    <div
                        className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg p-4 shadow-lg ${toastType === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'} animate-in slide-in-from-top-5 fade-in`}
                    >
                        {toastType === 'success' ? (
                            <CheckCircle2 className="size-4" />
                        ) : (
                            <XCircle className="size-4" />
                        )}
                        <span>{toastMessage}</span>
                    </div>
                )}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Tasks
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Manage your tasks and stay organized
                        </p>
                    </div>
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-primary text-white shadow-lg hover:bg-primary/90">
                                <Plus className="size-4" />
                                New Task
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle className="text-lg">
                                    {editingTask ? 'Edit Task' : 'New Task'}
                                </DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={data.title}
                                        onChange={(e) =>
                                            setData('title', e.target.value)
                                        }
                                        className="focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">
                                        Description
                                    </Label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={data.description}
                                        onChange={(
                                            e: React.ChangeEvent<HTMLTextAreaElement>,
                                        ) =>
                                            setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        className="block w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="list_id">List</Label>
                                    <Select
                                        value={data.list_id}
                                        onValueChange={(value) =>
                                            setData('list_id', value)
                                        }
                                    >
                                        <SelectTrigger
                                            id="list_id"
                                            className="focus:ring-2 focus:ring-primary"
                                        >
                                            <SelectValue placeholder="Select a list" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {lists.map((list) => (
                                                <SelectItem
                                                    key={list.id}
                                                    value={list.id.toString()}
                                                >
                                                    {list.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="due_date">Due Date</Label>
                                    <Input
                                        type="date"
                                        id="due_date"
                                        name="due_date"
                                        value={data.due_date}
                                        className="focus:ring-2 focus:ring-primary"
                                        onChange={(e) =>
                                            setData('due_date', e.target.value)
                                        }
                                    />
                                </div>
                                <div className="flex items-center gap-2 space-y-2">
                                    <input
                                        type="checkbox"
                                        id="is_completed"
                                        name="is_completed"
                                        checked={data.is_completed}
                                        className="h-4 w-4 rounded border-gray-300 focus:ring-2 focus:ring-primary"
                                        onChange={(e) =>
                                            setData(
                                                'is_completed',
                                                e.target.checked,
                                            )
                                        }
                                    />
                                    <Label htmlFor="is_completed">
                                        Completed
                                    </Label>
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full bg-primary text-white shadow-lg hover:bg-primary/90"
                                    disabled={processing}
                                >
                                    {editingTask ? 'Update' : 'Create'}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="mb-4 grid grid-cols-3 gap-4">
                    <form
                        onSubmit={handleSearch}
                        className="relative col-span-2 flex-1"
                    >
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                        <Input
                            name="search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                            placeholder="Search tasks"
                        />
                    </form>
                    <Select
                        value={completedFilter}
                        onValueChange={(value) => {
                            setCompletedFilter(value as 'all' | 'completed' | 'incomplete');
                            const url =
                                typeof route === 'function' ? route('tasks.index') : '/tasks';

                            router.get(
                                url,
                                {
                                    search: searchTerm,
                                    filter: value,
                                },
                                {
                                    preserveState: true,
                                    preserveScroll: true,
                                },
                            );
                        }}
                    >
                        <SelectTrigger className="focus:ring-2 focus:ring-primary">
                            <SelectValue placeholder="Select a filter" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="al">All</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="incomplete">
                                Incomplete
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="rounded-md border">
                    <div className="relative w-full overflow-auto">
                        <table className="texts-sm w-full caption-bottom">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="px-4 py-2 text-left text-muted-foreground">
                                        Title
                                    </th>
                                    <th className="px-4 py-2 text-left text-muted-foreground">
                                        Description
                                    </th>
                                    <th className="px-4 py-2 text-left text-muted-foreground">
                                        List
                                    </th>
                                    <th className="px-4 py-2 text-left text-muted-foreground">
                                        Due Date
                                    </th>
                                    <th className="px-4 py-2 text-left text-muted-foreground">
                                        Status
                                    </th>
                                    <th className="px-4 py-2 text-left text-muted-foreground">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.data.map((task) => (
                                    <tr
                                        key={task.id}
                                        className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                                    >
                                        <td className="px-4 py-2">
                                            {task.title}
                                        </td>
                                        <td className="px-4 py-2">
                                            {task.description ||
                                                'No description'}
                                        </td>
                                        <td className="px-4 py-2">
                                            {task.list.title}
                                        </td>
                                        <td className="px-4 py-2">
                                            {task.due_date
                                                ? new Date(
                                                      task.due_date,
                                                  ).toLocaleDateString(
                                                      'th-TH',
                                                      {
                                                          year: 'numeric',
                                                          month: 'long',
                                                          day: 'numeric',
                                                      },
                                                  )
                                                : '—'}
                                        </td>
                                        <td className="px-4 py-2">
                                            {task.is_completed ? (
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle2 className="size-4 text-green-500" />
                                                    <span>Completed</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <XCircle className="size-4 text-red-500" />
                                                    <span>Incomplete</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-2 text-right align-middle">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="hover:bg-destructive/10 hover:text-destructive"
                                                    onClick={() =>
                                                        handleEdit(task)
                                                    }
                                                >
                                                    <Pencil className="size-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="hover:bg-destructive/10 hover:text-destructive"
                                                    onClick={() =>
                                                        handleDelete(task.id)
                                                    }
                                                >
                                                    <Trash className="size-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {tasks.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-4 py-2 text-center text-muted-foreground"
                                        >
                                            No tasks foreground
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="tect-sm text-muted-foreground">
                        Showing {tasks.from || 0} to {tasks.to || 0} of{' '}
                        {tasks.total || 0} tasks
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                                handlePageChange(tasks.current_page - 1)
                            }
                            disabled={tasks.current_page === 1}
                        >
                            <ChevronLeft className="size-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                                handlePageChange(tasks.current_page + 1)
                            }
                            disabled={tasks.current_page === tasks.last_page}
                        >
                            <ChevronRight className="size-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
