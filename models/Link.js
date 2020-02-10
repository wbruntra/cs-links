const { Sequelize, Model, DataTypes } = require('sequelize')
const sequelize = require('./connection')

class Link extends Model {}
Link.init(
  {
    code: {
      primaryKey: true,
      type: DataTypes.STRING,
    },
    address: DataTypes.STRING,
  },
  { sequelize, modelName: 'link' },
)

sequelize.sync()

module.exports = Link
