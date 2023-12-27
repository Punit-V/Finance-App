const express = require('express')
const router = express.Router()
const db = require('../config/db')
const Budgets = db.budgets
const auth = require('../middleware/auth')


router.post('/budgets', auth, async (req, res) => {
    try {
        const { amount, currency, month } = req.body;
        const userId = req.user.id
        // Check if a budget for the given month already exists
        const savedBudget = await Budgets.findOne({ where: { month } });

        // update if exist
        if (savedBudget) {
            await Budgets.update({ amount, currency }, { where: { month } });
            res.status(200).send({
                savedBudget
            });
        } else {
            const newBudget = await Budgets.create({ amount, month, currency, userId});
            res.status(201).send({
                newBudget
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

router.get('/budgets/:month', auth, async (req, res) => {
    try {
      const { month } = req.params;
      const userId = req.user.id;
  
      // Validate input
      if (!month) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      // Find budget using Sequelize
      const foundBudget = await Budgets.findOne({
        where: { userId, month: month.toLowerCase() },
      });
  
      if (!foundBudget) {
        return res.status(404).json({ error: 'Budget not found for the specified month and year' });
      }
  
      res.json({ foundBudget });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


  router.delete('/budgets/delete/:month', auth, async (req, res) => {
    try {
      const { month } = req.params;
      const userId = req.user.id;
  
      // Validate input
      if (!month) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      // Delete budget using Sequelize
      const deletedRows = await Budgets.destroy({
        where: { userId, month: month.toLowerCase()},
      });
  
      if (deletedRows === 0) {
        return res.status(404).json({ error: 'Budget not found for the specified month and year' });
      }
  
      res.status(204).send(); // No content for successful deletion
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


module.exports = router