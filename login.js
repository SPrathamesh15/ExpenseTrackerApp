var addForm = document.getElementById('addform')
var errorMessageContainer = document.getElementById('error-message');

addForm.addEventListener('submit', logInUser)

function logInUser(e){
    e.preventDefault()
    
    var userEmail = document.getElementById('email').value;
    var userPassword = document.getElementById('password').value;

    var userDetails = {
        useremail: userEmail,
        userpassword: userPassword
    }
    console.log('consoling user data before posting', userDetails)
    axios.post('http://localhost:3000/user/login-user', userDetails)
    .then((response) => {
        console.log(response)
        alert('User Logged In Successfully!')
    })
    .catch(err => {
        // alert("User Doesn't Exists! You can Sign Up")
        // errorMessageContainer.textContent = err;
        if (err == "AxiosError: Request failed with status code 404"){
            alert('Error 404: User not Found')
            console.log("user Doesn't exists")
            errorMessageContainer.textContent = "User Does not Exists!";
        }else if (err == "AxiosError: Request failed with status code 401"){
            alert('Error 401: User Not Authorized')
            console.log('Password Does not Match!')
            errorMessageContainer.textContent = "Password Does not Match!";
        }
        console.log(err)
    })
}