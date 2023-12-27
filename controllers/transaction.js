const express = require('express')
const router = express.Router()
const db = require('../config/db')
const Transactions = db.transactions;
const auth = require('../middleware/auth')

router.post('/transactions/add', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        
        const date = new Date();

    const amount = req.body.amount;
    const category = req.body.category; 
    const currency = req.body.currency;

    const CurrencyCodes = ['INR'];
    const isValid = CurrencyCodes.includes(currency.toUpperCase());
        if (!isValid) {
            return res.status(404).send({ error: 'Invalid currency code' })
        }
      
  
      // Validate input (you may want to use a validation library like 'Joi')
      if (!amount || !category || !currency) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      // Add transaction using the service
      const transaction = await Transactions.create( { amount, date, category, currency, userId});
  
      res.status(201).json({ transaction });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } );


  router.get('/transactions/list', auth, async (req, res) => {
    try {
      const userId = req.user.id;
  
      // Retrieve transactions using Sequelize
      const transactions = await Transactions.findAll({
        where: { userId },
      });
  
      res.json({ transactions });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.put('/transactions/:id', auth, async (req, res) => {
    try {
      const { id } = req.params;
      const { amount, category,currency } = req.body;
      const userId = req.user.id;
  
      // Validate input
      if (!amount && !category && !currency) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      // Update transaction using Sequelize
       await Transactions.update(
        { amount,  category, currency },
        { where: { id, userId } }
      );
  
    //   if (updatedRows === 0) {
    //     return res.status(404).json({ error: 'Transaction not found' });
    //   }
  
      const updatedTransaction = await Transactions.findOne({ where: { id, userId } });
  
      res.json({ updatedTransaction });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  

  router.delete('/transactions/:id', auth, async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
  
      // Delete transaction using Sequelize
    await Transactions.destroy({ where: { id, userId } });
  
  
      res.status(204).send(); // No content for successful deletion
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  


module.exports = router