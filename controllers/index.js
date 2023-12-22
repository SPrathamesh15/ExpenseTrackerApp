// expenseController.js
const Expense = require('../models/index');

exports.getAddExpense = (req, res, next) => {
  res.render('expense/add-expense', {
    pageTitle: 'Add Expense',
    path: '/expense/add-expense'
  });
};

exports.postAddExpense = async (req, res, next) => {
  try {
    const expenseAmount = req.body.expenseAmount;
    const expenseDescription = req.body.expenseDescription;
    const category = req.body.category;

    const data = await Expense.create({
      expenseAmount: expenseAmount,
      expenseDescription: expenseDescription,
      category: category
    });

    res.status(201).json({ newExpenseDetails: data });
    console.log('Expense added to server');
  } catch (err) {
    res.status(500).json({ error: err });
    console.error(err);
  }
};

exports.getAllExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.findAll();
    res.status(200).json({ allExpenses: expenses });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.deleteExpense = async (req, res, next) => {
  const expenseId = req.params.expenseId;

  try {
    const result = await Expense.destroy({
      where: { id: expenseId }
    });

    res.status(200).json({ message: 'Expense deleted successfully', result });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
