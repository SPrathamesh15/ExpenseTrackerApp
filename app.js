const express = require('express')
var cors = require('cors')
const bodyParser = require('body-parser')
const app = express();
const helmet = require('helmet')
const morgan = require('morgan')
const sequelize = require('./util/database');

const path = require('path');
const fs = require('fs');

const userRoutes = require('./routes/signUp');
const userLogInRoutes = require('./routes/logIn');
const expenseRoutes = require('./routes/index');
const purchaseRoutes = require('./routes/purchase')
const leaderBoardRoutes = require('./routes/premium')
const forgotPasswordRoutes = require('./routes/forgotpassword')
const resetPasswordRoutes = require('./routes/resetpassword')
const reportsRoutes = require('./routes/report')

const Expense = require('./models/index');
const User = require('./models/signup');
const Order = require('./models/orders')
const filesDownloaded = require('./models/filesDownloaded')

const forgotPasswordRequest = require('./models/ForgotPasswordRequests')
app.use(helmet())
app.use(cors());
app.use(bodyParser.urlencoded());
app.use(express.json());



const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a'})
app.use(morgan('combined', { stream: accessLogStream }))

app.use('/user', userRoutes)
app.use('/user', userLogInRoutes)
app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRoutes)
app.use('/premium', leaderBoardRoutes)
app.use('/password', forgotPasswordRoutes)
//route for backend part of reset password
app.use('/password', resetPasswordRoutes)
app.use('/report', reportsRoutes)

app.use((req, res, next) => {
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self' https://cdnjs.cloudflare.com 'unsafe-inline'; script-src 'self' https://checkout.razorpay.com 'unsafe-inline'; style-src 'self' https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/ 'unsafe-inline'; connect-src 'self' http://13.126.112.76:3000"
    );
    next();
});

app.get('/password/reset-password/:token', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/resetpassword/resetpassword.html'));
});

app.use((req, res) => {
    console.log('URL: ', req.url);
    res.sendFile(path.join(__dirname, `public/${req.url}`))
})

//Association one to many
User.hasMany(Expense)
Expense.belongsTo(User)

//Association between FilesDownloaded and user
User.hasMany(filesDownloaded)
filesDownloaded.belongsTo(User)

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
