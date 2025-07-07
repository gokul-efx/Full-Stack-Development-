# Full-Stack-Development-To do list web application 
todo-app/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── .env
│   ├── server.js
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── app.js
├── package.json
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const taskRoutes = require('./routes/tasks');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/tasks', taskRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => app.listen(5000, () => console.log("Server running on port 5000")))
.catch(err => console.error(err));
MONGO_URI=mongodb://localhost:27017/todoconst mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

module.exports = mongoose.model('Task', TaskSchema);const express = require('express');
const Task = require('../models/Task');
const router = express.Router();

router.get('/', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

router.post('/', async (req, res) => {
  const task = new Task({ title: req.body.title });
  await task.save();
  res.json(task);
});

router.put('/:id', async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(task);
});

router.delete('/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Task deleted' });
});

module.exports = router;

<!DOCTYPE html>
<html>
<head>
  <title>To-Do List</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <h1>My To-Do List</h1>
  <input type="text" id="taskInput" placeholder="New task..." />
  <button onclick="addTask()">Add</button>
  <ul id="taskList"></ul>
  <script src="app.js"></script>
</body>
</html>body {
  font-family: Arial;
  margin: 2em;
}
li.completed {
  text-decoration: line-through;
  color: gray;
}const apiUrl = "http://localhost:5000/api/tasks";

async function fetchTasks() {
  const res = await fetch(apiUrl);
  const tasks = await res.json();
  const list = document.getElementById("taskList");
  list.innerHTML = '';
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : '';
    li.textContent = task.title;
    li.onclick = () => toggleComplete(task._id, !task.completed);
    const delBtn = document.createElement('button');
    delBtn.textContent = '❌';
    delBtn.onclick = e => {
      e.stopPropagation();
      deleteTask(task._id);
    };
    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

async function addTask() {
  const title = document.getElementById("taskInput").value;
  await fetch(apiUrl, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ title })
  });
  document.getElementById("taskInput").value = '';
  fetchTasks();
}

async function toggleComplete(id, completed) {
  await fetch(`${apiUrl}/${id}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ completed })
  });
  fetchTasks();
}

async function deleteTask(id) {
  await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
  fetchTasks();
}

fetchTasks();

