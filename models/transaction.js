module.exports = (sequelize, DataTypes) => {
    const Transactions = sequelize.define('transactions', {
        amount: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        date: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        category: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        currency: {
            type: DataTypes.STRING,
            allowNull: false,
            set(value) {
                this.setDataValue("currency", value.toUpperCase());
            }
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        }
      });

      return Transactions;
    }

    