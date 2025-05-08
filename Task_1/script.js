document.addEventListener("DOMContentLoaded", () => {
  const tasksInput = document.querySelector("#input-tasks");
  const addBtn = document.querySelector("#add-btn");
  const tasksList = document.querySelector("#tasks-list");
  const emptyImg = document.querySelector(".empty-img");
  const toDoContainer = document.querySelector(".todo-container");
  const progressBar = document.querySelector("#progress");
  const progessNumber = document.querySelector("#numbers");

  const toggleEmptyState = () => {
    emptyImg.style.display = tasksList.children.length === 0 ? "block" : "none";
    toDoContainer.style.width = tasksList.children.length > 0 ? "100%" : "50%";
  };

  const updateProgress = (checkCompletion = true) => {
    const totalTask = tasksList.children.length;
    const completedTasks = tasksList.querySelectorAll(
      ".checkboxes:checked"
    ).length;

    progressBar.style.width = totalTask
      ? `${(completedTasks / totalTask) * 100}%`
      : "0%";
    progessNumber.textContent = `${completedTasks} / ${totalTask}`;

    if (checkCompletion && totalTask > 0 && completedTasks === totalTask) {
      Confetti();
    }
  };

  // Save to Local Storage

  const saveTasksToLocalStorage = () => {
    const allTasks = Array.from(tasksList.querySelectorAll("li")).map((li) => ({
      text: li.querySelector("span").textContent,
      completed: li.querySelector(".checkboxes").checked,
    }));
    localStorage.setItem("allTasks", JSON.stringify(allTasks));
  };

  //Load Tasks
  const loadTasksFromLocalStorage = () => {
    const savedTasks = JSON.parse(localStorage.getItem("allTasks")) || [];
    savedTasks.forEach(({ text, completed }) =>
      addTasks(text, completed, false)
    );
    toggleEmptyState();
    updateProgress();
  };

  const addTasks = (text, completed = false, checkCompletion = true) => {
    const txt = text || tasksInput.value.trim();

    if (!txt) {
      return;
    }

    const li = document.createElement("li");
    li.innerHTML = `
    <input type="checkbox" class="checkboxes" ${completed ? "checked" : ""}/>
    <span>${txt}</span>
    <div class="task-btns">
       <button class="edit-btn"><i class="fa-solid fa-pen-to-square"></i></button>
       <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
    </div>
    `;

    const checkbox = li.querySelector(".checkboxes");
    const editBtn = li.querySelector(".edit-btn");

    if (completed) {
      li.classList.add("completed");
      editBtn.disabled = true;
      editBtn.style.opacity = "0.5";
      editBtn.style.pointerEvents = "none";
    }

    checkbox.addEventListener("change", () => {
      const isChecked = checkbox.checked;
      li.classList.toggle("completed", isChecked);
      editBtn.disabled = isChecked;
      editBtn.style.opacity = isChecked ? "0.5" : "1";
      editBtn.style.pointerEvents = isChecked ? "none" : "auto";
      updateProgress();
      saveTasksToLocalStorage();
    });

    editBtn.addEventListener("click", () => {
      if (!checkbox.checked) {
        tasksInput.value = li.querySelector("span").textContent;
        li.remove();
        toggleEmptyState();
        updateProgress(false);
        saveTasksToLocalStorage();
      }
    });

    li.querySelector(".delete-btn").addEventListener("click", () => {
      li.remove();
      toggleEmptyState();
      updateProgress();
      saveTasksToLocalStorage();
    });

    tasksList.appendChild(li);
    tasksInput.value = "";
    toggleEmptyState();
    updateProgress(checkCompletion);
    saveTasksToLocalStorage();
  };

  addBtn.addEventListener("click", () => addTasks());
  tasksInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTasks();
    }
  });

  loadTasksFromLocalStorage();
});

function Confetti() {
  const duration = 15 * 1000,
    animationEnd = Date.now() + duration,
    defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    // since particles fall down, start a bit higher than random
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
    );
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    );
  }, 250);
}
