document.addEventListener('DOMContentLoaded', function () {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');

    // Function to add a task
    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText) {
            const li = document.createElement('li');
            li.classList.add('task-item');
            li.innerHTML = `
                <span class="task-text">${taskText}</span>
                <div class="task-buttons">
                    <button class="complete-btn">Complete</button>
                    <button class="delete-btn">Delete</button>
                </div>
            `;
            taskList.appendChild(li);

            // Clear the input after adding the task
            taskInput.value = '';

            // Handle complete button click
            const completeBtn = li.querySelector('.complete-btn');
            completeBtn.addEventListener('click', function () {
                li.classList.toggle('completed'); // Toggle the "completed" class
                if (li.classList.contains('completed')) {
                    completeBtn.textContent = 'Undo'; // Change the button text to "Undo"
                } else {
                    completeBtn.textContent = 'Complete'; // Reset button text back to "Complete"
                }
            });

            // Handle delete button click
            const deleteBtn = li.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', function () {
                li.remove();
            });
        }
    }

    // Add event listener to the "Add Task" button
    addTaskBtn.addEventListener('click', addTask);

    // Add event listener to the input field for the Enter key
    taskInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            addTask(); // Add the task when Enter is pressed
        }
    });
});
