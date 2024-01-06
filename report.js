var year = document.getElementById('year')
var month = document.getElementById('month');
var dailyBtn = document.getElementById('daily-btn');
var weeklyBtn = document.getElementById('weekly-btn');
var monthlyBtn = document.getElementById('monthly-btn');
var yearlyBtn = document.getElementById('yearly-btn');
document.addEventListener('DOMContentLoaded', handlePageLoad);

var dailySection = document.getElementById('daily-section');
var weeklySection = document.getElementById('weekly-section');
var monthlySection = document.getElementById('monthly-section');
var yearlySection = document.getElementById('yearly-section');

dailyBtn.addEventListener('click', () => showTable('daily', 1));
weeklyBtn.addEventListener('click', () => showTable('weekly', 1));
monthlyBtn.addEventListener('click', () => showTable('monthly', 1));
yearlyBtn.addEventListener('click', () => showTable('yearly', 1));


async function handlePageLoad(e) {
    const page = 1
    await showTable('daily', page);
}

async function showTable(timePeriod, page = 1) {
    const token = localStorage.getItem('token');
    console.log('timePeriod: ', timePeriod)
    try {
        const response = await axios.get(`http://localhost:3000/report/get-report?timePeriod=${timePeriod}&page=${page}`, {
            headers: { 'Authorization': token },
        });

        showReportsOnScreen(response, timePeriod);
        showSections(timePeriod);
    } catch (err) {
        console.error('Error while fetching data:', err);
    }
}

function showReportsOnScreen(response, timePeriod) {
    const tableBody = document.getElementById(`${timePeriod}-table`).getElementsByTagName('tbody')[0];

    const expenses = response.data.allExpenses;
    const totalPages = response.data.totalPages;
    const currentPage = response.data.currentPage;

    // Clearing existing rows from the table body
    tableBody.innerHTML = '';

    // Iterating over expenses and create table rows
    expenses.forEach(expense => {
        const row = document.createElement('tr');

        // Extracting relevant columns from the expense object
        const rawDate = expense.Date.split('T')[0]; 
        const date = formatDate(rawDate);

        const description = expense.Description;
        const category = expense.category;
        const income = expense.income || 0; // Assuming income can be null or undefined
        const expenseAmount = expense.expense || 0; // Assuming expense can be null or undefined

        // Adding cells to the row
        row.innerHTML = `
            <td>${date}</td>
            <td>${description}</td>
            <td>${category}</td>
            <td>${income}</td>
            <td>${expenseAmount}</td>
        `;

        // Appending the row to the table body
        tableBody.appendChild(row);
    });
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.addEventListener('click', () => showTable(timePeriod, i));
        paginationContainer.appendChild(button);
    }

    // Highlight the current page button
    const currentPageButton = document.querySelector(`#pagination-container button:nth-child(${currentPage})`);
    currentPageButton.classList.add('active');
}

function formatDate(rawDate) {
    const parts = rawDate.split('-');
    const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`; // day/month/year
    return formattedDate;
}



function showSections(timePeriod) {
    // Hiding all sections
    dailySection.style.display = 'none';
    weeklySection.style.display = 'none';
    monthlySection.style.display = 'none';
    yearlySection.style.display = 'none';

    // Showing the specific section based on the timePeriod
    if (timePeriod === 'daily') {
        dailySection.style.display = 'block';
    } else if (timePeriod === 'weekly') {
        weeklySection.style.display = 'block';
    } else if (timePeriod === 'monthly') {
        monthlySection.style.display = 'block';
    } else if (timePeriod === 'yearly') {
        yearlySection.style.display = 'block';
    }
}


