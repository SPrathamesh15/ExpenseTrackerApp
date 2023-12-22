const express = require('express')
var cors = require('cors')
const bodyParser = require('body-parser')
const app = express();

const sequelize = require('./util/database');

const userRoutes = require('./routes/signUp');
const userLogInRoutes = require('./routes/logIn');
const expenseRoutes = require('./routes/index');

app.use(bodyParser.urlencoded());
app.use(express.json());
app.use(cors());

app.use('/user', userRoutes)
app.use('/user', userLogInRoutes)
app.use('/expense', expenseRoutes);

app.listen(3000)
