// DOM Elements - These are references to HTML elements we'll be working with
const taskInput = document.getElementById('taskInput'); // The input field for task description
const taskDate = document.getElementById('taskDate');   // The input field for due date
const addTaskBtn = document.getElementById('addTaskBtn'); // The "Add Task" button
const todoBody = document.getElementById('todoBody');   // The table body where tasks will be displayed

// Initialize tasks array - Load saved tasks from browser's storage or start empty
// localStorage is like a small database in the browser that persists between page refreshes
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Add Task Function - Creates a new task and adds it to our list
function addTask() {
    // Get and clean input values
    const taskText = taskInput.value.trim(); // trim() removes whitespace from both ends
    const dueDate = taskDate.value;

    // Validation - Check if inputs are filled
    if (!taskText) {
        alert('Please enter a task description');
        return; // Exit function early if no task text
    }
    if (!dueDate) {
        alert('Please select a due date');
        return; // Exit function early if no date
    }

    // Check if task already exists (case insensitive comparison)
    if (tasks.some(task => task.text.toLowerCase() === taskText.toLowerCase())) {
        alert('Task already exists!');
        return;
    }

    // Create new task object with unique ID (using current timestamp)
    const newTask = {
        id: Date.now(), // Unique identifier using current time
        text: taskText, // Task description
        date: dueDate,  // Due date from input
        completed: false // Initial completion status
    };

    // Add new task to our tasks array
    tasks.push(newTask);
    updateLocalStorage(); // Save to browser storage
    renderTasks(); // Update the displayed task list
    
    // Clear input fields after adding
    taskInput.value = '';
    taskDate.value = '';
}

// Delete Task Function - Removes a task by its ID
function deleteTask(taskId) {
    // Filter out the task with matching ID (keep all others)
    tasks = tasks.filter(task => task.id !== taskId);
    updateLocalStorage();
    renderTasks(); // Refresh the display
}

// Toggle Task Status - Switch between complete/incomplete
function toggleStatus(taskId) {
    // Update tasks array - create new array with updated task
    tasks = tasks.map(task => {
        if (task.id === taskId) {
            // Create copy of task with flipped completed status
            return { ...task, completed: !task.completed };
        }
        return task; // Return unchanged tasks
    });
    updateLocalStorage();
    renderTasks();
}

// Edit Task Function - Update task text through a prompt
function editTask(taskId) {
    // Find the task to edit
    const task = tasks.find(t => t.id === taskId);
    // Show prompt with current text as default value
    const newText = prompt('Edit your task:', task.text);
    
    // Only update if user entered something and didn't cancel
    if (newText && newText.trim()) {
        task.text = newText.trim(); // Update task text
        updateLocalStorage();
        renderTasks();
    }
}

// Render Tasks - Display all tasks in the table
function renderTasks() {
    // Clear current table content
    todoBody.innerHTML = '';

    // Show empty state if no tasks
    if (tasks.length === 0) {
        todoBody.innerHTML = `
            <tr class="empty-state">
                <td colspan="4">No tasks found. Start adding tasks!</td>
            </tr>
        `;
        return; // Exit function early
    }

    // Create and add HTML row for each task
    tasks.forEach(task => {
        const row = document.createElement('tr'); // Create table row
        
        // Add HTML content for the task row
        row.innerHTML = `
            <td>
                <!-- Checkbox to toggle completion status -->
                <input type="checkbox" 
                       class="status-checkbox" 
                       ${task.completed ? 'checked' : ''} 
                       onchange="toggleStatus(${task.id})">
            </td>
            <!-- Task text with strikethrough if completed -->
            <td class="${task.completed ? 'completed' : ''}">${task.text}</td>
            <!-- Formatted due date -->
            <td>${formatDate(task.date)}</td>
            <!-- Action buttons -->
            <td>
                <button class="action-btn edit-btn" onclick="editTask(${task.id})">✏️ Edit</button>
                <button class="action-btn delete-btn" onclick="deleteTask(${task.id})">🗑️ Delete</button>
            </td>
        `;
        
        // Add the row to the table body
        todoBody.appendChild(row);
    });
}

// Helper Functions -------------------------------------------------

// Format Date - Convert date string to readable format
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
    // Example output: "September 15, 2023"
}

// Update Local Storage - Save tasks to browser storage
function updateLocalStorage() {
    // Convert tasks array to JSON string and store it
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Event Listeners --------------------------------------------------

// Add Task button click handler
addTaskBtn.addEventListener('click', addTask);

// Enter key support in task input field
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask(); // Trigger addTask on Enter key
});

// Initial Render - Show tasks when page loads
document.addEventListener('DOMContentLoaded', renderTasks);