const Models = require('/opt/nodejs/models') // import all models

/**
 * Handles deletion of datasets or datalayers from the /datasets page.
 * @param {Object} req
 * @param {Object} res
 */
module.exports.deleteDatalayers = function(req, res) {
  // dataFileId to be deleted
  const datafileId = req.body.id

  // delete relevant datafile
  Models.Datafile.update(
    {
      deleted: true,
    },
    {
      where: {
        id: datafileId,
      },
    }
  ).then(function() {
    // soft-delete relevant datalayers
    Models.Datalayer.update(
      {
        deleted: true,
      },
      {
        where: {
          datafileId,
        },
      }
    ).then(function(result) {
      res.json({ datafileId, success: true })
    })
  })
}

/**
 * Handles deletion of projects from the /projects page.
 * @param {Object} req
 * @param {Object} res
 */
module.exports.deleteSitePackages = function(req, res) {
  // dataVoxelsId to be deleted
  const datasiteId = req.body.id
  // delete relevant datafile
  Models.Datasite.destroy({
    where: {
      id: datasiteId,
    },
  }).then(function() {
    Models.Datajson.destroy({
      where: {
        datasiteId,
      },
    }).then(function() {
      res.json({ datasiteId, success: true })
    })
  })
}
