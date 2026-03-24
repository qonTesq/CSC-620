const API = "http://localhost:3000/todos";
const $ = (s) => document.querySelector(s);

const todoList = $("#todo-list");
const form = $("#new-todo-form");
const input = $("#new-todo-input");

async function request(path = "", opts = {}) {
  // normalize JSON body if provided as object
  if (opts.body && typeof opts.body !== "string") {
    opts.body = JSON.stringify(opts.body);
    opts.headers = {
      ...(opts.headers || {}),
      "Content-Type": "application/json",
    };
  }

  const res = await fetch(`${API}${path}`, opts);
  if (!res.ok) {
    // try to include server message when available
    let serverMsg = "";
    try {
      const text = await res.text();
      if (text) serverMsg = ` - ${text}`;
    } catch (_) {}
    throw new Error(
      `${opts.method || "GET"} ${path} failed: ${res.status}${serverMsg}`,
    );
  }
  // attempt JSON parse; if no body, return null
  if (res.status === 204) return null;
  try {
    return await res.json();
  } catch (_) {
    return null;
  }
}

async function loadTodos() {
  try {
    const todos = await request();
    renderTodos(todos || []);
  } catch (err) {
    console.error(err);
    alert("Failed to load todos: " + err.message);
  }
}

function renderTodos(todos) {
  todoList.innerHTML = "";
  todos.forEach((todo) => renderTodo(todo));
}

function renderTodo(todo) {
  const li = document.createElement("li");

  const span = document.createElement("span");
  span.textContent = todo.task;
  if (todo.completed) span.classList.add("completed");

  const btn = document.createElement("button");
  btn.type = "button";
  btn.textContent = "Delete";
  btn.dataset.id = todo.id;
  btn.addEventListener("click", () => deleteTodo(todo.id, li, btn));

  li.append(span, btn);
  todoList.appendChild(li);
}

async function createTodo(task) {
  try {
    await request("", { method: "POST", body: { task, completed: false } });
    await loadTodos();
  } catch (err) {
    console.error(err);
    alert("Failed to create todo: " + err.message);
  }
}

async function deleteTodo(id, liElement, btn) {
  // disable button while waiting for server response
  btn.disabled = true;
  const origText = btn.textContent;
  btn.textContent = "Deleting...";

  try {
    await request(`/${encodeURIComponent(id)}`, { method: "DELETE" });
    // only remove from DOM after server confirms
    if (liElement.parentNode) liElement.parentNode.removeChild(liElement);
  } catch (err) {
    console.error(err);
    alert("Failed to delete todo: " + err.message);
    // restore button so the user can retry
    btn.disabled = false;
    btn.textContent = origText;
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const task = input.value.trim();
  if (!task) return;
  createTodo(task);
  input.value = "";
});

// initial load
loadTodos();
