// Darkmode
type Mode = "light" | "dark";

function toggleMode(): void {
  const body = document.body;
  const isDarkMode = body.classList.toggle("dark-theme");
  const newMode: Mode = isDarkMode ? "dark" : "light";

  const icon = document.querySelector(".top button i") as HTMLElement;
  if (icon) {
    icon.className = isDarkMode ? "fa-solid fa-sun" : "fa-solid fa-moon";
  }

  const header = document.querySelector("header") as HTMLElement;
  if (header) {
    header.style.background = `url(./images/top-${newMode}.svg)`;
  }

  // Update main background and text colors
  const main = document.querySelector("main") as HTMLElement;
  if (main) {
    main.style.backgroundColor = isDarkMode ? "#171823" : "#fafafa";
  }

  localStorage.setItem("theme", newMode);
}

function getMode(): void {
  const savedTheme = localStorage.getItem("theme") as Mode | null;
  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
    const icon = document.querySelector(".top button i") as HTMLElement;
    if (icon) {
      icon.className = "fa-regular fa-sun";
    }
    // Apply dark theme styles
    const header = document.querySelector("header") as HTMLElement;
    const main = document.querySelector("main") as HTMLElement;
    if (header) header.style.background = "url(./images/top-dark.svg)";
    if (main) main.style.backgroundColor = "#171823";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  getMode();
  const themeToggleBtn = document.querySelector(".top button");
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", toggleMode);
  }
});

// TODO
type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

type FilterType = "all" | "active" | "completed";

// State
let todos: Todo[] = [];
let currentFilter: FilterType = "all";
let nextId = 1;

// DOM Elements
const todoInput = document.querySelector(".middle input") as HTMLInputElement;
const todoList = document.querySelector("ul") as HTMLUListElement;
const tabContainer = document.querySelector(".tab") as HTMLElement;
const clearCompletedBtn = document.querySelector(".clear") as HTMLElement;
const itemsLeftElement = document.querySelector(".items") as HTMLElement;

// Functions
function addTodo(text: string): void {
  todos.push({ id: nextId++, text, completed: false });
  renderTodos();
}

function toggleTodo(id: number): void {
  const todo = todos.find((todo) => todo.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    renderTodos();
  }
}

function setFilter(filter: FilterType): void {
  currentFilter = filter;
  renderTodos();
}

function clearCompleted(): void {
  todos = todos.filter((todo) => !todo.completed);
  renderTodos();
}

function getFilteredTodos(): Todo[] {
  return todos.filter((todo) => {
    if (currentFilter === "active") return !todo.completed;
    if (currentFilter === "completed") return todo.completed;
    return true;
  });
}

function createTodoElement(todo: Todo): HTMLLIElement {
  const li = document.createElement("li");
  li.innerHTML = `
      <label class="checkbox">
        <input type="checkbox" ${
          todo.completed ? "checked" : ""
        } class="checkbox__input">
        <span class="checkbox__inner"></span>
      </label>
      <span class="${todo.completed ? "completed" : ""}">${todo.text}</span>
    `;
  li.querySelector("input")?.addEventListener("change", () =>
    toggleTodo(todo.id),
  );
  return li;
}

function updateItemsLeft(): void {
  const activeCount = todos.filter((todo) => !todo.completed).length;
  itemsLeftElement.textContent = `${activeCount} item${
    activeCount !== 1 ? "s" : ""
  } left`;
}

function updateActiveTabs(): void {
  const tabs = tabContainer.querySelectorAll("p");
  tabs.forEach((tab) => {
    tab.classList.toggle(
      "active",
      tab.textContent?.toLowerCase() === currentFilter,
    );
  });
}

function renderTodos(): void {
  todoList.innerHTML = "";
  const filteredTodos = getFilteredTodos();
  filteredTodos.forEach((todo) => {
    todoList.appendChild(createTodoElement(todo));
  });
  updateItemsLeft();
  updateActiveTabs();
}

// Event Listeners
todoInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter" && todoInput.value.trim()) {
    addTodo(todoInput.value.trim());
    todoInput.value = "";
  }
});

tabContainer.addEventListener("click", (event) => {
  const target = event.target as HTMLElement;
  if (target.tagName === "P") {
    setFilter(target.textContent?.toLowerCase() as FilterType);
  }
});

clearCompletedBtn.addEventListener("click", clearCompleted);

// Initial render
renderTodos();
