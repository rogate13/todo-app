import React, { useState, useEffect } from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import { Modal, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';

const API_URL = "https://backend-todo-app-delta.vercel.app";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch(`${API_URL}/todos`);
      if (!response.ok) {
        throw new Error('Gagal mengambil data todos');
      }
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Gagal mengambil data todos!',
      });
    }
  };

  const addTodo = async (task) => {
    try {
      const response = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task }),
      });
      if (!response.ok) {
        throw new Error('Gagal menambahkan tugas');
      }
      await fetchTodos();
      Swal.fire({
        icon: 'success',
        title: 'Tugas Ditambahkan!',
        text: `"${task}" berhasil ditambahkan.`,
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error('Error adding todo:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Gagal menambahkan tugas!',
      });
    }
  };

  const editTodo = async (id, newTask) => {
    try {
      console.log('Updating task:', { id, task: newTask });

      const response = await fetch(`${API_URL}/todos/${id}/task`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: newTask }),
      });

      if (!response.ok) throw new Error('Gagal memperbarui tugas');

      const updatedTodo = await response.json();
      console.log('Response from server:', updatedTodo);

      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === id ? updatedTodo : todo))
      );
      setEditingTodo(null);
      setShowModal(false);

      Swal.fire({
        icon: 'success',
        title: 'Tugas Diperbarui!',
        text: `Tugas berhasil diubah menjadi "${newTask}".`,
        showConfirmButton: false,
        timer: 1500,
      });

    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Gagal memperbarui tugas!',
      });
    }
  };

  const toggleTodo = async (id) => {
    try {
      const todoToToggle = todos.find((todo) => todo.id === id);
      const updatedStatus = !todoToToggle.completed;

      console.log('Toggling status:', { id, completed: updatedStatus });

      const response = await fetch(`${API_URL}/todos/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: updatedStatus }),
      });

      if (!response.ok) throw new Error('Gagal memperbarui status tugas');

      const updatedTodo = await response.json();
      console.log('Response from server:', updatedTodo);

      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === id ? updatedTodo : todo))
      );

      Swal.fire({
        icon: 'info',
        title: 'Tugas Diperbarui!',
        text: `"${updatedTodo.task}" ditandai sebagai ${updatedTodo.completed ? 'selesai' : 'belum selesai'}.`,
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Gagal memperbarui status tugas!',
      });
    }
  };

  const deleteTodo = async (id) => {
    try {
      const todoToDelete = todos.find((todo) => todo.id === id);
      const response = await fetch(`${API_URL}/todos/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Gagal menghapus tugas');
      }
      await fetchTodos();
      Swal.fire({
        icon: 'warning',
        title: 'Tugas Dihapus!',
        text: `"${todoToDelete.task}" berhasil dihapus.`,
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error('Error deleting todo:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Gagal menghapus tugas!',
      });
    }
  };

  const handleEditClick = (todo) => {
    setEditingTodo(todo);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTodo(null);
  };

  return (
    <div className="container mt-5">
      <h1>🍔 To-Do List 🍕</h1>
      <TodoForm addTodo={addTodo} />
      <TodoList
        todos={todos}
        toggleTodo={toggleTodo}
        deleteTodo={deleteTodo}
        setEditingTodo={handleEditClick}
      />

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Tugas</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            className="form-control"
            value={editingTodo ? editingTodo.task : ''}
            onChange={(e) =>
              setEditingTodo({ ...editingTodo, task: e.target.value })
            }
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Tutup
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              if (editingTodo && editingTodo.task.trim() !== '') {
                editTodo(editingTodo.id, editingTodo.task);
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Tugas tidak boleh kosong!',
                });
              }
            }}
          >
            Simpan Perubahan
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default App;
