var form = document.getElementById('addForm')

form.addEventListener('submit', forgotPassword)

function forgotPassword(e){
    e.preventDefault()

    var email = document.getElementById('email').value

    var forgotDetails = {
        emails: email
    }
    console.log(email)
    const token = localStorage.getItem('token');
    axios.post('http://localhost:3000/password/forgotpassword', forgotDetails, { headers: {'Authorization' : token }})
        .then(response => {
            console.log('Response',response)
        })
        .catch(err=>console.log(err))
}