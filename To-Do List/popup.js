// Get references to the UI elements
const todoList = document.getElementById("todo-list");
const newTaskInput = document.getElementById("new-task");
const addButton = document.getElementById("add-button");

// Load the saved tasks when the popup is opened
document.addEventListener("DOMContentLoaded", () => {
  // Retrieve the tasks from storage
  chrome.storage.sync.get(["tasks"], (result) => {
    if (result.tasks && result.tasks.length) {
      result.tasks.forEach((task) => {
        addTaskToUI(task.text);
      });
    }
  });
});

// Add event listener to the "Add" button
addButton.addEventListener("click", () => {
  const newTaskText = newTaskInput.value.trim();

  if (newTaskText !== "") {
    addTaskToUI(newTaskText);

    // Save the tasks to storage
    chrome.storage.sync.get(["tasks"], (result) => {
      const tasks = result.tasks || [];
      tasks.push({ text: newTaskText });
      chrome.storage.sync.set({ tasks });
    });

    // Clear the input field
    newTaskInput.value = "";
  }
});

// Add event listener to the input field for Enter key
newTaskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent the default behavior of the Enter key
    addButton.click(); // Simulate a click on the "Add" button
  }
});

// Handle click event for the delete buttons
todoList.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-button")) {
    const taskItem = event.target.parentElement;
    const taskText = taskItem.textContent;

    // Remove the task from UI
    taskItem.remove();

    // Remove the task from storage
    deleteTask(taskText);
  }
});

function addTaskToUI(taskText) {
  const taskItem = document.createElement("li");
  taskItem.textContent = taskText;

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Done";
  deleteButton.classList.add("delete-button");

  taskItem.appendChild(deleteButton);
  todoList.appendChild(taskItem);
}

function deleteTask(taskText) {
  // Remove the task from storage
  chrome.storage.sync.get(["tasks"], (result) => {
    const tasks = result.tasks.filter((task) => task.text !== taskText);
    chrome.storage.sync.set({ tasks });
  });
}
