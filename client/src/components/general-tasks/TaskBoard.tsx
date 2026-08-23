'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { TaskColumn } from './TaskColumn';
import TaskModal from './TaskModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export interface ITask {
  _id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'COMPLETED' | 'BLOCKED';
  priority: 'NORMAL' | 'MEDIUM' | 'HIGH';
  assignedTo: {
    _id: string;
    name: string;
    email: string;
    profileImage?: string;
  };
  reportedTo: {
    _id: string;
    name: string;
    email: string;
    profileImage?: string;
  };
  courseName?: 'CPC' | 'JIPC' | 'Bootcamp';
  batchNo?: string;
  startDate?: string;
  dueDate?: string;
  estimatedTime?: number;
  createdAt: string;
  updatedAt?: string;
  comments?: any[];
}

export function TaskBoard() {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<ITask | null>(null);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get('/tasks');
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Could not load tasks.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleOpenCreateModal = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  const tasksByStatus = (status: ITask['status']) => {
    return tasks.filter((task) => task.status === status);
  };

  const statuses: ITask['status'][] = [
    'TODO',
    'IN_PROGRESS',
    'IN_REVIEW',
    'COMPLETED',
    'BLOCKED',
  ];

  if (isLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground animate-pulse">
        Loading task board...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">General Tasks</h2>
          <p className="text-sm text-muted-foreground">
            Track and manage ongoing operational tasks and deliverables.
          </p>
        </div>
        <Button onClick={handleOpenCreateModal} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" /> Create Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {statuses.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasksByStatus(status)}
            onTaskUpdate={fetchTasks}
          />
        ))}
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        taskToEdit={taskToEdit}
        onTaskSave={fetchTasks}
      />
    </div>
  );
}
