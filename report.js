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

let currentTimePeriod = localStorage.getItem('currentPage');

function getTimePeriod() {
    return currentTimePeriod;
}

dailyBtn.addEventListener('click', () => {
    localStorage.setItem('currentPage', 'daily')
    currentTimePeriod = localStorage.getItem('currentPage');
    showTable(currentTimePeriod, 1);
});

weeklyBtn.addEventListener('click', () => {
    localStorage.setItem('currentPage', 'weekly')
    currentTimePeriod = localStorage.getItem('currentPage');
    showTable(currentTimePeriod, 1);
});

monthlyBtn.addEventListener('click', () => {
    localStorage.setItem('currentPage', 'monthly')
    currentTimePeriod = localStorage.getItem('currentPage');
    showTable(currentTimePeriod, 1);
});

yearlyBtn.addEventListener('click', () => {
    localStorage.setItem('currentPage', 'yearly')
    currentTimePeriod = localStorage.getItem('currentPage');
    showTable(currentTimePeriod, 1);
});
function getCurrentPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const currentPage = parseInt(urlParams.get('page')) || 1;
    return currentPage;
}



async function handlePageLoad(e) {
    let itemsPerPage = localStorage.getItem('itemsPerPage');
    
    itemsPerPage = itemsPerPage && parseInt(itemsPerPage, 10) > 0 ? itemsPerPage : 10;

    console.log('Items per page loaded:', itemsPerPage);

    const itemsPerPageSelect = document.getElementById('itemsPerPage');
                for (let i = 0; i < itemsPerPageSelect.options.length; i++) {
                    if (itemsPerPageSelect.options[i].value === itemsPerPage.toString()) {
                        itemsPerPageSelect.options[i].selected = true;
                        break;
                    }
                }
    const currentPage = getCurrentPage();
    console.log('Current page:', currentPage);
    console.log(getTimePeriod(), currentPage, itemsPerPage)
    showTable(getTimePeriod(), currentPage, itemsPerPage);
}



function updateItemsPerPage() {
    const itemsPerPageSelect = document.getElementById('itemsPerPage');
    const itemsPerPage = itemsPerPageSelect.value;
    localStorage.setItem('itemsPerPage', itemsPerPage);

    console.log('Items per page updated to:', itemsPerPage);
    const timePeriod = getTimePeriod();
    const currentPage = getCurrentPage();
    showTable(timePeriod, currentPage, itemsPerPage);
}

async function showTable(timePeriod, page = 1, itemsPerPage = 10) {
    const token = localStorage.getItem('token');
    console.log('timePeriod: ', timePeriod)
    try {
        const response = await axios.get(`http://localhost:3000/report/get-report?timePeriod=${timePeriod}&page=${page}&itemsPerPage=${itemsPerPage}`, {
            headers: { 'Authorization': token },
        });

        showReportsOnScreen(response, timePeriod, itemsPerPage);
        showSections(timePeriod);
    } catch (err) {
        console.error('Error while fetching data:', err);
    }
}


function showReportsOnScreen(response, timePeriod, itemsPerPage) {
    const tableBody = document.getElementById(`${timePeriod}-table`).getElementsByTagName('tbody')[0];

    const expenses = response.data.allExpenses;
    const totalPages = response.data.totalPages;
    const currentPage = response.data.currentPage;

    tableBody.innerHTML = '';

    expenses.forEach(expense => {
        const row = document.createElement('tr');

        const rawDate = expense.Date.split('T')[0]; 
        const date = formatDate(rawDate);

        const description = expense.Description;
        const category = expense.category;
        const income = expense.income || 0;
        const expenseAmount = expense.expense || 0;

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
        button.className = 'pagination-btn'
        button.textContent = i;
        button.addEventListener('click', () => showTable(timePeriod, i, itemsPerPage));
        paginationContainer.appendChild(button);
    }

    // Highlight the current page button
    const currentPageButton = document.querySelector(`#pagination-container button:nth-child(${currentPage})`);
    currentPageButton.classList.add('active');
    currentPageButton.className = 'current-page-btn'
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


