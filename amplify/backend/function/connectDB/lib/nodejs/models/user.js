/**
 * Extend Sequelize classes with the User model.
 *
 * A User may have multiple Datafiles and multiple Datalayers.
 *
 * @link uselocalco.de
 * @file This file constructs the User model.
 * @author localsoftware
 * @since 0.0.0
 */

'use strict'

/**
 * Constructs and exports User model.
 *
 * @since 0.0.0
 * @access private
 *
 * @param    {object}    sequelize    object with methods to create models
 * @param    {object}    DataTypes    object containing data types
 *
 * @return   {object}     User model containing email, password, etc.
 */

module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define(
    'User',
    {
      // Constructs user object
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      urlLink: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      // creates associated methods
      classMethods: {
        associate: function(models) {
          User.hasMany(models.Datafile, { foreignKey: 'userId' })
          User.hasMany(models.Datalayer, { foreignKey: 'userId' })
        },
      },
    }
  )
  return User
}
