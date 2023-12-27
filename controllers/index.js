const Expense = require('../models/index');
const User = require('../models/signup')
const sequelize = require('../util/database')
exports.getAddExpense = (req, res, next) => {
  res.render('expense/add-expense', {
    pageTitle: 'Add Expense',
    path: '/expense/add-expense'
  });
};

exports.postAddExpense = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const expenseAmount = req.body.expenseAmount;
    const expenseDescription = req.body.expenseDescription;
    const category = req.body.category;
    const userId = req.user.id;

    // Create a new expense
    const expense = await Expense.create({
      expenseAmount: expenseAmount,
      expenseDescription: expenseDescription,
      category: category,
      userId: userId
    },
    { transaction: t }
    );

    // Update totalExpense in UserDetails
    const user = await User.findByPk(userId, { transaction: t });
    console.log(user)
    user.totalExpense = user.totalExpense + parseInt(expenseAmount);
    await user.save({ transaction: t });

    await t.commit();

    res.status(201).json({ newExpenseDetails: expense });
    console.log('Expense added to server');
  } catch (err) {
    await t.rollback();
    res.status(500).json({ error: err.message });
    console.error(err);
  }
};

exports.getAllExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.findAll({ where: { userId: req.user.id }});
    res.status(200).json({ allExpenses: expenses });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};


exports.deleteExpense = async (req, res, next) => {
  const expenseId = req.params.expenseId;
  const t = await sequelize.transaction();

  try {
    // Find the expense to check if it belongs to the logged-in user
    const expense = await Expense.findOne({
      where: { id: expenseId, userId: req.user.id },
      transaction: t
    });

    if (!expense) {
      await t.rollback();
      return res.status(404).json({ message: 'Expense not found or unauthorized' });
    }

    const user = await User.findByPk(req.user.id, { transaction: t });
    if (user) {
      user.totalExpense = user.totalExpense - expense.expenseAmount;
      await user.save({ transaction: t });
    }
    // Only delete the expense if it belongs to the logged-in user
    const result = await Expense.destroy({
      where: { id: expenseId },
      transaction: t
    });

    await t.commit();

    res.status(200).json({ message: 'Expense deleted successfully', result });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ error: err });
  }
};

