/**
 * Extend Sequelize classes with Datalayer model.
 *
 * A Datalayer may belong to one User and one Datafile.
 *
 * @link uselocalco.de
 * @file This file constructs Datalayer model.
 * @author localsoftware
 * @since 0.0.0
 */

'use strict'

/**
 * Construct and export Datalayer model.
 *
 * @since 0.0.0
 * @access private
 *
 * @param    {object}    sequelize    object with methods to create models
 * @param    {object}    DataTypes    object containing data types
 *
 * @return   {object}    Datalayer model with ids, layernames, geography, etc.
 */

module.exports = function(sequelize, DataTypes) {
  const Datalayer = sequelize.define(
    'Datalayer',
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      datafileId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      layername: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
      },
      geography: {
        type: DataTypes.GEOGRAPHY,
        allowNull: true,
      },
      properties: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      epsg: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      userLayerName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      deleted: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      classMethods: {
        // associate Datalayer model with User and Datafile model
        associate: function(models) {
          Datalayer.belongsTo(models.User, { foreignKey: 'userId' })
          Datalayer.belongsTo(models.Datafile, { foreignKey: 'datafileId' })
        },
      },
    }
  )
  return Datalayer
}
