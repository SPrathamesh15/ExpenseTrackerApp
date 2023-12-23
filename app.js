const express = require('express')
var cors = require('cors')
const bodyParser = require('body-parser')
const app = express();

const sequelize = require('./util/database');

const userRoutes = require('./routes/signUp');
const userLogInRoutes = require('./routes/logIn');
const expenseRoutes = require('./routes/index');
const Expense = require('./models/index');
const User = require('./models/signup');

app.use(bodyParser.urlencoded());
app.use(express.json());
app.use(cors());

app.use('/user', userRoutes)
app.use('/user', userLogInRoutes)
app.use('/expense', expenseRoutes);

//Association one to many
User.hasMany(Expense)
Expense.belongsTo(User)

sequelize.sync()
    .then(() => {
        app.listen(3000)
    })
    .catch((err) => {
        console.log(err)
    })

