
"use strict";

// Select the required HTML elements.
const menuToggle = document.getElementById("menu-toggle");
const navigation = document.getElementById("navigation");
const themeToggle = document.getElementById("theme-toggle");
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const taskSummary = document.getElementById("task-summary");
const taskMessage = document.getElementById("task-message");
const emptyState = document.getElementById("empty-state");
const contactForm = document.getElementById("contact-form");
const formFeedback = document.getElementById("form-feedback");

// Display the current year automatically.
document.getElementById("year").textContent =
  new Date().getFullYear();

// Mobile navigation toggle.
menuToggle.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.textContent = isOpen ? "✕" : "☰";
});

// Close mobile navigation after selecting a link.
navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navigation.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  });
});

// Dark mode toggle with saved preference.
function applyTheme(theme) {
  document.body.classList.toggle("dark", theme === "dark");
  themeToggle.textContent =
    theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";
}

let currentTheme = "light";

try {
  currentTheme = localStorage.getItem("taskflow-theme") || "light";
} catch (error) {
  console.warn("Theme preference storage is unavailable.");
}

applyTheme(currentTheme);

themeToggle.addEventListener("click", () => {
  currentTheme = document.body.classList.contains("dark")
    ? "light"
    : "dark";

  applyTheme(currentTheme);

  try {
    localStorage.setItem("taskflow-theme", currentTheme);
  } catch (error) {
    console.warn("Unable to save theme preference.");
  }
});

// Update task completion statistics.
function updateTaskSummary() {
  const tasks = taskList.querySelectorAll(".task-item");
  const completed = taskList.querySelectorAll(
    ".task-item input[type='checkbox']:checked"
  ).length;

  taskSummary.textContent =
    `${completed} of ${tasks.length} tasks completed`;

  emptyState.hidden = tasks.length > 0;
}

// Display a task message.
function showTaskMessage(message, type = "") {
  taskMessage.textContent = message;
  taskMessage.className = `message ${type}`;
}

// Create and add a task using DOM methods.
function addTask(taskText) {
  const item = document.createElement("li");
  item.className = "task-item";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.setAttribute("aria-label", `Complete ${taskText}`);

  const taskLabel = document.createElement("span");
  taskLabel.textContent = taskText;

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "delete-button";
  deleteButton.textContent = "Delete";
  deleteButton.setAttribute("aria-label", `Delete ${taskText}`);

  checkbox.addEventListener("change", () => {
    item.classList.toggle("completed", checkbox.checked);
    updateTaskSummary();
  });

  deleteButton.addEventListener("click", () => {
    item.remove();
    updateTaskSummary();
    showTaskMessage("Task deleted.", "success");
  });

  item.append(checkbox, taskLabel, deleteButton);
  taskList.appendChild(item);
  updateTaskSummary();
}

// Add task form validation.
taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const taskText = taskInput.value.trim();

  if (!taskText) {
    showTaskMessage("Please enter a task.", "error");
    taskInput.focus();
    return;
  }

  addTask(taskText);
  taskForm.reset();
  taskInput.focus();
  showTaskMessage("Task added successfully!", "success");
});

// Validate and demonstrate contact form submission.
contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  formFeedback.className = "message error";

  if (!name || !email || !message) {
    formFeedback.textContent = "Please fill in all fields.";
    return;
  }

  if (!emailPattern.test(email)) {
    formFeedback.textContent =
      "Please enter a valid email address.";
    document.getElementById("email").focus();
    return;
  }

  formFeedback.className = "message success";
  formFeedback.textContent =
    `Thank you, ${name}! Your form passed validation.`;

  // Demo only: no data is sent to a server.
  contactForm.reset();
});

// Back-to-top button.
document.getElementById("back-to-top").addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

// Initialize the task list state.
updateTaskSummary();
