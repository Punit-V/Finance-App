const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({

    "username": "root",

    "password": null,

    "database": "Finance-App",

    "host": "127.0.0.1",

    "dialect": "mysql",
    "logging":false

  });
sequelize.authenticate().then(() => {
    console.log('connected')
}).catch((err) => {
    console.log('error ' + err)
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// db.users = require('../models/user.js')(sequelize, DataTypes)
// db.products = require('../models/transaction.js')(sequelize, DataTypes)
// db.orders = require('../models/budget.js')(sequelize, DataTypes)



module.exports = db;