const Expense = require('../models/index');
const User = require('../models/signup');
const Sequelize = require('sequelize');

exports.showLeaderBoard = async (req, res) => {
    try {
        // Find all expenses and group by unique userId, include UserDetails for user names
        // const leaderboardofusers = await User.findAll({
        //     attributes: [
        //         'id', 'username', 
        //         [Sequelize.fn('SUM', Sequelize.col('expenses.expenseAmount')), 'totalAmount'],
        //     ],
        //     include: [
        //         {
        //             model: Expense,
        //             attributes: [],
        //         },
        //     ],
        //     group: ['user.id'],
        //     order: [['totalAmount', 'DESC']],
        // });

        //final optimized way
        const leaderboardofusers = await User.findAll({
            attributes: [
                'id', 
                'username',
                'totalExpense',
            ],
            order: [['totalExpense', 'DESC']],
        });
        res.status(200).json({ allLeaderBoardUsers: leaderboardofusers });
        console.log('expenses grouped by userId and sorted by totalAmount in descending order');
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.error(err);
    }
};
