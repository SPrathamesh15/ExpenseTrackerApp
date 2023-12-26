const Expense = require('../models/index');
const User = require('../models/signup');
const Sequelize = require('sequelize');

exports.showLeaderBoard = async (req, res) => {
    try {
        // Find all expenses and group by unique userId, include UserDetails for user names
        const expenses = await Expense.findAll({
            attributes: [
                [Sequelize.literal('User.username'), 'username'],
                [Sequelize.fn('SUM', Sequelize.col('expenseAmount')), 'totalAmount'],
            ],
            include: [
                {
                    model: User,
                    attributes: [],
                },
            ],
            group: ['userId'],
            order: [[Sequelize.fn('SUM', Sequelize.col('expenseAmount')), 'DESC']],
        });

        res.status(200).json({ allExpenses: expenses });
        console.log('expenses grouped by userId and sorted by totalAmount in descending order');
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.error(err);
    }
};
