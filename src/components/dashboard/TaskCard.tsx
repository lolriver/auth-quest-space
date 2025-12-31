import { useState } from 'react';
import { Task, TaskStatus, TaskPriority } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  Circle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

const statusConfig: Record<TaskStatus, { icon: React.ElementType; label: string; className: string }> = {
  pending: { 
    icon: Circle, 
    label: 'Pending', 
    className: 'text-muted-foreground border-muted' 
  },
  in_progress: { 
    icon: Clock, 
    label: 'In Progress', 
    className: 'text-warning border-warning bg-warning/10' 
  },
  completed: { 
    icon: CheckCircle2, 
    label: 'Completed', 
    className: 'text-success border-success bg-success/10' 
  }
};

const priorityConfig: Record<TaskPriority, { label: string; className: string }> = {
  low: { label: 'Low', className: 'bg-muted text-muted-foreground' },
  medium: { label: 'Medium', className: 'bg-primary/10 text-primary border-primary/20' },
  high: { label: 'High', className: 'bg-destructive/10 text-destructive border-destructive/20' }
};

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const status = statusConfig[task.status];
  const priority = priorityConfig[task.priority];
  const StatusIcon = status.icon;

  return (
    <Card 
      className={cn(
        "glass glass-hover p-4 transition-all duration-300 group cursor-pointer",
        task.status === 'completed' && "opacity-70"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-3">
        {/* Status indicator */}
        <button
          onClick={() => {
            const nextStatus: Record<TaskStatus, TaskStatus> = {
              pending: 'in_progress',
              in_progress: 'completed',
              completed: 'pending'
            };
            onStatusChange(task.id, nextStatus[task.status]);
          }}
          className={cn(
            "mt-0.5 p-1 rounded-full transition-all duration-200 border",
            status.className,
            "hover:scale-110"
          )}
        >
          <StatusIcon className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className={cn(
              "font-medium text-foreground transition-all",
              task.status === 'completed' && "line-through text-muted-foreground"
            )}>
              {task.title}
            </h3>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn(
                    "h-8 w-8 opacity-0 transition-opacity",
                    isHovered && "opacity-100"
                  )}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => onEdit(task)}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => onDelete(task.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {task.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
          
          <div className="flex items-center gap-2 mt-3">
            <Badge variant="outline" className={cn("text-xs", priority.className)}>
              {task.priority === 'high' && <AlertCircle className="w-3 h-3 mr-1" />}
              {priority.label}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
