module.exports = (sequelize, DataTypes) => {
    const Budgets = sequelize.define("budgets", {
        amount: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
        },
        month: {
            type: DataTypes.STRING,
            allowNull: false,
            set(value) {
                this.setDataValue("month", value.toLowerCase());
            }
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
        },
    })
    return Budgets
}