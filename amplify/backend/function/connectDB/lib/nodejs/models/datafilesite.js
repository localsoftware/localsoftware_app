/**
 * Extend Sequelize classes with Datafilesite model.
 *
 * A Datafilesite may have one Datasite and one Datafile.
 *
 * @link uselocalco.de
 * @file This file constructs Datafilesite model.
 * @author localsoftware
 * @since 0.0.0
 */

'use strict'

/**
 * Construct and export Datafilesite model.
 *
 * @since 0.0.0
 * @access private
 *
 * @param    {object}    sequelize    object with methods to create models
 * @param    {object}    DataTypes    object containing data types
 *
 * @return   {object}     Datafilesite model ids, etc.
 */

module.exports = function(sequelize, DataTypes) {
  const Datafilesite = sequelize.define(
    'Datafilesite',
    {
      DatasiteId: DataTypes.INTEGER,
      DatafileId: DataTypes.INTEGER,
    },
    {
      classMethods: {
        associate: function(models) {
          // associations can be defined here
          Datafilesite.belongsTo(models.Datasite, { foreignKey: 'DatasiteId' })
          Datafilesite.belongsTo(models.Datafile, { foreignKey: 'DatafileId' })
        },
      },
    }
  )
  return Datafilesite
}
