import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Task, CreateTaskInput, UpdateTaskInput, TaskStatus, TaskPriority } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type cast the data properly
      const typedTasks: Task[] = (data || []).map(task => ({
        ...task,
        status: task.status as TaskStatus,
        priority: task.priority as TaskPriority
      }));
      
      setTasks(typedTasks);
    } catch (error: any) {
      toast({
        title: "Error fetching tasks",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (input: CreateTaskInput) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('tasks')
        .insert({
          ...input,
          user_id: userData.user.id
        })
        .select()
        .single();

      if (error) throw error;
      
      const typedTask: Task = {
        ...data,
        status: data.status as TaskStatus,
        priority: data.priority as TaskPriority
      };
      
      setTasks(prev => [typedTask, ...prev]);
      toast({
        title: "Task created",
        description: "Your task has been created successfully."
      });
      return { data: typedTask, error: null };
    } catch (error: any) {
      toast({
        title: "Error creating task",
        description: error.message,
        variant: "destructive"
      });
      return { data: null, error };
    }
  };

  const updateTask = async (id: string, input: UpdateTaskInput) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(input)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      const typedTask: Task = {
        ...data,
        status: data.status as TaskStatus,
        priority: data.priority as TaskPriority
      };
      
      setTasks(prev => prev.map(t => t.id === id ? typedTask : t));
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully."
      });
      return { data: typedTask, error: null };
    } catch (error: any) {
      toast({
        title: "Error updating task",
        description: error.message,
        variant: "destructive"
      });
      return { data: null, error };
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setTasks(prev => prev.filter(t => t.id !== id));
      toast({
        title: "Task deleted",
        description: "Your task has been deleted successfully."
      });
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Error deleting task",
        description: error.message,
        variant: "destructive"
      });
      return { error };
    }
  };

  return {
    tasks,
    loading,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask
  };
}
