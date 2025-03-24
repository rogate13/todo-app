const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, 'todos.json');

app.use(cors({ origin: "*", methods: "GET,POST,PUT,DELETE", allowedHeaders: "Content-Type" }));
app.use(bodyParser.json());

// Helper function to read todos
const readTodos = () => {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
};

// Helper function to write todos
const writeTodos = (todos) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2));
};

// GET all todos
app.get('/todos', (req, res) => {
    const todos = readTodos();
    res.json(todos);
});

// POST a new todo
app.post('/todos', (req, res) => {
    const todos = readTodos();
    const newTodo = {
        id: Date.now(),
        task: req.body.task,
        completed: false,
    };
    todos.push(newTodo);
    writeTodos(todos);
    res.status(201).json(newTodo);
});

// PUT - Edit Nama Tugas
app.put('/todos/:id/task', (req, res) => {
    const todos = readTodos();
    const todoId = parseInt(req.params.id);
    const { task } = req.body;

    console.log(`Edit task request for ID ${todoId}:`, req.body); // Debug

    let updatedTodo = null;

    const updatedTodos = todos.map((todo) => {
        if (todo.id === todoId) {
            updatedTodo = { ...todo, task: task };
            return updatedTodo;
        }
        return todo;
    });

    if (!updatedTodo) {
        return res.status(404).json({ message: 'Todo not found' });
    }

    writeTodos(updatedTodos);
    console.log('Updated task:', updatedTodo); // Debug
    res.json(updatedTodo);
});

// PUT - Toggle Status Completed
app.put('/todos/:id/status', (req, res) => {
    const todos = readTodos();
    const todoId = parseInt(req.params.id);
    const { completed } = req.body;

    console.log(`Toggle status request for ID ${todoId}:`, req.body); // Debug

    let updatedTodo = null;

    const updatedTodos = todos.map((todo) => {
        if (todo.id === todoId) {
            updatedTodo = { ...todo, completed: completed };
            return updatedTodo;
        }
        return todo;
    });

    if (!updatedTodo) {
        return res.status(404).json({ message: 'Todo not found' });
    }

    writeTodos(updatedTodos);
    console.log('Updated status:', updatedTodo); // Debug
    res.json(updatedTodo);
});

// DELETE a todo
app.delete('/todos/:id', (req, res) => {
    const todos = readTodos();
    const todoId = parseInt(req.params.id);
    const filteredTodos = todos.filter((todo) => todo.id !== todoId);
    writeTodos(filteredTodos);
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});