const { Sequelize } = require('sequelize');

module.exports = new Sequelize(
  'tg_bot',
  'oskaldev',
  'oskaldev',
  {
    host: '109.71.13.46',
    port: '6432',
    dialect: 'postgres'
  }



);