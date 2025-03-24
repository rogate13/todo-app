import React from 'react';

const TodoList = ({ todos, toggleTodo, deleteTodo, setEditingTodo }) => {
  return (
    <ul className="list-group">
      {todos.map((todo) => (
        <li
          key={todo.id}
          className={`list-group-item ${todo.completed ? 'completed' : ''}`}
        >
          <div>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span className="task-text">{todo.task}</span>
          </div>
          <div>
            <button
              onClick={() => setEditingTodo(todo)}
              className="btn btn-warning btn-sm me-2"
            >
              Edit
            </button>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="btn btn-danger btn-sm"
            >
              Hapus
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TodoList;