const express = require('express');
require('./config/db.js');
const app = express();


const userCtrl = require('./controllers/user.js')


const port = 3000;
app.use(express.json());
app.use(userCtrl)



app.get('', (req, res) => {
    res.send('kikiki')
})

app.listen(port, () => {
    console.log('server is up and running on ' + port)
})