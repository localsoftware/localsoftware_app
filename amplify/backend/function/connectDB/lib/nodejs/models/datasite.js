/**
 * Extend Sequelize classes with the Datasite model.
 *
 * A Datasite is the collection of geometries within a radius.
 * A Datasite may belong to one User and multiple Datafiles.
 * A Datasite may have multiple Datalayers.
 *
 * @link uselocalco.de
 * @file This file constructs the Datasite model.
 * @author localsoftware
 * @since 0.0.0
 */

'use strict'

/**
 * Summary. Constructs and exports Datasite model.
 *
 * @since 0.0.0
 * @access private
 *
 * @param    {object}    sequelize    object with methods to create models
 * @param    {object}    DataTypes    object containing data types
 *
 * @return   {object}    Datasite model with site name, projection, etc.
 */

module.exports = function(sequelize, DataTypes) {
  const Datasite = sequelize.define(
    'Datasite',
    {
      sitename: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      epsg: DataTypes.INTEGER,
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      bbox: {
        type: DataTypes.GEOMETRY,
        allowNull: true,
      },
      processed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      deleted: {
        type: DataTypes.BOOLEAN,
      },
      progress: {
        type: DataTypes.JSON,
        // { percentage, status }
      },
      unit: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      radius: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      siteDatafileId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      classMethods: {
        associate: function(models) {
          // associations can be defined here
          Datasite.belongsTo(models.User, { foreignKey: 'userId' })
          Datasite.hasMany(models.Datafilesite, { foreignKey: 'DatasiteId' })
          Datasite.belongsToMany(models.Datafile, { through: 'Datafilesite' })
        },
      },
    }
  )
  return Datasite
}
