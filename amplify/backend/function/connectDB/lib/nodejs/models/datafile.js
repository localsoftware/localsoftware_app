/**
 * Extend Sequelize classes with the Datafile model.
 *
 * A Datafile is a representation of a SHP file.
 * A Datafile may belong to one User and multiple Datasites.
 * A Datafile may have multiple Datalayers.
 *
 * @link uselocalco.de
 * @file This file constructs the Datafile model.
 * @author localsoftware
 * @since 0.0.0
 */

'use strict'

/**
 * Construct datafile model.
 *
 * @file This file constructs Datafile model.
 * @since 0.0.0
 *
 * @param    {object}    sequelize     object with methods to create models
 * @param    {object}    Datatypes     object containing data types
 *
 * @return    {object}    Datafile model containing location, projection, etc.
 */

module.exports = function(sequelize, DataTypes) {
  const Datafile = sequelize.define(
    'Datafile',
    {
      filename: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      epsg: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: true,
      },
      userId: {
        type: DataTypes.INTEGER,
      },
      bbox: {
        type: DataTypes.GEOMETRY,
        allowNull: true,
      },
      centroid: {
        type: DataTypes.GEOMETRY,
        allowNull: true,
      },
      deleted: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      classMethods: {
        associate: function(models) {
          Datafile.belongsTo(models.User, { foreignKey: 'userId' })
          Datafile.hasMany(models.Datalayer, { foreignKey: 'datafileId' })
          Datafile.belongsToMany(models.Datasite, { through: 'Datafilesite' })
        },
      },
    }
  )
  return Datafile
}
