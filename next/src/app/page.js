'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './TaskManager.module.scss';

const API_URL = 'http://localhost:8000/api/v1/task';

export default function HomePage() {
  // === STATE MANAGEMENT ===
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  // --- NEW STATE for Search and Filter ---
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState(''); // Empty string means 'All'

  // === DATA FETCHING ===
  // --- UPDATED fetchTasks function ---
  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      // Use URLSearchParams to easily build the query string
      const params = new URLSearchParams();
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      if (filterStatus) {
        params.append('status', filterStatus);
      }
      const queryString = params.toString();
      
      // Append the query string to the URL if it exists
      const url = queryString ? `${API_URL}?${queryString}` : API_URL;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch tasks. Is the backend server running?');
      }
      const data = await response.json();
      setTasks(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
    // --- UPDATED dependency array ---
    // This function will now be re-created if searchTerm or filterStatus changes
  }, [searchTerm, filterStatus]);

  useEffect(() => {
    fetchTasks();
    // This effect now re-runs whenever fetchTasks is re-created
  }, [fetchTasks]);

  // === EVENT HANDLERS (No changes needed for these) ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      alert('Please enter a title for the task.');
      return;
    }
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });
      if (!response.ok) throw new Error('Failed to create task');
      setTitle('');
      setDescription('');
      fetchTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (taskId) => {
    const originalTasks = [...tasks];
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    setTasks(currentTasks => currentTasks.filter(task => task._id !== taskId));
    try {
      const response = await fetch(`${API_URL}/${taskId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete on the server.');
    } catch (err) {
      setError('Failed to delete task. Please try again.');
      setTasks(originalTasks);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    const originalTasks = [...tasks];
    setTasks(currentTasks =>
      currentTasks.map(task =>
        task._id === taskId ? { ...task, status: newStatus } : task
      )
    );
    try {
      const response = await fetch(`${API_URL}/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error('Failed to update on the server.');
    } catch (err) {
      setError('Failed to update status. Please try again.');
      setTasks(originalTasks);
    }
  };

  // === JSX: The User Interface ===
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>My Simple Task Manager</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Add a New Task</h2>
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.input}
        />
        <textarea
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={styles.textarea}
        />
        <button type="submit" className={styles.button}>Add Task</button>
      </form>
      
      {/* --- NEW Search and Filter UI --- */}
      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Search by title or description..."
          className={styles.input}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className={styles.select}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">Filter by All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In-Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>


      <div className={styles.taskList}>
        <h2>My Tasks</h2>
        {isLoading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        
        {!isLoading && !error && tasks.length === 0 && (
          <p>No tasks found. Try adjusting your search or filter!</p>
        )}
        
        {tasks.map((task) => (
          <div key={task._id} className={`${styles.taskItem} ${styles[task.status]}`}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <div className={styles.taskActions}>
              <select 
                value={task.status}
                onChange={(e) => handleStatusChange(task._id, e.target.value)}
                className={styles.select}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In-Progress</option>
                <option value="completed">Completed</option>
              </select>

              <button 
                onClick={() => handleDelete(task._id)}
                className={`${styles.button} ${styles.deleteButton}`}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};