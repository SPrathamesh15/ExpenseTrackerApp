const Sib = require('sib-api-v3-sdk')
const {createTransport} = require('nodemailer')
const dotenv = require('dotenv')
dotenv.config()

exports.forgotPassword = async (req, res) => {
    // const client = Sib.ApiClient.instance
    // const apikey = client.authentications['api-key']
    // apikey.apikey = process.env.FORGOT_PASSWORD_API_KEY

    // console.log('ApiKey: :', apikey.apikey)
    // const tranEmailApi = new Sib.TransactionalEmailsApi()

    // const sender = {
    //     email: 'sprathamesh354@gmail.com'
    // }

    // const receivers = [{
    //     email: req.body.emails
    // }]

    // tranEmailApi.sendTransacEmail({
    //     sender,
    //     to: receivers,
    //     subject: 'Forgot Password!',
    //     textContent: `
    //     This email is to inform you that you forgot your password so we will send you this link so you can reset your password`
    // })
    // .then(response=>console.log(response))
    // .catch(err=>console.log('backend error: ',err))

    const transporter = createTransport({
        host: 'smtp-relay.sendinblue.com',
        port: 587,
        auth: {
            user: "sprathamesh354@gmail.com",
            pass: process.env.FORGOT_PASSWORD_API_KEY
        }
    })

    const mailOptions = {
        from: "sprathamesh354@gmail.com",
        to: req.body.emails,
        subject: "Forgot Password!",
        text: "This mail regarding forgot password we will share you a link so you can reset your password"
    }

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error)
        } else{
            console.log('Email sent: ' + info.response)
        }
    })
    const email = req.body.emails
    console.log(email)
}