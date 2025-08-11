const Models = require('/opt/nodejs/models') // import all models

module.exports = async payload => {
  console.log('START modules/thumbnail START')

  const { id } = payload

  console.log('serveThumbnailData', 'start', id)

  const result = await loadDatalayers(id)

  console.log('serveThumbnailData', 'res', result)

  return {
    geoJSON: result[0],
    centroid: result[2],
    bBox: result[1],
  }
}

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
