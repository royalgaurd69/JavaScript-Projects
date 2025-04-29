document.addEventListener('DOMContentLoaded', function() {
    const itemInput = document.getElementById('itemInput');
    const addButton = document.getElementById('addButton');
    const itemList = document.getElementById('itemList');
    const emptyMessage = document.getElementById('emptyMessage');

    function checkIfEmpty() {
        if (itemList.children.length === 0) {
            emptyMessage.style.display = 'bxlock';
        } else {
            emptyMessage.style.display = 'none';
        }
    }

    function rebuildItem(item, text) {
        item.className = '';
        item.innerHTML = '';

        const textSpan = document.createElement('span');
        textSpan.className = 'item-text';
        textSpan.textContent = text;

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'item-actions';

        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', function() {
            editItem(item, textSpan.textContent);
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', function() {
            item.remove();
            checkIfEmpty();
        });

        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(deleteBtn);

        item.appendChild(textSpan);
        item.appendChild(actionsDiv);

        checkIfEmpty();
    }

    function addItem() {
        const text = itemInput.value.trim();
        if (text !== '') {
            const li = document.createElement('li');
            rebuildItem(li, text);
            itemList.appendChild(li);
            itemInput.value = '';
            itemInput.focus();
        }
        checkIfEmpty();
    }

    function editItem(item, currentText) {
        item.innerHTML = '';
        item.className = 'edit-mode';

        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentText;

        const saveBtn = document.createElement('button');
        saveBtn.className = 'save-btn';
        saveBtn.textContent = 'Save';

        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'cancel-btn';
        cancelBtn.textContent = 'Cancel';

        saveBtn.addEventListener('click', function() {
            const newText = input.value.trim();
            if (newText !== '') {
                rebuildItem(item, newText);
            }
        });

        cancelBtn.addEventListener('click', function() {
            rebuildItem(item, currentText);
        });

        item.appendChild(input);
        const btnContainer = document.createElement('div');
        btnContainer.appendChild(saveBtn);
        btnContainer.appendChild(cancelBtn);
        item.appendChild(btnContainer);

        input.focus();
        input.select();

        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                saveBtn.click();
            }
        });
    }

    addButton.addEventListener('click', addItem);

    itemInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addItem();
        }
    });

    checkIfEmpty();
});
