const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-sequelize', 'root', '1682', {
    dialect:'mysql',
    host: 'localhost'
})

module.exports = sequelize;