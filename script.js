// Load from localStorage
let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "all";

// DOM elements
const todoInput = document.querySelector("#todoInput");
const addBtn = document.querySelector("#addBtn");
const todoList = document.querySelector("#todoList");
const filterBtns = document.querySelectorAll(".filter-btn");
const stats = document.querySelector("#stats");
const clearCompletedBtn = document.querySelector("#clearCompleted");

// Save to localStorage
const saveTodos = () => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

// Render todos
const renderTodos = () => {
  todoList.innerHTML = "";

  let filteredTodos = todos;

  if (currentFilter === "active") {
    filteredTodos = todos.filter(t => !t.completed);
  }

  if (currentFilter === "completed") {
    filteredTodos = todos.filter(t => t.completed);
  }

  filteredTodos.forEach(todo => {
    const li = document.createElement("li");
    li.className = "list-group-item";
    if (todo.completed) li.classList.add("completed");

    const span = document.createElement("span");
    span.textContent = todo.text;

    // Edit on double click (bonus)
    span.addEventListener("dblclick", () => {
      span.contentEditable = true;
      span.focus();
    });

    span.addEventListener("blur", () => {
      span.contentEditable = false;
      todos = todos.map(t =>
        t.id === todo.id ? { ...t, text: span.textContent } : t
      );
      saveTodos();
    });

    const btnGroup = document.createElement("div");

    const doneBtn = document.createElement("button");
    doneBtn.textContent = "Done";
    doneBtn.className = "btn btn-sm btn-success me-2";

    doneBtn.addEventListener("click", () => {
      todos = todos.map(t =>
        t.id === todo.id ? { ...t, completed: !t.completed } : t
      );
      saveTodos();
      renderTodos();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "btn btn-sm btn-danger";

    deleteBtn.addEventListener("click", () => {
      todos = todos.filter(t => t.id !== todo.id);
      saveTodos();
      renderTodos();
    });

    btnGroup.append(doneBtn, deleteBtn);
    li.append(span, btnGroup);
    todoList.appendChild(li);
  });

  // Stats (reduce)
  const completedCount = todos.reduce(
    (acc, t) => (t.completed ? acc + 1 : acc),
    0
  );
  stats.textContent = `${completedCount}/${todos.length} completed`;
};

// Add todo
const addTodo = () => {
  const text = todoInput.value.trim();
  if (!text) return;

  const newTodo = {
    id: Date.now(),
    text,
    completed: false
  };

  todos = [...todos, newTodo];
  saveTodos();
  renderTodos();
  todoInput.value = "";
};

// Events
addBtn.addEventListener("click", addTodo);

todoInput.addEventListener("keypress", e => {
  if (e.key === "Enter") addTodo();
});

// Filters
filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTodos();
  });
});

// Clear completed (bonus)
clearCompletedBtn.addEventListener("click", () => {
  todos = todos.filter(t => !t.completed);
  saveTodos();
  renderTodos();
});

// Initial render
renderTodos();