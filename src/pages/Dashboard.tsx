import { useMemo } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useProfile } from '@/hooks/useProfile';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { TaskCard } from '@/components/dashboard/TaskCard';
import { Button } from '@/components/ui/button';
import { 
  CheckSquare, 
  Clock, 
  AlertCircle, 
  TrendingUp,
  Plus,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const { tasks, loading, updateTask, deleteTask } = useTasks();
  const { profile } = useProfile();

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const inProgress = tasks.filter(t => t.status === 'in_progress').length;
    const highPriority = tasks.filter(t => t.priority === 'high' && t.status !== 'completed').length;
    
    return { total, completed, inProgress, highPriority };
  }, [tasks]);

  const recentTasks = tasks.slice(0, 5);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          {getGreeting()}, <span className="gradient-text">{profile?.full_name || 'there'}</span>!
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening with your tasks today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Tasks"
          value={stats.total}
          icon={CheckSquare}
          description="All time"
        />
        <StatsCard
          title="Completed"
          value={stats.completed}
          icon={TrendingUp}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="In Progress"
          value={stats.inProgress}
          icon={Clock}
          description="Currently working"
        />
        <StatsCard
          title="High Priority"
          value={stats.highPriority}
          icon={AlertCircle}
          description="Needs attention"
        />
      </div>

      {/* Recent Tasks */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Tasks</h2>
          <Button 
            variant="ghost" 
            className="gap-2"
            onClick={() => navigate('/dashboard/tasks')}
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {loading ? (
          <div className="grid gap-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 rounded-lg bg-secondary/50 animate-pulse" />
            ))}
          </div>
        ) : recentTasks.length > 0 ? (
          <div className="grid gap-3">
            {recentTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={() => navigate('/dashboard/tasks')}
                onDelete={deleteTask}
                onStatusChange={(id, status) => updateTask(id, { status })}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 rounded-lg border border-dashed border-border">
            <CheckSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-lg mb-2">No tasks yet</h3>
            <p className="text-muted-foreground mb-4">
              Get started by creating your first task
            </p>
            <Button onClick={() => navigate('/dashboard/tasks')} className="gap-2">
              <Plus className="w-4 h-4" />
              Create Task
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
