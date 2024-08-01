"use strict";
function toggleMode() {
    const body = document.body;
    const isDarkMode = body.classList.toggle("dark-theme");
    const newMode = isDarkMode ? "dark" : "light";
    const icon = document.querySelector(".top button i");
    if (icon) {
        icon.className = isDarkMode ? "fa-solid fa-sun" : "fa-solid fa-moon";
    }
    const header = document.querySelector("header");
    if (header) {
        header.style.background = `url(./images/top-${newMode}.svg)`;
    }
    // Update main background and text colors
    const main = document.querySelector("main");
    if (main) {
        main.style.backgroundColor = isDarkMode ? "#171823" : "#fafafa";
    }
    localStorage.setItem("theme", newMode);
}
function getMode() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-theme");
        const icon = document.querySelector(".top button i");
        if (icon) {
            icon.className = "fa-regular fa-sun";
        }
        // Apply dark theme styles
        const header = document.querySelector("header");
        const main = document.querySelector("main");
        if (header)
            header.style.background = "url(./images/top-dark.svg)";
        if (main)
            main.style.backgroundColor = "#171823";
    }
}
document.addEventListener("DOMContentLoaded", () => {
    getMode();
    const themeToggleBtn = document.querySelector(".top button");
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", toggleMode);
    }
});
// State
let todos = [];
let currentFilter = "all";
let nextId = 1;
// DOM Elements
const todoInput = document.querySelector(".middle input");
const todoList = document.querySelector("ul");
const tabContainer = document.querySelector(".tab");
const clearCompletedBtn = document.querySelector(".clear");
const itemsLeftElement = document.querySelector(".items");
// Functions
function addTodo(text) {
    todos.push({ id: nextId++, text, completed: false });
    renderTodos();
}
function toggleTodo(id) {
    const todo = todos.find((todo) => todo.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        renderTodos();
    }
}
function setFilter(filter) {
    currentFilter = filter;
    renderTodos();
}
function clearCompleted() {
    todos = todos.filter((todo) => !todo.completed);
    renderTodos();
}
function getFilteredTodos() {
    return todos.filter((todo) => {
        if (currentFilter === "active")
            return !todo.completed;
        if (currentFilter === "completed")
            return todo.completed;
        return true;
    });
}
function createTodoElement(todo) {
    var _a;
    const li = document.createElement("li");
    li.innerHTML = `
      <label class="checkbox">
        <input type="checkbox" ${todo.completed ? "checked" : ""} class="checkbox__input">
        <span class="checkbox__inner"></span>
      </label>
      <span class="${todo.completed ? "completed" : ""}">${todo.text}</span>
    `;
    (_a = li.querySelector("input")) === null || _a === void 0 ? void 0 : _a.addEventListener("change", () => toggleTodo(todo.id));
    return li;
}
function updateItemsLeft() {
    const activeCount = todos.filter((todo) => !todo.completed).length;
    itemsLeftElement.textContent = `${activeCount} item${activeCount !== 1 ? "s" : ""} left`;
}
function updateActiveTabs() {
    const tabs = tabContainer.querySelectorAll("p");
    tabs.forEach((tab) => {
        var _a;
        tab.classList.toggle("active", ((_a = tab.textContent) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === currentFilter);
    });
}
function renderTodos() {
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
    var _a;
    const target = event.target;
    if (target.tagName === "P") {
        setFilter((_a = target.textContent) === null || _a === void 0 ? void 0 : _a.toLowerCase());
    }
});
clearCompletedBtn.addEventListener("click", clearCompleted);
// Initial render
renderTodos();
