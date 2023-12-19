const Sequelize = require('sequelize')

const sequelize = require('../util/database')

const UserDetails = sequelize.define('expenseTracker', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false
  },
  useremail: {
    type: Sequelize.STRING,
    allowNull: false
  },
  userpassword: {
    type: Sequelize.STRING,
    allowNull: false
  }
  
});

module.exports = UserDetails;
