'use client';

import { useCallback, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import styles from './TaskManager.module.scss';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function HomePage() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editFormData, setEditFormData] = useState({ title: '', description: '' });

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterStatus) params.append('status', filterStatus);

      const url = params.toString() ? `${API_URL}?${params.toString()}` : API_URL;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      setTasks(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, filterStatus]);

  useEffect(() => {
    if (!API_URL) {
      setError('API_URL is undefined! Check your .env.local file.');
      setIsLoading(false);
      return;
    }
    fetchTasks();
  }, [fetchTasks]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Task title cannot be empty.',
        confirmButtonColor: '#590202',
        confirmButtonText: 'Okay'
      });
      return;
    }
    if (!description) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Task description cannot be empty.',
        confirmButtonColor: '#590202',
        confirmButtonText: 'Okay'
      });
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });
      if (!res.ok) {
        const errorData = await res.json(); 
         throw new Error(errorData.message || 'An unknown error occurred.');
      }
      
      setTitle('');
      setDescription('');
      fetchTasks();
      Swal.fire({
        icon: 'success',
        title: 'Task Added!',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: err.message,
        confirmButtonColor: '#590202',
        confirmButtonText: 'Okay'
      })
    }
  };

  const handleDelete = async (taskId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#dc3545',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const originalTasks = [...tasks];
        setTasks(tasks.filter(t => t._id !== taskId));
        try {
          const res = await fetch(`${API_URL}/${taskId}`, { method: 'DELETE' });
          if (!res.ok) throw new Error('Failed to delete');
          Swal.fire({
            title: 'Deleted!',
            text: 'Your task has been deleted.',
            icon: 'success',
            confirmButtonText: 'Okay'
          });
        } catch (err) {
          setError(err.message);
          setTasks(originalTasks);
        }
      }
    });
  };

  const handleStatusChange = async (taskId, newStatus) => {
    const originalTasks = [...tasks];
    setTasks(tasks.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
    try {
      const res = await fetch(`${API_URL}/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Status Updated',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
    } catch (err) {
      setTasks(originalTasks);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'The task status could not be updated.',
        confirmButtonColor: '#590202',
        confirmButtonText: 'Okay'
      });
    }
  };

  const handleEditClick = (task) => {
    setEditingTaskId(task._id);
    setEditFormData({ title: task.title, description: task.description });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  }

  const handleUpdateSubmit = async (e, taskId) => {
    e.preventDefault();
    const originalTasks = [...tasks];
    setTasks(tasks.map(t => (t._id === taskId ? { ...t, ...editFormData } : t)));
    setEditingTaskId(null);

    try {
      const res = await fetch(`${API_URL}/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData),
      });
      if (!res.ok) throw new Error('Failed to update task');
      Swal.fire({
        icon: 'success',
        title: 'Task Updated!',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (err) {
      setTasks(originalTasks);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'The task could not be updated.',
        confirmButtonColor: '#590202',
        confirmButtonText: 'Okay'
      });
    }
  }

  return (
    <>
      <header className={styles.header}>Task Manager</header>

      <main className={styles.container}>
        <div className={styles.mainGrid}>
          <div className={styles.leftPane}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="title">Task Title</label>
                  <input
                    id="title"
                    className={styles.input}
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Enter task title"
                  />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="description">Task Description</label>
                  <textarea
                    id="description"
                    className={styles.textarea}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Enter task details"
                  />
              </div>
              <button type="submit" className={styles.submitBtn}>+ Add Task</button>
            </form>
          </div>
          
          <div className={styles.rightPane}>
            <div className={styles.controls}>
              <input
                className={styles.input}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search..."
              />
              <select
                className={styles.select}
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
              >
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In-Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {isLoading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div className={styles.taskList}>
              {tasks.map(task => (
                <div key={task._id} className={styles.taskCard}>
                  {editingTaskId === task._id ? (
                    <form onSubmit={(e) => handleUpdateSubmit(e, task._id)} className={styles.editForm}>
                      <input
                        type="text"
                        name="title"
                        value={editFormData.title}
                        onChange={handleEditFormChange}
                        className={styles.input}
                      />
                      <textarea
                        name="description"
                        value={editFormData.description}
                        onChange={handleEditFormChange}
                        className={styles.textarea}
                      />
                      <div className={styles.editActions}>
                        <button type="submit" className={styles.saveButton}>Save</button>
                        <button type="button" onClick={() => setEditingTaskId(null)} className={styles.cancelButton}>Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className={styles.taskHeader}>
                        <h3>{task.title}</h3>
                        <span className={`${styles.status} ${styles[task.status]}`}>
                          {task.status}
                        </span>
                      </div>
                      <p>{task.description}</p>
                      <div className={styles.taskActions}>
                        {task.status === "pending" && (
                          <button className={styles.startButton} onClick={() => handleStatusChange(task._id, "in-progress")}>Start Task</button>
                        )}
                        {task.status === "in-progress" && (
                          <button className={styles.endButton} onClick={() => handleStatusChange(task._id, "completed")}>End Task</button>
                        )}
                        <button className={styles.editButton} onClick={() => handleEditClick(task)}>Edit</button>
                        <button className={styles.deleteButton} onClick={() => handleDelete(task._id)}>Delete</button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}