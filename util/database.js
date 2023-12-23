const Sequelize = require('sequelize');

const sequelize = new Sequelize('expense-tracker', 'root', '1682', {
    dialect:'mysql',
    host: 'localhost'
})

module.exports = sequelize;