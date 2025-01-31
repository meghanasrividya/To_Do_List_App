// script.js

// ===== DOM ELEMENT SELECTIONS =====
// Get references to essential DOM elements
const taskInput = document.getElementById('taskInput');       // Input field for new tasks
const addTaskBtn = document.getElementById('addTaskBtn');     // "Add Task" button
const taskList = document.getElementById('taskList');         // Container for task items

// ===== DATA STORAGE =====
// Load tasks from localStorage or initialize empty array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];  // Persistent task storage

// ===== CORE FUNCTIONALITY =====

/**
 * Adds a new task to the list after validation
 */
function addTask() {
    // Trim whitespace from input value
    const taskText = taskInput.value.trim();
    
    // Validate input: check for empty or duplicate (case-insensitive)
    const isDuplicate = tasks.some(task => 
        task.toLowerCase() === taskText.toLowerCase()
    );
    
    // Show error message and exit if invalid
    if (!taskText) {
        alert("Please enter a task description.");
        return;
    }
    if (isDuplicate) {
        alert("This task already exists!");
        return;
    }

    // Add valid task to array
    tasks.push(taskText);
    
    // Update storage and UI
    updateLocalStorage();
    renderTasks();
    
    // Clear input field
    taskInput.value = '';
}

/**
 * Deletes a task from the list
 * @param {string} taskText - The exact text of the task to delete
 */
function deleteTask(taskText) {
    // Filter out the specified task
    tasks = tasks.filter(task => task !== taskText);
    
    // Update storage and UI
    updateLocalStorage();
    renderTasks();
}

/**
 * Edits an existing task with validation
 * @param {string} oldText - The original task text to edit
 */
function editTask(oldText) {
    // Prompt user with current value (trimmed)
    const newText = prompt("Edit task:", oldText)?.trim();
    
    // Exit if user cancels or enters same text
    if (!newText || newText === oldText) return;
    
    // Check for duplicates with new text
    const isDuplicate = tasks.some(task => 
        task.toLowerCase() === newText.toLowerCase()
    );
    
    if (isDuplicate) {
        alert("This task already exists!");
        return;
    }

    // Find and update task
    const taskIndex = tasks.indexOf(oldText);
    if (taskIndex > -1) {
        tasks[taskIndex] = newText;
        updateLocalStorage();
        renderTasks();
    }
}

// ===== HELPER FUNCTIONS =====

/**
 * Safely updates localStorage with current tasks
 */
function updateLocalStorage() {
    try {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
        console.error('LocalStorage error:', error);
        alert("Failed to save tasks. Your browser storage might be full or disabled.");
    }
}

/**
 * Renders all tasks to the UI
 */
function renderTasks() {
    // Clear existing tasks
    taskList.innerHTML = '';
    
    // Create elements for each task
    tasks.forEach(task => {
        // Create container div
        const taskElement = document.createElement('div');
        taskElement.className = 'task';
        
        // Create task text display
        const textElement = document.createElement('span');
        textElement.textContent = task;  // Safe text insertion
        
        // Create edit button with proper event handling
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => editTask(task));
        
        // Create delete button with proper event handling
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteTask(task));
        
        // Assemble elements
        taskElement.append(textElement, editButton, deleteButton);
        taskList.appendChild(taskElement);
    });
}

// ===== EVENT HANDLERS =====

// Add task button click handler
addTaskBtn.addEventListener('click', addTask);

// Enter key handler for input field
taskInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        addTask();
    }
});

// ===== INITIALIZATION =====

// Load and display tasks when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
});