const db = require('../config/db')
const express = require('express')
const router = express.Router()
const Transactions = db.transactions;
const Budgets = db.budgets;
const Users = db.users;
const auth = require('../middleware/auth');

const { Op } = require('sequelize');


// Financial Report of current month
router.get('/report', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Calculate total income and expenses for the current month
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed in JavaScript
    const currentYear = currentDate.getFullYear();

    //console.log(currentMonth);
    const incomeResult = await Transactions.sum('amount', {
        where: { userId, category: 'income', date: { [Op.substring]: `${currentYear}-${currentMonth}` } },
      });
    

    const expenseResult = await Transactions.sum('amount', {
        where: { userId, category: 'expense', date: { [Op.substring]: `${currentYear}-${currentMonth}` } },
      });

    const totalIncome = incomeResult || 0;
    const totalExpense = expenseResult || 0;

    // Find the budget for the current month
  
    const monthName = convertMonthNumberToName(currentMonth);
    

    const budgetResult = await Budgets.findOne({
      where: { userId, month: monthName},
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







// Financial Report for a Specific Month
router.get('/report/:year/:month', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { year, month } = req.params;

    // Validate input
    if (!year || !month) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Calculate total income and expenses for the specified month
    const incomeResult = await Transaction.sum('amount', {
      where: { userId, category: 'income', date: { [Op.substring]: `${year}-${month}` } },
    });

    const expenseResult = await Transaction.sum('amount', {
      where: { userId, category: 'expense', date: { [Op.substring]: `${year}-${month}` } },
    });

    const totalIncome = incomeResult || 0;
    const totalExpense = expenseResult || 0;

    // Find the budget for the specified month 
    const monthName = convertMonthNumberToName(currentMonth);
    const budgetResult = await Budget.findOne({
      where: { userId, month: monthName },
    });

    const totalBudget = budgetResult ? budgetResult.amount : 0;

    // Calculate savings
    const savings = totalIncome - totalExpense;
    const isSavings = savings > 0;
    const totalSavings = isSavings ? savings : 0;

    // Prepare and send the financial report
    const report = {
      totalIncome,
      totalExpense,
      totalBudget,
      isSavings,
      totalSavings,
    };

    res.json({ report });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


function convertMonthNumberToName(monthNumber) {
    const months = [
      'january', 'february', 'march', 'april',
      'may', 'june', 'july', 'august',
      'september', 'october', 'november', 'december'
    ];
    const monthIndex = monthNumber - 1;

  // Return the corresponding month name
  return months[monthIndex];
  
}

module.exports = router;

  
