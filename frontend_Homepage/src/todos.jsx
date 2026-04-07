import React, { useState } from 'react';

function AddTaskForm({ username = 'anonymous' }) {
  const [formData, setFormData] = useState({
    taskName: '',
    status: 'pending',
    dueDate: '',
    priority: 'medium',
    category: ''
  });

  const [tasks, setTasks] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTask = async () => {
    if (!formData.taskName.trim()) {
      alert('Task name is required!');
      return;
    }

    // Build payload with exact key order: username, task, status, due_date, priority, category
    const payload = {};
    payload.username = username; // from prop
    payload.task = formData.taskName.trim();
    payload.status = formData.status;
    payload.due_date = formData.dueDate || '';
    payload.priority = formData.priority;
    payload.category = formData.category || '';

    try {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const text = await res.text().catch(() => '');
      let json = null;
      try { json = text ? JSON.parse(text) : null; } catch { json = null; }

      if (!res.ok) {
        const serverMsg = (json && (json.message || json.error)) || text || `Status ${res.status}`;
        alert('Failed to add task: ' + serverMsg);
        return;
      }

      // on success, add to local tasks list and show success
      const newTask = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      setTasks(prev => [...prev, newTask]);
      alert('Task added successfully!');

      // Reset form
      setFormData({
        taskName: '',
        status: 'pending',
        dueDate: '',
        priority: 'medium',
        category: ''
      });
    } catch (err) {
      console.error('Failed to POST todo:', err);
      alert('Network error while adding task. Check that the backend is running and reachable.');
    }
  };

  const handleCancel = () => {
    setFormData({
      taskName: '',
      status: 'pending',
      dueDate: '',
      priority: 'medium',
      category: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Add New Task</h1>
        
        <div className="space-y-6">
          {/* Task Name */}
          <div>
            <label className="block text-base font-semibold text-gray-800 mb-3">
              Task Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="taskName"
              value={formData.taskName}
              onChange={handleInputChange}
              placeholder="Enter task name"
              className="w-full px-5 py-4 text-base border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-base font-semibold text-gray-800 mb-3">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-5 py-4 text-base border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:outline-none transition-colors bg-white appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
                backgroundSize: '1.5em 1.5em',
                paddingRight: '3rem'
              }}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-base font-semibold text-gray-800 mb-3">
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              className="w-full px-5 py-4 text-base border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-base font-semibold text-gray-800 mb-3">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              className="w-full px-5 py-4 text-base border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:outline-none transition-colors bg-white appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
                backgroundSize: '1.5em 1.5em',
                paddingRight: '3rem'
              }}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-base font-semibold text-gray-800 mb-3">
              Category
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              placeholder="Enter category (optional)"
              className="w-full px-5 py-4 text-base border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={handleAddTask}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              Add Task
            </button>
            <button
              onClick={handleCancel}
              className="px-8 py-4 bg-gray-200 text-gray-700 text-lg font-semibold rounded-2xl hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Display added tasks count */}
        {tasks.length > 0 && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-green-700 font-medium text-center">
              ✅ {tasks.length} task{tasks.length > 1 ? 's' : ''} added successfully!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddTaskForm;
