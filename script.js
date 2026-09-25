// =====================================
// GET HTML ELEMENTS
// =====================================

const expenseForm =
    document.querySelector("#expenseForm");

const descriptionInput =
    document.querySelector("#description");

const amountInput =
    document.querySelector("#amount");

const categoryInput =
    document.querySelector("#category");

const dateInput =
    document.querySelector("#date");

const expenseList =
    document.querySelector("#expenseList");

const totalExpense =
    document.querySelector("#totalExpense");

const transactionCount =
    document.querySelector("#transactionCount");

const highestExpense =
    document.querySelector("#highestExpense");

const averageExpense =
    document.querySelector("#averageExpense");

const searchInput =
    document.querySelector("#search");

const filterCategory =
    document.querySelector("#filterCategory");

const budgetInput =
    document.querySelector("#budgetInput");

const budgetBtn =
    document.querySelector("#budgetBtn");

const budgetAmount =
    document.querySelector("#budgetAmount");

const budgetSpent =
    document.querySelector("#budgetSpent");

const budgetRemaining =
    document.querySelector("#budgetRemaining");

const progressBar =
    document.querySelector("#progressBar");

const budgetMessage =
    document.querySelector("#budgetMessage");

const themeBtn =
    document.querySelector("#themeBtn");

const toast =
    document.querySelector("#toast");


// =====================================
// LOAD DATA
// =====================================

let expenses =
    JSON.parse(
        localStorage.getItem("expenses")
    ) || [];


let budget =
    Number(
        localStorage.getItem("budget")
    ) || 0;


// =====================================
// SAVE EXPENSES
// =====================================

function saveExpenses() {

    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );

}


// =====================================
// ADD EXPENSE
// =====================================

expenseForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const description =
            descriptionInput.value.trim();


        const amount =
            Number(amountInput.value);


        const category =
            categoryInput.value;


        const date =
            dateInput.value;


        if (
            description === "" ||
            amount <= 0 ||
            category === "" ||
            date === ""
        ) {

            showToast(
                "Please fill all fields!"
            );

            return;

        }


        const expense = {

            id: Date.now(),

            description: description,

            amount: amount,

            category: category,

            date: date

        };


        expenses.push(expense);


        saveExpenses();


        expenseForm.reset();


        displayExpenses();

        updateDashboard();

        updateBudget();


        showToast(
            "Expense added successfully! ✓"
        );

    }
);


// =====================================
// DISPLAY EXPENSES
// =====================================

function displayExpenses() {

    expenseList.innerHTML = "";


    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    const selectedCategory =
        filterCategory.value;


    const filteredExpenses =
        expenses.filter(
            function (expense) {


                const matchesSearch =
                    expense.description
                        .toLowerCase()
                        .includes(searchText);


                const matchesCategory =
                    selectedCategory === "All" ||
                    expense.category ===
                    selectedCategory;


                return (
                    matchesSearch &&
                    matchesCategory
                );

            }
        );


    if (filteredExpenses.length === 0) {

        expenseList.innerHTML = `

            <div class="empty-message">

                <h3>
                    📭 No expenses found
                </h3>

                <p>
                    Add an expense to get started.
                </p>

            </div>

        `;

        return;

    }


    filteredExpenses.forEach(
        function (expense) {


            const expenseItem =
                document.createElement(
                    "div"
                );


            expenseItem.classList.add(
                "expense-item"
            );


            expenseItem.innerHTML = `

                <div class="expense-info">

                    <h3>
                        ${expense.description}
                    </h3>

                    <p>
                        ${expense.category}
                        •
                        ${formatDate(expense.date)}
                    </p>

                </div>


                <div class="expense-right">

                    <span class="expense-amount">

                        ₹${expense.amount}

                    </span>


                    <button
                        class="edit-btn"
                        onclick="editExpense(${expense.id})">

                        Edit

                    </button>


                    <button
                        class="delete-btn"
                        onclick="deleteExpense(${expense.id})">

                        Delete

                    </button>

                </div>

            `;


            expenseList.appendChild(
                expenseItem
            );

        }
    );

}


// =====================================
// DELETE EXPENSE
// =====================================

function deleteExpense(id) {


    const confirmDelete =
        confirm(
            "Are you sure you want to delete this expense?"
        );


    if (!confirmDelete) {

        return;

    }


    expenses =
        expenses.filter(
            function (expense) {

                return expense.id !== id;

            }
        );


    saveExpenses();


    displayExpenses();

    updateDashboard();

    updateBudget();


    showToast(
        "Expense deleted successfully!"
    );

}


// =====================================
// EDIT EXPENSE
// =====================================

function editExpense(id) {


    const expense =
        expenses.find(
            function (expense) {

                return expense.id === id;

            }
        );


    if (!expense) {

        return;

    }


    descriptionInput.value =
        expense.description;


    amountInput.value =
        expense.amount;


    categoryInput.value =
        expense.category;


    dateInput.value =
        expense.date;


    expenses =
        expenses.filter(
            function (expense) {

                return expense.id !== id;

            }
        );


    saveExpenses();


    displayExpenses();

    updateDashboard();

    updateBudget();


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });


    showToast(
        "Edit the expense and add it again."
    );

}


// =====================================
// UPDATE DASHBOARD
// =====================================

function updateDashboard() {


    const total =
        expenses.reduce(
            function (sum, expense) {

                return sum + expense.amount;

            },

            0
        );


    totalExpense.textContent =
        `₹${total}`;


    transactionCount.textContent =
        expenses.length;


    if (expenses.length === 0) {

        highestExpense.textContent =
            "₹0";

        averageExpense.textContent =
            "₹0";

        return;

    }


    const highest =
        Math.max(
            ...expenses.map(
                function (expense) {

                    return expense.amount;

                }
            )
        );


    highestExpense.textContent =
        `₹${highest}`;


    const average =
        total / expenses.length;


    averageExpense.textContent =
        `₹${Math.round(average)}`;

}


// =====================================
// SET BUDGET
// =====================================

budgetBtn.addEventListener(
    "click",
    function () {


        const newBudget =
            Number(
                budgetInput.value
            );


        if (newBudget <= 0) {

            showToast(
                "Enter a valid budget!"
            );

            return;

        }


        budget = newBudget;


        localStorage.setItem(
            "budget",
            budget
        );


        budgetInput.value = "";


        updateBudget();


        showToast(
            "Budget updated successfully! ✓"
        );

    }
);


// =====================================
// UPDATE BUDGET
// =====================================

function updateBudget() {


    budgetAmount.textContent =
        `₹${budget}`;


    const spent =
        expenses.reduce(
            function (sum, expense) {

                return sum + expense.amount;

            },

            0
        );


    budgetSpent.textContent =
        `₹${spent}`;


    const remaining =
        budget - spent;


    if (remaining >= 0) {

        budgetRemaining.textContent =
            `₹${remaining}`;

    } else {

        budgetRemaining.textContent =
            `-₹${Math.abs(remaining)}`;

    }


    if (budget === 0) {

        progressBar.style.width = "0%";

        budgetMessage.textContent =
            "Set a budget to start tracking your spending.";

        return;

    }


    let percentage =
        (spent / budget) * 100;


    if (percentage > 100) {

        percentage = 100;

    }


    progressBar.style.width =
        `${percentage}%`;


    if (spent > budget) {

        budgetMessage.textContent =
            "⚠️ You have exceeded your budget!";

    }

    else if (spent === budget) {

        budgetMessage.textContent =
            "⚠️ You have reached your budget limit.";

    }

    else {

        budgetMessage.textContent =
            `You have used ${Math.round(
                (spent / budget) * 100
            )}% of your budget.`;

    }

}


// =====================================
// SEARCH
// =====================================

searchInput.addEventListener(
    "input",
    displayExpenses
);


// =====================================
// CATEGORY FILTER
// =====================================

filterCategory.addEventListener(
    "change",
    displayExpenses
);


// =====================================
// DARK MODE
// =====================================

themeBtn.addEventListener(
    "click",
    function () {


        document.body.classList.toggle(
            "dark"
        );


        const darkMode =
            document.body.classList.contains(
                "dark"
            );


        localStorage.setItem(
            "darkMode",
            darkMode
        );


        if (darkMode) {

            themeBtn.textContent = "☀️";

        } else {

            themeBtn.textContent = "🌙";

        }

    }
);


// =====================================
// LOAD DARK MODE
// =====================================

function loadTheme() {


    const darkMode =
        localStorage.getItem(
            "darkMode"
        );


    if (darkMode === "true") {

        document.body.classList.add(
            "dark"
        );

        themeBtn.textContent = "☀️";

    }

}


// =====================================
// TOAST NOTIFICATION
// =====================================

function showToast(message) {


    toast.textContent = message;


    toast.classList.add(
        "show"
    );


    setTimeout(
        function () {

            toast.classList.remove(
                "show"
            );

        },

        2500
    );

}


// =====================================
// FORMAT DATE
// =====================================

function formatDate(date) {

    const dateObject =
        new Date(date);


    return dateObject.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


// =====================================
// INITIAL LOAD
// =====================================

displayExpenses();

updateDashboard();

updateBudget();

loadTheme();