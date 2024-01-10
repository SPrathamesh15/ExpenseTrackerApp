var addForm = document.getElementById('addform')
var errorMessageContainer = document.getElementById('error-message');
var successMessageContainer = document.getElementById('success-message');

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
            successMessageContainer.textContent = "User Logged In Successfully!";
            alert('User Logged In Successfully!')
            if (response.data && response.data.loggedInUser) {
                // Redirect to the desired page
                window.location.href = 'C:/Users/sprat/Downloads/sharpenerProjects/Backend Expense Tracker/index.html';
                localStorage.setItem('token', response.data.token)
            }
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