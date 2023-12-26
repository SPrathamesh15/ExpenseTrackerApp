var form = document.getElementById('addForm');
var itemList = document.getElementById('items');
var buyPremium = document.getElementById('buy-premium')
var table = document.getElementById('points-table')
var showLeaderboard = document.getElementById('show-leaderboard')
var leaderboardTag = document.getElementById('leaderboard-tag')

var premiumStatusElement = document.getElementById('premium-status');
// Adding a single event listener to handle form submission
form.addEventListener('submit', handleFormSubmission);
buyPremium.addEventListener('click', BuyPremium);
showLeaderboard.addEventListener('click', ShowLeaderboard)

async function ShowLeaderboard(e){
    const token = localStorage.getItem('token');
    axios.get('http://localhost:3000/premium/leaderboard', { headers: {'Authorization' : token }})
    .then(response => {
        console.log('leaderboard',response)
        showLeaderboardOnScreen(response.data.allLeaderBoardUsers)
    }).catch(err=> console.log(err))
}
function showLeaderboardOnScreen(expenses) {
    const parentNode = document.getElementById('points-table');
    parentNode.innerHTML = '';
    for (var i = 0; i < expenses.length; i++) {
        console.log('showing the user details on page: ', expenses[i]);
        const li = document.createElement('li');
        li.className = 'lists';
        li.id = expenses[i].userId; // Assuming userId is the identifier for the user

        const userNameElement = document.createElement('span');
        userNameElement.className = 'userName';
        userNameElement.innerHTML = `<strong>User Name: </strong>${expenses[i].username}  <strong>-</strong> `;

        const totalExpenseAmountElement = document.createElement('span');
        totalExpenseAmountElement.className = 'totalExpenseAmount';
        totalExpenseAmountElement.innerHTML = `<strong>Total Expense Amount: </strong>₹${expenses[i].totalAmount}`;

        // Appending elements to the li
        li.appendChild(userNameElement);
        li.appendChild(totalExpenseAmountElement);

        parentNode.appendChild(li);
    }
}

async function BuyPremium(e){
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:3000/purchase/premiummembership', { headers: {'Authorization' : token }})
    console.log(response)
    var options = {
        "key": response.data.key_id,
        "order_id": response.data.order.id,
        
        //this handler will handle the success payment
        "handler": async function (response) {
            console.log('Razorpay response:', response); 
            await axios.post('http://localhost:3000/purchase/updatetransactionstatus', {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id
            }, { headers: { 'Authorization': token } })
            alert('Congratulations! You are a Premium User Now.');
        }
    }
    const rzp1 = new Razorpay(options)
    rzp1.open()
    e.preventDefault()
    rzp1.on('payment.failed', function(response){
        console.log(response)
        alert('Something Went Wrong!')
    })
}
// delete event
itemList.addEventListener('click', removeItem);

function removeItem(e) {
    if (e.target.classList.contains('delete-btn')) {
        if (confirm('Are You Sure? You want to delete this item?')) {
            var li = e.target.parentElement;
            itemList.removeChild(li);
        }
    }
}

function handleFormSubmission(e) {
    e.preventDefault();
    // Get expense details from the form
    var expenseAmt = document.getElementById('expenseamt').value;
    var expenseDescription = document.getElementById('description').value;
    var categoryValue = document.getElementById('category').value;

    var li = document.createElement('li');
    li.className = 'list-group-item';


    var bigSpace = ' - ';

    var expenseAmts = 'Exepense Amount: ' + expenseAmt;
    var expenseDescriptions = 'Exepense Description: ' + expenseDescription;
    var categoryValues = 'Exepense Category: ' + categoryValue;

    li.appendChild(document.createTextNode(expenseAmts));
    li.appendChild(document.createTextNode(bigSpace));
    li.appendChild(document.createTextNode(expenseDescriptions));
    li.appendChild(document.createTextNode(bigSpace));
    li.appendChild(document.createTextNode(categoryValues));

    var deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.appendChild(document.createTextNode('Delete Expense'));


    li.appendChild(deleteBtn);

    itemList.appendChild(li);

    var expenseDetails = {
        expenseAmount: expenseAmt,
        expenseDescription: expenseDescription,
        category: categoryValue
    };
    console.log('ExpenseDetails:', expenseDetails);
    const token = localStorage.getItem('token')
    axios.post("http://localhost:3000/expense/add-expense", expenseDetails, {
        headers: {'Authorization' : token}})
        .then((response) => {
            console.log(response);
        })
        .catch((err) => {
            document.body.innerHTML = document.body.innerHTML +
                "<h3 style='color:red'> Something Went wrong!!!</h4>",
                console.log(err);
        });

    // Creating a new list item
    var li = document.createElement('li');
    li.className = 'list-group-item';
    // Clear the form fields
    document.getElementById('expenseamt').value = '';
    document.getElementById('description').value = '';
    document.getElementById('category').value = '';
    // localStorage.setItem(email, JSON.stringify(userDetails));
    console.log('Expense details added to Our server!!', expenseDetails);
}

document.addEventListener('DOMContentLoaded', handlePageLoad);
async function handlePageLoad() {
    // Making a GET request to retrieve data from the backend server
    const token = localStorage.getItem('token')
    axios.get("http://localhost:3000/expense/get-expenses", {
        headers: {'Authorization' : token}
    })
        .then((response) => {
            // Displaying the data on the screen and in the console
            showNewExpenseOnScreen(response.data.allExpenses);
            console.log('handlepageload data', response.data.allExpenses);
        })
        .catch((err) => {
            console.error('Error while fetching data:', err);
        });
    // for premium status
    try {
        const response = await axios.get("http://localhost:3000/purchase/premium-status", {
            headers: { 'Authorization': token }
        });
        const isPremiumUser = response.data.permuimStatus;
        console.log(isPremiumUser)
        if (isPremiumUser){
            premiumStatusElement.innerText = "You are a Premium User"
            buyPremium.style.display = 'none'
        } else{
            console.log('not a premium user')
            showLeaderboard.style.display = 'none'
            leaderboardTag.innerText = ''
        }
        
    } catch (err) {
        console.error('Error while fetching premium status:', err);
    }
}

function showNewExpenseOnScreen(expenses) {
    const parentNode = document.getElementById('items');
    parentNode.innerHTML = '';
    // console.log('showing expenses on the screen', expenses)
    for (var i = 0; i < expenses.length; i++) {
        console.log('showing the user details on page@: ', expenses[i])
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.id = expenses[i].id;

        // Creating elements with appropriate classes
        const expenseAmountElement = document.createElement('span');
        expenseAmountElement.className = 'expenseAmount';
        expenseAmountElement.innerHTML = `<strong>Expense Amount: </strong>₹${expenses[i].expenseAmount}  <strong>-</strong> `;

        const descriptionElement = document.createElement('span');
        descriptionElement.className = 'description';
        descriptionElement.innerHTML = `<strong>Expense Description: </strong>${expenses[i].expenseDescription}  <strong>-</strong> `;

        const categoryElement = document.createElement('span');
        categoryElement.className = 'category';
        categoryElement.innerHTML = `<strong>Expense Category: </strong>${expenses[i].category}`;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.appendChild(document.createTextNode('Delete Expense'));
        // Using a closure to capture the current value of userId
        deleteBtn.onclick = (function (expensesId) {
            return function () {
                deleteExpense(expensesId);
            };
        })(expenses[i].id);

        // Appending elements to the li
        li.appendChild(expenseAmountElement);
        li.appendChild(descriptionElement);
        li.appendChild(categoryElement);
        li.appendChild(deleteBtn);

        parentNode.appendChild(li);
    }
}

function deleteExpense(expenseId) {
    const token = localStorage.getItem('token')
    axios.delete(`http://localhost:3000/expense/delete-expense/${expenseId}`, {
        headers: {'Authorization' : token}
    })
        .then((response) => {
            removeExpenseFromScreen(expenseId);
        })
        .catch((err) => err);
}

function removeExpenseFromScreen(expenseId) {
    const parentNode = document.getElementById('items');
    const childNodeTobeDeleted = document.getElementById(expenseId);
    if (childNodeTobeDeleted) {
        parentNode.removeChild(childNodeTobeDeleted);
    }
}