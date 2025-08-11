const Models = require('/opt/nodejs/models') // import all models

module.exports.countSites = function(req, res) {
  const siteId = req.params.datasiteId
  Models.Datajson.count({
    where: {
      datasiteId: siteId,
    },
  }).then(function(datasiteCount) {
    res.send({
      datasiteCount: datasiteCount,
    })
  })
}

module.exports.getSiteById = function(req, res) {
  Models.Datasite.findAll({
    where: {
      id: req.params.siteId,
      deleted: { $not: true },
    },
  }).then(function(datasite) {
    res.json({ datasite })
  })
}
