const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("users", {
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
            set(email) {
                this.setDataValue("email", email.toLowerCase());
            },
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isLongEnough(value) {
                    if (value.length < 8) {
                        throw new Error("Password should be at least 8 characters long !!");
                    }
                },
                isNotPassword(value) {
                    if (value.toLowerCase() === "password") {
                        throw new Error('Password cannot be "password !!"');
                    }
                },
            },
        },
       
        tokens: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: "[]",
            get() {
                const tokensString = this.getDataValue("tokens");
                return JSON.parse(tokensString);
            },
            set(value) {
                this.setDataValue("tokens", JSON.stringify(value));
            },
        }
    })

    // changing values before creating
    Users.beforeCreate(async (user, options) => {
        user.username = user.username.trim();
        user.password = await bcrypt.hash(user.password.trim(), 8);
        user.tokens = JSON.stringify([]);
    });

    // changing values brfore updating
    Users.beforeUpdate(async (user, options) => {
        if (user.changed('username')) {
            user.username = user.username.trim()
        }
        if (user.changed('password')) {
            user.password = await bcrypt.hash(user.password.trim(), 8);
        }
    })

  // Instance method to generate auth token \\
  Users.prototype.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ id: user.id.toString() }, 'secret_key');

    // Get the current tokens as an array
    let tokens = JSON.parse(user.tokens || "[]");

    // Add a new token object
    tokens.push({ token });

    // Update the 'tokens' field with the updated array by serializing it back to a string
    user.tokens = JSON.stringify(tokens);

    // Save the updated tokens back to the database
    await user.save();

    return token;
  };

    // class methods
    Users.findByCredentials = async function (email, password) {
        const user = await Users.findOne({ where: { email: email } });

        if (!user) {
            throw new Error("Unable to login!!");
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new Error("Unable to login!!");
        }

        return user;
    }
    Users.prototype.toJSON = function () {
        const values = { ...this.get() };

        delete values.password;
        delete values.tokens;
        // delete values.avatar;

        return values;
    };

    return Users;
}
