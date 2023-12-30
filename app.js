const express = require('express')
var cors = require('cors')
const bodyParser = require('body-parser')
const app = express();

const sequelize = require('./util/database');

const userRoutes = require('./routes/signUp');
const userLogInRoutes = require('./routes/logIn');
const expenseRoutes = require('./routes/index');
const purchaseRoutes = require('./routes/purchase')
const leaderBoardRoutes = require('./routes/premium')
const forgotPasswordRoutes = require('./routes/forgotpassword')
const resetPasswordRoutes = require('./routes/resetpassword')

const Expense = require('./models/index');
const User = require('./models/signup');
const Order = require('./models/orders')
const forgotPasswordRequest = require('./models/ForgotPasswordRequests')
app.use(bodyParser.urlencoded());
app.use(express.json());
app.use(cors());

app.use('/user', userRoutes)
app.use('/user', userLogInRoutes)
app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRoutes)
app.use('/premium', leaderBoardRoutes)
app.use('/password', forgotPasswordRoutes)
//route for backend part of reset password
app.use('/password', resetPasswordRoutes)

const path = require('path');
const fs = require('fs');

// Define the route to show the page
app.get('/password/reset-password/:token', (req, res) => {
    // Sending the resetPassword.html file
    res.sendFile(path.join(__dirname, 'resetPassword.html'));
});

//Association one to many
User.hasMany(Expense)
Expense.belongsTo(User)

//Association between order and user
User.hasMany(Order)
Order.belongsTo(User)

//Association between forgot password and user
User.hasMany(forgotPasswordRequest)
forgotPasswordRequest.belongsTo(User)

sequelize.sync()
    .then(() => {
        app.listen(3000)
    })
    .catch((err) => {
        console.log(err)
})