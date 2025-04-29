const expenseForm = document.getElementById('expenseForm');
const expenseList = document.getElementById('expenseList');
const totalExpense = document.getElementById('totalExpense');

let expenses = [];

expenseForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const description = document.getElementById('description').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('date').value;

    if (description === '' || isNaN(amount) || amount <= 0 || date === '') {
        alert('Please fill all fields correctly.');
        return;
    }

    const expense = {
        id: Date.now(),
        description,
        amount,
        date
    };

    expenses.push(expense);
    displayExpenses();
    expenseForm.reset();
});

function displayExpenses() {
    expenseList.innerHTML = '';

    let total = 0;

    expenses.forEach(exp => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="expense-info">
                <strong>${exp.description}</strong><br>
                $${exp.amount.toFixed(2)} - ${exp.date}
            </div>
            <button class="delete-btn" onclick="deleteExpense(${exp.id})">Delete</button>
        `;

        expenseList.appendChild(li);
        total += exp.amount;
    });

    totalExpense.textContent = `Total: $${total.toFixed(2)}`;
}

function deleteExpense(id) {
    expenses = expenses.filter(exp => exp.id !== id);
    displayExpenses();
}
