/**
 * Compute, download and show data sites and layers.
 *
 * @link uselocalco.de
 * @file This file computes data sites and layers.
 * @author localsoftware
 * @since 0.0.0
 */

const path = require('path') // for handling file paths in many OS
const fs = require('fs') // for operations on the file system
const async = require('async') // for asynchronous operations
const Zip = require('adm-zip') // a duplicate of the next zip

const Models = require('/opt/nodejs/models') // import all models

/**
 * Deletes selected layer from user profile.
 *
 * @param    {object}    req    request object with id of layer to be deleted
 * @param    {object}    res    response redirects to updated layer page
 *
 * @return   {null}
 */
module.exports.deleteLayer = function(req, res) {
  const datalayerIds = req.body.datalayerIds
  // if the user wants to delete layers
  if (req.body.layerButton === 'delete') {
    Models.Datafile.update(
      {
        deleted: true,
      },
      {
        where: {
          id: datalayerIds,
        },
      }
    ).then(function() {
      Models.Datalayer.update(
        {
          deleted: true,
        },
        {
          where: {
            datafileId: datalayerIds,
          },
        }
      ).then(function() {
        req.flash('layerAlert', 'Your layer has been deleted')
      })
    })
  }
}

/**
 * Find and render all of the user's data layers on the layers page.
 *
 * @since 0.0.0
 * @access private
 *
 * @param    {object}    req    request containing user id, etc.
 * @param    {object}    res    response renders layer view
 *
 * @return   {null}      response object renders the layer view with all layers
 */
module.exports.show = function(req, res) {
  Models.Datafile.findAll({
    where: {
      userId: req.user.id,
      deleted: { $not: true },
    },
    include: [
      {
        model: Models.Datalayer,
        limit: 1,
      },
    ],
  }).then(function(datafiles) {
    // res.render('layers', {id: req.params.id, datafiles : datafiles, userSignedIn: req.isAuthenticated(), user: req.user, siteAlert: req.flash('siteAlert')[0], layerAlert: req.flash('layerAlert')[0]});
    res.json({ id: req.params.id, datafiles })
  })
}

/**
 * Shows all current data sites (projects) belonging to a user.
 *
 * @since 0.0.0
 * @access private
 *
 * @param    {object}    req    request containing user id, etc.
 * @param    {object}    res    response to render sites view
 *
 * @return   {null}      response object renders the sites view
 */
module.exports.showSites = function(req, res) {
  Models.Datasite.findAll({
    where: {
      userId: req.user.id,
      // processed : true,
      deleted: { $not: true },
    },
    include: [
      {
        model: Models.Datafile,
        include: [
          {
            model: Models.Datalayer,
            limit: 1,
          },
        ],
      },
    ],
  }).then(function(datasites) {
    console.log('------------------------------------------------')

    // res.render('sites', {id: req.params.id, datasites : datasites, userSignedIn: req.isAuthenticated(), user: req.user, siteAlert: req.flash('siteAlert')[0], layerAlert: req.flash('layerAlert')[0]});
    res.json({ id: req.params.id, datasites })
  })
}

/**
 * Deletes site with the little trashcan button. Response redirects back to sites.
 *
 * @since 0.0.0
 * @access private
 *
 * @param    {object}    req    request containing site ids, etc.
 * @param    {object}    res    response sets datasite in DB to true
 *
 * @return   {null}      redirects to site page.
 */
module.exports.deleteSites = function(req, res) {
  if (req.body.datasiteIds !== '') {
    const siteId = parseInt(req.body.datasiteIds.split('_')[1])
    if (req.body.layerButton === 'delete') {
      Models.Datasite.update(
        {
          deleted: true,
        },
        {
          where: {
            id: siteId,
          },
        }
      ).then(function() {
        req.flash('siteAlert', 'Your Site has been deleted')
      })
    }
  }
}

/**
 * A modified function for downloading sites. Accounts for downloading all sites
 * or a subset of sites in the project.
 */

module.exports.downloadProjectSites = function(req, res) {
  console.log('downloadProjectSites', req.body.type, req.body)

  if (req.body.datasiteId !== '') {
    // var siteId = parseInt((req.body.datasiteId).split('_')[1]);
    const siteId = parseInt(req.body.datasiteId)

    if (req.body.type === 'openall') {
      Models.Datajson.findAll({
        where: {
          datasiteId: siteId,
        },
      }).then(function(datajsons) {
        // download site into zipped file
        fs.mkdir(path.join(__dirname, `/zip`), function(err) {
          if (err) console.error(err)

          const uploadDir = path.join(__dirname, '/zip')
          const zipper = new Zip()
          async.each(
            datajsons,
            function(datajson, callback) {
              const json = JSON.stringify(datajson.dataValues.geojson)
              const dataBuffer = Buffer.from(json, 'utf-8')

              zipper.addFile(
                datajson.dataValues.datajsonId.toString() + '.json',
                dataBuffer,
                '',
                0o644 << 16
              )
              callback()
            },
            function(err) {
              if (err) {
                // One of the iterations produced an error.
                // All processing will now stop.
                console.log('A file failed to process')
              }
              const zipName = uploadDir + '/sites.zip'
              zipper.writeZip(zipName)

              const file = fs.createReadStream(zipName)
              file.on('end', function() {
                fs.unlink(zipName, function() {
                  // file deleted
                })
              })
              // write zipped file to disk
              file.pipe(res)
            }
          )
        })
      })
    }
    // for the subset of sites
    else if (req.body.type === 'opensome') {
      const minId = parseInt(req.body.min)
      const maxId = parseInt(req.body.max)
      const subsiteIds = []

      // create array of subsite ids
      for (let i = minId; i <= maxId; i++) {
        subsiteIds.push(i)
      }

      Models.Datajson.findAll({
        where: {
          datasiteId: siteId,
          datajsonId: subsiteIds,
        },
      }).then(function(datajsons) {
        // download site into zipped file
        fs.mkdir(path.join(__dirname, `/zip`), function(err) {
          if (err) console.error(err)

          const uploadDir = path.join(__dirname, '/zip')
          const zipper = new Zip()
          async.each(
            datajsons,
            function(datajson, callback) {
              const json = JSON.stringify(datajson.dataValues.geojson)

              const dataBuffer = Buffer.from(json, 'utf-8')

              const filename =
                datajson.dataValues.datajsonId.toString() + '.json'

              zipper.addFile(filename, dataBuffer, '', 0o644 << 16)
              // ISSUE FIXED: https://github.com/cthackers/adm-zip/issues/182

              callback()
            },
            function(err) {
              if (err) {
                // One of the iterations produced an error.
                // All processing will now stop.
                console.log('A file failed to process')
              }
              const zipName = uploadDir + '/sites.zip'
              zipper.writeZip(zipName)

              const file = fs.createReadStream(zipName)
              file.on('end', function() {
                fs.unlink(zipName, function() {
                  // file deleted
                })
              })
              // write zipped file to disk
              file.pipe(res)
            }
          )
        })
      })
    }
  }
}

/**
 * Downloads selected sites to zipped file or deletes selected sites.
 *
 * Delete response will redirect to the sites page.
 *
 * @since 0.0.0
 * @access private
 *
 * @param    {object}    req    request containing site ids, etc.
 * @param    {object}    res    response downloads zipped file
 *
 * @return   {null}      response object redirects to sites page when a site a
 *                       is deleted. Otherwise the function results in a zipped
 *                       file downloading to your computer.
 */
module.exports.downloadSites = function(req, res) {
  // if sites have been selected
  if (req.body.datasiteIds !== '') {
    const siteId = parseInt(req.body.datasiteIds.split('_')[1])
    console.log(siteId)
    // if the user wants to open the site
    if (req.body.layerButton === 'open') {
      Models.Datajson.findAll({
        where: {
          datasiteId: req.body.datasiteIds.split('_')[1],
        },
      }).then(function(datajsons) {
        // download site into zipped file
        fs.mkdir(path.join(__dirname, `/zip`), function(err) {
          if (err) console.error(err)

          const uploadDir = path.join(__dirname, '/zip')
          const zipper = new Zip()
          async.each(
            datajsons,
            function(datajson, callback) {
              const json = JSON.stringify(datajson.dataValues.geojson)
              const dataBuffer = Buffer.from(json, 'utf-8')

              zipper.addFile(
                datajson.dataValues.datajsonId.toString() + '.json',
                dataBuffer,
                '',
                0o644 << 16
              )
              callback()
            },
            function(err) {
              if (err) {
                // One of the iterations produced an error.
                // All processing will now stop.
                console.log('A file failed to process')
              }
              const zipName = uploadDir + '/sites.zip'
              zipper.writeZip(zipName)

              const file = fs.createReadStream(zipName)
              file.on('end', function() {
                fs.unlink(zipName, function() {
                  // file deleted
                })
              })
              // write zipped file to disk
              file.pipe(res)
            }
          )
        })
      })
      // if the user wants to delete the site
    } else {
      Models.Datasite.update(
        {
          deleted: true,
        },
        {
          where: {
            id: siteId,
          },
        }
      ).then(function() {
        req.flash('siteAlert', 'Your Site has been deleted')
      })
    }
    // the user forgot to select a site
  } else {
    console.log('select layers!!!!')

    req.flash('siteAlert', "You haven't selected a Site. Please select a Site.")
  }
}
