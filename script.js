// Load tasks from localStorage or start with empty array
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "pending"; 

// Grab DOM elements takeing user input and conect html
const taskinput = document.getElementById("taskinput");
const addtaskbtn = document.getElementById("addtaskbtn");
const tasklist = document.getElementById("tasklist");
const filterbuttons = document.querySelectorAll(".filters button");
const dueDateInput = document.getElementById("duedate");

// Render tasks based on current filter
function renderTasks() {
  tasklist.innerHTML = "";

  let filteredtasks = tasks.filter(task => {
    if (filter === "all") return true;
    if (filter === "pending") return task.status === "pending";
    if (filter === "completed") return task.status === "completed";
  });

  filteredtasks.forEach(task => {
    const li = document.createElement("li");
    li.className = "task";
    if (task.status === "completed") {
      li.classList.add("completed");
}

    const span = document.createElement("span"); // display task elements
    span.textContent = task.description;

    // Due date
    if (task.dueDate) {
      const due = document.createElement("span");
      due.textContent = `Due: ${task.dueDate}`;
      due.style.marginLeft = "10px";
      // Highlight overdue
      const today = new Date().toISOString().split("T")[0];
      li.appendChild(due);
    }

    // Status button logic
const statusbtn = document.createElement("button");

if (task.status === "completed") { // task aledy completed check?
  statusbtn.textContent = "Undo";
  statusbtn.classList.add("undo");
  statusbtn.onclick = () => setStatus(task.id, "pending");
} 
else {
  statusbtn.textContent = "Complete";
  statusbtn.classList.add("complete");
  statusbtn.onclick = () => setStatus(task.id, "completed");
}

    // Edit button
    const editbtn = document.createElement("button");
    editbtn.textContent = "Edit";
    editbtn.classList.add("edit");
    editbtn.onclick = () => editTask(task.id);

    // Delete button (with confirmation)
    const deletebtn = document.createElement("button");
    deletebtn.textContent = "Delete";
    deletebtn.classList.add("delete");
    deletebtn.onclick = () => {
      if (confirm("Are you sure you want to delete this task?")) {
        deleteTask(task.id);
      }
    };

    li.appendChild(span);
    li.appendChild(statusbtn);
    li.appendChild(editbtn);
    li.appendChild(deletebtn);

    tasklist.appendChild(li);
  });
}

// Show popup message (toast)
function showMessage(msg) {
  const message = document.getElementById("message");
  message.textContent = msg;
  message.classList.add("show");

  setTimeout(() => {
    message.classList.remove("show");
    message.textContent = "";
  }, 2000);
}

// Add new task
function addTask() {
  const description = taskinput.value.trim();
  const dueDate = dueDateInput.value;

  if (!description) { //check user input usnig not oprater
    showMessage("Please enter a task");
    return;
  }

const newtask = {
  id: Date.now(),
  description: description,
  status: "pending",
  dueDate: dueDate
};

  tasks.push(newtask);
  saveTask();
  taskinput.value = "";
  dueDateInput.value = "";
  renderTasks();
  showMessage("Task added successfully");
}

// Delete task
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTask();
  renderTasks();
  showMessage("Task deleted successfully");
}

// Change status
function setStatus(id, newStatus) {
  tasks = tasks.map(task => {
    if (task.id === id) {
      task.status = newStatus;
    }
    return task;
  });
  saveTask();
  renderTasks();
  showMessage(`Task marked as ${newStatus}`);
}

// Save edit
function editTask(id) {
  const taskItem = tasks.find(t => t.id === id);
  const newText = prompt("Edit Task:", taskItem.description);
  let newDate = prompt("Edit Date (YYYY-MM-DD):", taskItem.dueDate || "");

  // VALIDATE DATE FORMAT
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (newDate && !datePattern.test(newDate)) {
    alert("❌ Invalid date format! Use YYYY-MM-DD");
    return;
  }
  if (newText !== null && newText.trim() !== "") {
    taskItem.description = newText;
    taskItem.dueDate = newDate || "";
    saveTask();
    renderTasks();
  }
}
// Save tasks to localStorage
function saveTask() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Filter buttons
filterbuttons.forEach(btn => {
  btn.addEventListener("click", () => {
    filter = btn.id;
    renderTasks();
  });
});

// Add task button
addtaskbtn.addEventListener("click", addTask);

// Enter key to add task eventob
taskinput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});
// Render tasks on page load
window.onload = renderTasks;
