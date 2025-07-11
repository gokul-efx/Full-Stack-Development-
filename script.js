async function addTask() {
  const task = document.getElementById("taskInput").value;
  await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: task }),
  });
  document.getElementById("taskInput").value = "";
  loadTasks();
}
async function loadTasks() {
  const res = await fetch("/api/tasks");
  const tasks = await res.json();
  const list = document.getElementById("taskList");
  list.innerHTML = "";
  tasks.forEach(task => {
    const li = document.createElement("li");
    li.innerText = task.name;
    list.appendChild(li);
  });
}
loadTasks();