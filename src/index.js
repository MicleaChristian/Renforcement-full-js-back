const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(session({
  secret: 'my-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60
  }
}));

let users = [];
let tasks = [];

function checkLogin(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Not logged in' });
  }
  next();
}

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }
  const existingUser = users.find(u => u.username === username);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = { username, passwordHash };
  users.push(newUser);
  req.session.user = { username };
  return res.status(201).json({ message: 'User registered' });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  req.session.user = { username };
  return res.json({ message: `Logged in as ${username}` });
});

app.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logged out' });
});

app.get('/tasks', checkLogin, (req, res) => {
  const username = req.session.user.username;
  const userTasks = tasks.filter(t => t.user === username);
  res.json(userTasks);
});

app.post('/tasks', checkLogin, (req, res) => {
  const username = req.session.user.username;
  const { title, description, deadline } = req.body;
  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }
  const newTask = {
    id: tasks.length + 1,
    user: username,
    title,
    description: description || '',
    deadline: deadline || '',
    status: 'pending'
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put('/tasks/:id', checkLogin, (req, res) => {
  const username = req.session.user.username;
  const { id } = req.params;
  const { title, description, deadline } = req.body;
  const task = tasks.find(t => t.id === parseInt(id) && t.user === username);
  if (!task) {
    return res.status(404).json({ message: 'Task not found or not yours' });
  }
  if (task.status === 'completed') {
    return res.status(400).json({ message: 'Cannot modify a completed task' });
  }
  if (title) task.title = title;
  if (description !== undefined) task.description = description;
  if (deadline !== undefined) task.deadline = deadline;
  res.json(task);
});

app.patch('/tasks/:id/complete', checkLogin, (req, res) => {
  const username = req.session.user.username;
  const { id } = req.params;
  const task = tasks.find(t => t.id === parseInt(id) && t.user === username);
  if (!task) {
    return res.status(404).json({ message: 'Task not found or not yours' });
  }
  task.status = 'completed';
  res.json(task);
});

app.delete('/tasks/:id', checkLogin, (req, res) => {
  const username = req.session.user.username;
  const { id } = req.params;
  const index = tasks.findIndex(t => t.id === parseInt(id) && t.user === username);
  if (index === -1) {
    return res.status(404).json({ message: 'Task not found or not yours' });
  }
  if (tasks[index].status === 'completed') {
    return res.status(400).json({ message: 'Cannot delete a completed task' });
  }
  tasks.splice(index, 1);
  res.json({ message: 'Task deleted' });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`✅ Backend running at http://localhost:${PORT}`));