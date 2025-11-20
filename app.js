const form = document.getElementById("expense-form");
const categoryInput = document.getElementById("category");
const amountInput = document.getElementById("amount");
const expenseList = document.getElementById("expense-list");
const ctx = document.getElementById("expense-chart").getContext("2d");
// 1. New element reference for Total Expenses
const totalExpensesDisplay = document.getElementById("total-expenses"); 

let expenses = [];

const chart = new Chart(ctx, {
  type: 'pie',
  data: {
    labels: [],
    datasets: [{
      label: 'Expenses',
      data: [],
      // Updated color palette for a more professional look
      backgroundColor: ['#42a5f5', '#66bb6a', '#ffb74d', '#ef5350', '#ab47bc', '#ffee58', '#8d6e63', '#26a69a', '#ec407a', '#7e57c2', '#bdbdbd']
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
            font: {
                family: 'Poppins', // Match the new font
            }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              // Format tooltip label for currency display
              label += '₹' + context.parsed.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); 
            }
            return label;
          }
        }
      }
    }
  }
});

form.addEventListener("submit", e => {
  e.preventDefault();

  const category = categoryInput.value.trim();
  const amount = parseFloat(amountInput.value);

  // Validate for positive amount
  if (category && !isNaN(amount) && amount > 0) {
    expenses.unshift({ category, amount }); // UX: Add new items to the top (unshift)
    categoryInput.value = "";
    amountInput.value = "";

    updateExpenseList();
    updateChart();
    updateTotalExpenses(); // 3. Update total after adding expense
  } else {
    // Basic validation feedback
    alert("Please enter a valid category and a positive amount.");
  }
});

function updateExpenseList() {
  expenseList.innerHTML = "";
  expenses.forEach(exp => {
    const li = document.createElement("li");
    // 4. Using the new inner HTML structure for enhanced list styling
    li.innerHTML = `
      <span class="expense-category">${exp.category}</span>
      <span class="expense-amount">₹${exp.amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
    `;
    expenseList.appendChild(li);
  });
}

function updateChart() {
  const grouped = {};
  expenses.forEach(exp => {
    grouped[exp.category] = (grouped[exp.category] || 0) + exp.amount;
  });

  chart.data.labels = Object.keys(grouped);
  chart.data.datasets[0].data = Object.values(grouped);
  chart.update();
}

// 2. New function to calculate and display the total expenses
function updateTotalExpenses() {
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    // Format the total for currency display with commas and two decimal places
    totalExpensesDisplay.textContent = `₹${total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

// Initial calls to set up the display on load
updateChart(); 
updateTotalExpenses();