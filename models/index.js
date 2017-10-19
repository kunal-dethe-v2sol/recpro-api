var Sequelize = require('sequelize');

const Op = Sequelize.Op;
const sequelize = new Sequelize('node-demo', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    operatorsAliases: Op, // use Sequelize.Op
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    define: {
        timestamps: false
    }
});
sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = sequelize;