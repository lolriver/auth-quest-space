import { useState, useMemo } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { Task, TaskStatus, TaskPriority, CreateTaskInput } from '@/types/database';
import { TaskCard } from '@/components/dashboard/TaskCard';
import { TaskDialog } from '@/components/dashboard/TaskDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Filter,
  CheckSquare,
  SlidersHorizontal
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type FilterStatus = TaskStatus | 'all';
type FilterPriority = TaskPriority | 'all';

export default function Tasks() {
  const { tasks, loading, createTask, updateTask, deleteTask } = useTasks();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [priorityFilter, setPriorityFilter] = useState<FilterPriority>('all');

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Search filter
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      
      // Status filter
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      
      // Priority filter
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter]);

  const handleOpenDialog = (task?: Task) => {
    setEditingTask(task || null);
    setDialogOpen(true);
  };

  const handleSubmit = async (data: CreateTaskInput) => {
    if (editingTask) {
      await updateTask(editingTask.id, data);
    } else {
      await createTask(data);
    }
  };

  const taskGroups = useMemo(() => {
    const pending = filteredTasks.filter(t => t.status === 'pending');
    const inProgress = filteredTasks.filter(t => t.status === 'in_progress');
    const completed = filteredTasks.filter(t => t.status === 'completed');
    return { pending, inProgress, completed };
  }, [filteredTasks]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground mt-1">
            Manage and organize your tasks
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus className="w-4 h-4" />
          New Task
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as FilterStatus)}>
          <SelectTrigger className="w-full sm:w-40 bg-secondary/50 border-border">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as FilterPriority)}>
          <SelectTrigger className="w-full sm:w-40 bg-secondary/50 border-border">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Task List */}
      {loading ? (
        <div className="grid gap-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-24 rounded-lg bg-secondary/50 animate-pulse" />
          ))}
        </div>
      ) : filteredTasks.length > 0 ? (
        <div className="space-y-8">
          {/* In Progress */}
          {taskGroups.inProgress.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-warning mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-warning" />
                In Progress ({taskGroups.inProgress.length})
              </h2>
              <div className="grid gap-3">
                {taskGroups.inProgress.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={handleOpenDialog}
                    onDelete={deleteTask}
                    onStatusChange={(id, status) => updateTask(id, { status })}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Pending */}
          {taskGroups.pending.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                Pending ({taskGroups.pending.length})
              </h2>
              <div className="grid gap-3">
                {taskGroups.pending.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={handleOpenDialog}
                    onDelete={deleteTask}
                    onStatusChange={(id, status) => updateTask(id, { status })}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Completed */}
          {taskGroups.completed.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-success mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success" />
                Completed ({taskGroups.completed.length})
              </h2>
              <div className="grid gap-3">
                {taskGroups.completed.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={handleOpenDialog}
                    onDelete={deleteTask}
                    onStatusChange={(id, status) => updateTask(id, { status })}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16 rounded-lg border border-dashed border-border">
          <CheckSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium text-xl mb-2">
            {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' 
              ? 'No matching tasks' 
              : 'No tasks yet'
            }
          </h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
              ? 'Try adjusting your filters to find what you\'re looking for'
              : 'Get started by creating your first task to stay organized'
            }
          </p>
          <Button onClick={() => handleOpenDialog()} className="gap-2">
            <Plus className="w-4 h-4" />
            Create Task
          </Button>
        </div>
      )}

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={editingTask}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
