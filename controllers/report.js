const Expense = require('../models/index');
const sequelize = require('../util/database');

// Controller
const { Op } = require('sequelize');

exports.getAllReports = async (req, res, next) => {
  try {
    let startDate, endDate;

    // Determine start and end dates based on the time period parameter
    const timePeriod = req.query.timePeriod; // Assuming the timePeriod parameter is provided in the query

    if (timePeriod === 'daily') {
      startDate = sequelize.literal('CURDATE()');
      endDate = sequelize.literal('CURDATE() + INTERVAL 1 DAY');
    } else if (timePeriod === 'weekly') {
      startDate = sequelize.literal('CURDATE() - INTERVAL WEEKDAY(CURDATE()) DAY');
      endDate = sequelize.literal('CURDATE() + INTERVAL (6 - WEEKDAY(CURDATE())) DAY');
    } else if (timePeriod === 'monthly') {
      startDate = sequelize.literal('CURDATE() - INTERVAL DAYOFMONTH(CURDATE())-1 DAY');
      endDate = sequelize.literal('LAST_DAY(CURDATE())');
    } else if (timePeriod === 'yearly') {
      startDate = sequelize.literal('CURDATE() - INTERVAL DAYOFYEAR(CURDATE())-1 DAY');
      endDate = sequelize.literal('CURDATE() + INTERVAL (365 - DAYOFYEAR(CURDATE())) DAY');
    }

    const expenses = await Expense.findAll({
      attributes: [
        'id',
        'income',
        'expense',
        'Description',
        'category',
        [sequelize.literal('DATE(createdAt)'), 'Date'],
        // Add other columns you need
      ],
      where: {
        userId: req.user.id,
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    res.status(200).json({ allExpenses: expenses });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log('error year', err);
  }
};
