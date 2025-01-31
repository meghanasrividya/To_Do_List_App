// DOM Elements
const taskInput = document.getElementById('taskInput');
const taskDate = document.getElementById('taskDate');
const addTaskBtn = document.getElementById('addTaskBtn');
const todoBody = document.getElementById('todoBody');

// Initialize tasks from localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Add Task Function
function addTask() {
    const taskText = taskInput.value.trim();
    const dueDate = taskDate.value;

    // Validation
    if (!taskText) {
        alert('Please enter a task description');
        return;
    }
    if (!dueDate) {
        alert('Please select a due date');
        return;
    }

    if (tasks.some(task => task.text.toLowerCase() === taskText.toLowerCase())) {
        alert('Task already exists!');
        return;
    }

    // Create new task object
    const newTask = {
        id: Date.now(),
        text: taskText,
        date: dueDate,
        completed: false
    };

    tasks.push(newTask);
    updateLocalStorage();
    renderTasks();
    
    // Clear inputs
    taskInput.value = '';
    taskDate.value = '';
}

// Delete Task Function
function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    updateLocalStorage();
    renderTasks();
}

// Toggle Task Status
function toggleStatus(taskId) {
    tasks = tasks.map(task => {
        if (task.id === taskId) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    updateLocalStorage();
    renderTasks();
}

// Edit Task Function
function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    const newText = prompt('Edit your task:', task.text);
    
    if (newText && newText.trim()) {
        task.text = newText.trim();
        updateLocalStorage();
        renderTasks();
    }
}

// Render Tasks
function renderTasks() {
    todoBody.innerHTML = '';

    if (tasks.length === 0) {
        todoBody.innerHTML = `
            <tr class="empty-state">
                <td colspan="4">No tasks found. Start adding tasks!</td>
            </tr>
        `;
        return;
    }

    tasks.forEach(task => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <input type="checkbox" 
                       class="status-checkbox" 
                       ${task.completed ? 'checked' : ''} 
                       onchange="toggleStatus(${task.id})">
            </td>
            <td class="${task.completed ? 'completed' : ''}">${task.text}</td>
            <td>${formatDate(task.date)}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editTask(${task.id})">✏️ Edit</button>
                <button class="action-btn delete-btn" onclick="deleteTask(${task.id})">🗑️ Delete</button>
            </td>
        `;
        todoBody.appendChild(row);
    });
}

// Helper Functions
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function updateLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Event Listeners
addTaskBtn.addEventListener('click', addTask);

// Enter key support
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

// Initial render
document.addEventListener('DOMContentLoaded', renderTasks);