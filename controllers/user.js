const express = require('express')
const router = express.Router()
const db = require('../config/db')
const Users = db.users
const auth = require('../middleware/auth')


router.post('/users/register', async (req, res) => {
    try {
        let info = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        };

        const user = await Users.create(info);
        const token = await user.generateAuthToken()

        res.status(201).send({ user, token });
    } catch (e) {
        console.log( e)
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await Users.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken();

        res.status(200).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        const userTokens = JSON.parse(req.user.tokens);
    
        req.user.tokens = JSON.stringify(
          userTokens.filter((tokenObj) => tokenObj.token !== req.token)
        );
    
        await req.user.save();
    
        res.status(200).send(req.user);
      } catch (e) {
        res.status(500).send(e);
      }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        console.log('I am here')
        const user = req.user; // Retrieve the user from the auth middleware
        const updatedTokens = [];
        await Users.update({ tokens: updatedTokens }, { where: { id: user.id } });
        res.send();
    } catch (e) {
        res.status(500).send();
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.status(200).send(req.user);
})

router.delete('/users/delete', auth, auth, async (req, res) => {
    try {
      await req.user.destroy();
  
      res.status(200).send(req.user);
    } catch (e) {
      res.status(500).send(e);
    }
});


module.exports = router