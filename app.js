let todos = [];

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskDate = document.getElementById('taskDate');
    
    if (taskInput.value.trim() === '') {
        alert('Please enter a valid task!');
        return;
    }

    const todo = {
        id: Date.now(),
        text: taskInput.value,
        date: taskDate.value || new Date().toISOString().split('T')[0],
        completed: false
    };

    todos.push(todo);
    renderTodos();
    taskInput.value = '';
    taskDate.value = '';
}

function renderTodos() {
    const todoBody = document.getElementById('todoBody');
    todoBody.innerHTML = '';

    todos.forEach(todo => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>
                <span class="status ${todo.completed ? 'completed' : 'pending'}">
                    ${todo.completed ? 'Completed' : 'Pending'}
                </span>
            </td>
            <td>${todo.text}</td>
            <td>${new Date(todo.date).toLocaleDateString()}</td>
            <td>
                <button class="action-button edit-btn" onclick="editTask(${todo.id})">Edit</button>
                <button class="action-button complete-btn" onclick="toggleComplete(${todo.id})">
                    ${todo.completed ? 'Undo' : 'Complete'}
                </button>
                <button class="action-button delete-btn" onclick="deleteTask(${todo.id})">Delete</button>
            </td>
        `;

        if (todo.completed) {
            row.style.opacity = '0.8';
            row.querySelector('td:nth-child(2)').style.textDecoration = 'line-through';
        }

        todoBody.appendChild(row);
    });
}

// Add this new delete function
function deleteTask(id) {
    todos = todos.filter(todo => todo.id !== id);
    renderTodos();
}

// Rest of the existing functions remain the same
function toggleComplete(id) {
    todos = todos.map(todo => 
        todo.id === id ? {...todo, completed: !todo.completed} : todo
    );
    renderTodos();
}

function editTask(id) {
    const todo = todos.find(todo => todo.id === id);
    const newText = prompt('Edit task:', todo.text);
    const newDate = prompt('Edit date (YYYY-MM-DD):', todo.date);
    
    if (newText !== null) todo.text = newText;
    if (newDate !== null) todo.date = newDate;
    
    renderTodos();
}

// Initial render
renderTodos();