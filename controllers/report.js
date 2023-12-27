const db = require('../config/db')
const express = require('express')
const router = express.Router()
const Transactions = db.transactions;
const Budgets = db.budgets;
const Users = db.users;
const auth = require('../middleware/auth');

const { Op, literal } = require('sequelize');
//const moment = require('moment');


// Financial Report
router.get('/report', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Calculate total income and expenses for the current month
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed in JavaScript
    const currentYear = currentDate.getFullYear();

    console.log(currentMonth);
    const incomeResult = await Transactions.sum('amount', {
        where: { userId, category: 'income', date: { [Op.substring]: `${currentYear}-${currentMonth}` } },
      });
  

    console.log(incomeResult);  

    const expenseResult = await Transactions.sum('amount', {
        where: { userId, category: 'expense', date: { [Op.substring]: `${currentYear}-${currentMonth}` } },
      });

    const totalIncome = incomeResult || 0;
    const totalExpense = expenseResult || 0;

    // Find the budget for the current month
    const budgetResult = await Budgets.findOne({
      where: { userId, month: currentMonth},
    });

    const budgetAmount = budgetResult ? budgetResult.amount : 0;

    // Calculate the remaining budget for the current month
    const remainingBudget = budgetAmount - totalExpense;

    // Prepare and send the financial report
    const report = {
      totalIncome,
      totalExpense,
      budgetAmount,
      remainingBudget,
    };

    res.json({ report });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
