import { useEffect, useState } from 'react';
import api from '../lib/api';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [editing, setEditing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  async function load() {
    setIsLoading(true);
    try {
      const { data } = await api.get('/tasks');
      setTasks(data.tasks);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(payload) {
    try {
      await api.post('/tasks', payload);
      setEditing(null);
      await load();
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  }

  async function handleUpdate(payload) {
    try {
      await api.put(`/tasks/${editing._id}`, payload);
      setEditing(null);
      await load();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  }

  async function handleDelete(task) {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/tasks/${task._id}`);
        await load();
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Task Management</h1>
        <p className="text-blue-100 text-lg">
          Create, organize, and track your study tasks
        </p>
      </div>

      {/* Task Form */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {editing ? 'Edit Task' : 'Add New Task'}
        </h3>
        <TaskForm
          initial={editing}
          onSubmit={editing ? handleUpdate : handleCreate}
          onCancel={() => setEditing(null)}
        />
      </div>

      {/* Task List */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <svg className="w-6 h-6 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          Task List
        </h3>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            onEdit={setEditing}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
