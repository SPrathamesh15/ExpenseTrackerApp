var addForm = document.getElementById('addform')

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
    console.log(userDetails)
    axios.post('http://localhost:3000/user/add-user', userDetails)
    .then((response) => {
        console.log(response)
    })
    .catch(err => console.log(err))
}