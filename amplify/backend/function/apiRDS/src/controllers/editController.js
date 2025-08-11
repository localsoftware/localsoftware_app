const Models = require('/opt/nodejs/models') // import all models

/**
 * Handles updating datasets or datalayers from the /datasets page.
 * @param {Object} req
 * @param {Object} res
 */
module.exports.editDatalayer = function(req, res) {
  // dataFileId to be updated
  const datafileId = req.body.id
  const userFileName = req.body.name
  const userLayerName = req.body.name
  const description = req.body.description

  console.log('editDatalayer', { datafileId, userLayerName, description })

  Models.Datafile.update(
    {
      userFileName,
      description,
    },
    {
      where: {
        id: datafileId,
      },
    }
  ).then(function() {
    console.log('editDatalayer done Datafile')

    /* skip since it takes too long
    // update relevant datalayers
    Models.Datalayer.update(
      {
        description,
        userLayerName,
      },
      {
        where: {
          datafileId,
        },
      }
    ).then(function(result) {
      console.log('editDatalayer done Datalayer')

      res.json({ datafileId, updated: true })
    })
    */

    res.json({ datafileId, updated: true })
  })
}

/**
 * Handles updating voxels from the /projects page.
 * @param {Object} req
 * @param {Object} res
 */
module.exports.editSitepackage = function(req, res) {
  // site to be updated
  const id = req.body.id
  const packageName = req.body.name

  Models.Datasite.update(
    {
      sitename: packageName,
    },
    {
      where: {
        id: id,
      },
    }
  ).then(function(result) {
    res.json({ id: id, updated: true })
  })
}
