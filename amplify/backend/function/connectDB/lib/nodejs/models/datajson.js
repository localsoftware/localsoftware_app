/**
 * Extend Sequelize classes with Datajson model.
 *
 * A Datajson may belong to one User and one Datafile.
 *
 * @link uselocalco.de
 * @file This file constructs Datajson model.
 * @author localsoftware
 * @since 0.0.0
 */

'use strict'

/**
 * Construct and export Datajson model.
 *
 * @since 0.0.0
 * @access private
 *
 * @param    {object}    sequelize    object with methods to create models
 * @param    {object}    DataTypes    object containing data types
 *
 * @return   {object}    Datajson model with ids, sitename, colors, etc.
 */

module.exports = function(sequelize, DataTypes) {
  const Datajson = sequelize.define(
    'Datajson',
    {
      sitename: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      geojson: DataTypes.JSON,
      epsg: DataTypes.INTEGER,
      userId: {
        type: DataTypes.INTEGER,
      },
      // datafileId: {
      //     type: DataTypes.INTEGER
      // },
      datasiteId: {
        type: DataTypes.INTEGER,
      },
      datajsonId: {
        type: DataTypes.INTEGER,
      },
      color1: {
        type: DataTypes.STRING,
        defaultValue: '#00ff00',
      },
      color2: {
        type: DataTypes.STRING,
        defaultValue: '#0000ff',
      },
    },
    {
      classMethods: {
        // associate Datajson with a User and Datasite
        associate: function(models) {
          Datajson.belongsTo(models.User, { foreignKey: 'userId' })
          // Datajson.belongsTo(models.Datafile, {foreignKey: 'datafileId'});
          Datajson.belongsTo(models.Datasite, { foreignKey: 'datasiteId' })
        },
      },
    }
  )
  return Datajson
}
