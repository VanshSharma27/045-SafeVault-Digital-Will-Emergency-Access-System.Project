const API_URL = 'http://localhost:3000/tasks';
let tasks = [];
let currentFilter = 'all';
let currentEditId = null;

window.onload = () => {
    fetchTasks();
    lucide.createIcons();
};

async function fetchTasks() {
    const res = await fetch(API_URL);
    tasks = await res.json();
    renderTasks();
}

async function handleAddTask() {
    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDesc').value.trim();
    const priority = document.getElementById('priority').value;

    if (!title) return alert("Task title required!");

    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, priority })
    });

    document.getElementById('taskTitle').value = '';
    document.getElementById('taskDesc').value = '';
    fetchTasks();
}

async function toggleStatus(id, current) {
    await fetch(`${API_URL}/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDone: current === 0 ? 1 : 0 })
    });
    fetchTasks();
}

async function deleteTask(id) {
    if (confirm("Permanently delete this?")) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchTasks();
    }
}

// EDIT LOGIC
function openEditModal(id, title, desc, priority) {
    currentEditId = id;
    document.getElementById('editTitle').value = title;
    document.getElementById('editDesc').value = desc;
    document.getElementById('editPriority').value = priority;
    document.getElementById('editModal').style.display = 'flex';
}

function closeEditModal() { document.getElementById('editModal').style.display = 'none'; }

async function saveTaskEdit() {
    await fetch(`${API_URL}/${currentEditId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: document.getElementById('editTitle').value,
            description: document.getElementById('editDesc').value,
            priority: document.getElementById('editPriority').value
        })
    });
    closeEditModal();
    fetchTasks();
}

// EXPORT TO JSON (Bonus Feature)
function exportTasks() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "tasks_backup.json");
    downloadAnchor.click();
}

function renderTasks() {
    const list = document.getElementById('taskList');
    const query = document.getElementById('searchInput').value.toLowerCase();
    list.innerHTML = '';

    const filtered = tasks.filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(query);
        if (currentFilter === 'active') return t.isDone === 0 && matchesSearch;
        if (currentFilter === 'completed') return t.isDone === 1 && matchesSearch;
        return matchesSearch;
    });

    filtered.forEach(t => {
        const date = new Date(t.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
        const li = document.createElement('li');
        li.className = t.isDone ? 'done' : '';
        li.innerHTML = `
            <div class="task-main">
                <div class="check-btn" onclick="toggleStatus(${t.id}, ${t.isDone})">
                    ${t.isDone ? '<i data-lucide="check" style="width:14px"></i>' : ''}
                </div>
                <div class="task-info">
                    <strong>${t.title}</strong>
                    <p>${t.description || ''}</p>
                    <span class="timestamp"><i data-lucide="calendar" style="width:10px; display:inline"></i> ${date}</span>
                    <span class="badge ${t.priority}">${t.priority}</span>
                </div>
            </div>
            <div class="actions">
                <button onclick="openEditModal(${t.id}, '${t.title}', '${t.description}', '${t.priority}')"><i data-lucide="edit-3"></i></button>
                <button onclick="deleteTask(${t.id})" style="color:#ef4444"><i data-lucide="trash-2"></i></button>
            </div>
        `;
        list.appendChild(li);
    });

    lucide.createIcons();
    updateStats();
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.isDone).length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Update Circular Chart
    document.getElementById('circleFill').setAttribute('stroke-dasharray', `${percent}, 100`);
    document.getElementById('percentNum').innerText = `${percent}%`;
    document.getElementById('taskCounter').innerText = `${total} Total Tasks`;
}

function setFilter(f, btn) {
    currentFilter = f;
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('currentView').innerText = f === 'all' ? 'Task Overview' : f.charAt(0).toUpperCase() + f.slice(1);
    renderTasks();
}