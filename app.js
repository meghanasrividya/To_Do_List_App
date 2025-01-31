// script.js

// ===== DOM ELEMENT SELECTIONS =====
// Get reference to the task input field
const taskInput = document.getElementById('taskInput');
// Get reference to the "Add Task" button
const addTaskBtn = document.getElementById('addTaskBtn');
// Get reference to the task list container
const taskList = document.getElementById('taskList');

// ===== DATA STORAGE =====
// Initialize empty array to store tasks
let tasks = [];

// ===== CORE FUNCTIONS =====

// Function to handle task addition
function addTask() {
    // Get input value and remove whitespace from both ends
    const taskText = taskInput.value.trim();

    // Validation: Check for empty input or duplicate tasks
    if (taskText === "" || tasks.includes(taskText)) {
        alert("Please enter a valid, non-duplicate task.");
        return; // Exit function if invalid
    }

    // Add valid task to the array
    tasks.push(taskText);
    // Update UI with new task list
    renderTasks();
    // Clear input field after submission
    taskInput.value = '';
}

// Function to handle task deletion
function deleteTask(taskText) {
    // Filter out the task to be deleted
    tasks = tasks.filter(task => task !== taskText);
    // Update UI with modified task list
    renderTasks();
}

// Function to handle task editing
function editTask(taskText) {
    // Show prompt with current task text pre-filled
    const editedText = prompt("Edit your task:", taskText);

    // Validate edited text:
    // - Must not be empty after trimming
    // - Must be different from original
    if (editedText && editedText.trim() !== "" && editedText !== taskText) {
        // Find index of original task
        const taskIndex = tasks.indexOf(taskText);
        // Update task in array with trimmed version
        tasks[taskIndex] = editedText.trim();
        // Refresh task display
        renderTasks();
    }
}

// ===== UI RENDERING =====
function renderTasks() {
    // Clear current task list display
    taskList.innerHTML = '';

    // Create HTML elements for each task
    tasks.forEach(task => {
        // Create container div for task
        const taskElement = document.createElement('div');
        taskElement.classList.add('task'); // Add CSS class

        // Create span element for task text display
        const taskTextElement = document.createElement('span');
        taskTextElement.textContent = task;

        // Create edit button
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        // Add click handler with closure to preserve current task value
        editBtn.onclick = () => editTask(task);

        // Create delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        // Add click handler with closure to preserve current task value
        deleteBtn.onclick = () => deleteTask(task);

        // Assemble task element components
        taskElement.appendChild(taskTextElement);
        taskElement.appendChild(editBtn);
        taskElement.appendChild(deleteBtn);

        // Add complete task element to task list
        taskList.appendChild(taskElement);
    });
}

// ===== EVENT HANDLERS =====

// Add click event listener to Add Task button
addTaskBtn.addEventListener('click', addTask);

// Add keyboard event listener for Enter key submission
taskInput.addEventListener('keypress', function(event) {
    // Check if pressed key is Enter (key code 13)
    if (event.key === 'Enter') {
        addTask(); // Trigger add task function
    }
});