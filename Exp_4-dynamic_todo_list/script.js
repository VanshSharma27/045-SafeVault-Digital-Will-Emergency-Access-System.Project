function addTask() {
    const input = document.getElementById("taskInput");
    const taskText = input.value.trim();

    if (taskText === "") {
        alert("Please enter a task");
        return;
    }

    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.onclick = () => toggleTask(li);

    const span = document.createElement("span");
    span.innerText = taskText;

    const btnDiv = document.createElement("div");
    btnDiv.className = "task-buttons";

    const editBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    editBtn.onclick = () => editTask(span);

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.onclick = () => deleteTask(li);

    btnDiv.appendChild(editBtn);
    btnDiv.appendChild(deleteBtn);

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(btnDiv);

    document.getElementById("taskList").appendChild(li);

    input.value = "";
}

function deleteTask(task) {
    task.remove();
}

function editTask(span) {
    const newText = prompt("Edit your task:", span.innerText);
    if (newText !== null && newText.trim() !== "") {
        span.innerText = newText;
    }
}

function toggleTask(task) {
    task.classList.toggle("completed");
}
