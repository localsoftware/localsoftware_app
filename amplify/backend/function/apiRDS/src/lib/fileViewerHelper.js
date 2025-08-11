/**
 * Methods for loading data from files.
 *
 * To test a bunch of these, navigate to localhost:3000/getMapData/1
 *
 * @link uselocalco.de
 * @file
 * @author localsoftware
 * @since 0.0.0
 */

const Models = require('/opt/nodejs/models') // import all models

/**
 * Retrieves geometry, bounding box and centroid from datalayer.
 *
 * @since 0.0.0
 * @access private
 *
 * @param    {string}      datafileId     id in database
 * @param    {function}    catch errors or return values as array
 *
 * @return   {null}        Probably returns the array of json geometry from
 *                         each layer along with the bounding box and centroid
 *                         of the original datafile as an array.
 */
function loadDatalayers(datafileId) {
  console.log('loadDatalayers', datafileId)

  return Models.Datalayer.findAll({
    where: {
      datafileId: datafileId,
    },
    include: [
      {
        model: Models.Datafile,
      },
    ],
  }).then(function(datalayers) {
    const parsedGeoJSON = []
    datalayers.forEach(function(json, i) {
      parsedGeoJSON.push(json.geography)
    })

    // TODO: handle datalayers[0] is undefined.

    const bBox = datalayers[0].Datafile.bbox
    const centroid = datalayers[0].Datafile.centroid

    return [parsedGeoJSON, bBox, centroid]
  })
}

module.exports = {
  loadDatalayers: loadDatalayers,
}
