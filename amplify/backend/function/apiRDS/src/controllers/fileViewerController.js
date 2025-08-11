/**
 * Upload and view datafiles in web app.
 *
 * @link uselocalco.de
 * @file This file contains methods for uploading and viewing data files/layers
 * @author localsoftware
 * @since 0.0.0
 */

const fileViewerHelper = require('../lib/fileViewerHelper')

const Models = require('/opt/nodejs/models') // import all models

/**
 * Gets all data layers belonging to a user. Data layers belong to data files.
 *
 * @since 0.0.0
 * @access private
 *
 * @param    {object}    req    request with datafile paramaters
 * @param    {object}    res    response sends the datafile
 *
 * @return   {null}      response object sends data files
 */

module.exports.getDatalayers = function(req, res) {
  console.log('Data layer id: ' + req.params.datafileId + '\n\n')

  Models.Datafile.findOne({
    where: {
      userId: req.user.id,
      id: req.params.datafileId,
    },
    include: [
      {
        model: Models.Datalayer,
        limit: 1,
      },
    ],
  }).then(function(datafile) {
    res.send({
      datafile,
    })
  })
}

/**
 * Shows preview of data layer with information.
 *
 * @since 0.0.0
 * @access private
 *
 * @param    {object}    req    request
 * @param    {object}    res    response sends thumbnail to client
 *
 * @return   {null}      Sends response object.
 */

module.exports.serveThumbnailData = async function(req, res) {
  console.log('serveThumbnailData', 'start', req.params.id)

  const result = await fileViewerHelper.loadDatalayers(req.params.id)

  console.log('serveThumbnailData', 'res', result)

  res.json({
    geoJSON: result[0],
    centroid: result[2],
    bBox: result[1],
  })
}
