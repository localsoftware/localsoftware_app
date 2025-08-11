/**
 * Construct a database from all models (User, dataSite, dataJson...)
 *
 * @link uselocalco.de
 * @file This file constructs and exports a database from all models.
 * @author localsoftware
 * @since 0.0.0
 */

'use strict'

const fs = require('fs') // file system module
const path = require('path') // file directory module
const Sequelize = require('sequelize') // promise-based ORM for Postgres

const basename = path.basename(module.filename)
const env = process.env.NODE_ENV || 'development'
const config = require(path.join(__dirname, '../config/config.json'))[env]
const db = {} // Construct db from all models

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
)

// get all model files from current directory
fs.readdirSync(__dirname)
  .filter(function(file) {
    // exclude index.js and other improperly names files
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    )
  })
  .forEach(function(file) {
    const model = sequelize.import(path.join(__dirname, file))
    // add model to db
    db[model.name] = model
  })

// Check for associations in model and construct associations in database
Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

// export constructed database
module.exports = db
