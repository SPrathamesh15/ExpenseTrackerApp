var addForm = document.getElementById('addform')
var errorMessageContainer = document.getElementById('error-message');

addForm.addEventListener('submit', addUser)

function addUser(e) {
    e.preventDefault()
    var userName = document.getElementById('name').value;
    var userEmail = document.getElementById('email').value;
    var userPassword = document.getElementById('password').value;

    var userDetails = {
        username: userName,
        useremail: userEmail,
        userpassword: userPassword
    }
    console.log('consoling user data before posting', userDetails)
    axios.post('http://localhost:3000/user/add-user', userDetails)
    .then((response) => {
        console.log(response)
    })
    .catch(err => {
        // alert('Uer Already Exists! You can Log In')
        errorMessageContainer.textContent = 'User Already Exists! You can Log In'; // Update the error message
        console.log('user Already exists')
        console.log(err)})
}