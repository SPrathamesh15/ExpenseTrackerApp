// expenseRoutes.js
const express = require('express');
const expenseController = require('../controllers/index');

const router = express.Router();

router.get('/add-expense', expenseController.getAddExpense);
router.post('/add-expense', expenseController.postAddExpense);
router.get('/get-expenses', expenseController.getAllExpenses);
router.delete('/delete-expense/:expenseId', expenseController.deleteExpense);

module.exports = router;
