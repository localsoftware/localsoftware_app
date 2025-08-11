/**
 * This file contains all the routes to the main pages and functions of the app.
 *
 * @link uselocalco.de
 * @file This file handles all of the primary routes for the app.
 * @author localsoftware
 * @since 0.0.0
 */

const router = require('express').Router()

const fileViewerController = require('./controllers/fileViewerController.js')
const datalayerController = require('./controllers/datalayerController.js')
const siteController = require('./controllers/siteController.js')
const editController = require('./controllers/editController.js')
const deleteController = require('./controllers/deleteController.js')

/**
 * Gets thumbnail view of layers.
 */
router.get('/getThumbnailData/:id', fileViewerController.serveThumbnailData)

/**
 * Get all of user's data layers.
 */
router.get('/layers/:id', datalayerController.show)
router.get('/layers/:id/:datafileId', datalayerController.show)

/**
 * To preview sites/projects in browser.
 */
router.get('/sites/:id', datalayerController.showSites)

/**
 * To get a site.
 */
router.get('/site/:siteId', siteController.getSiteById)

/**
 * To delete site
 */
router.post('/deletesites', datalayerController.deleteSites)

/**
 * To download project sites.
 */
router.post('/downloadsites', datalayerController.downloadProjectSites)

/**
 * Retrieve data layers
 */
router.get('/getDatalayers/:datafileId', fileViewerController.getDatalayers)

/**
 * Stream data json
 */
router.get('/countSites/:datasiteId', siteController.countSites)

/**
 * Routes to delete datalayers and site packages
 */
router.post('/delete/datalayers', deleteController.deleteDatalayers)
router.post('/delete/sitepackages', deleteController.deleteSitePackages)

/**
 * Routes to edit datalayers and site packages
 */
router.post('/editdatalayer/', editController.editDatalayer)
router.post('/editsitepackage/', editController.editSitepackage)

module.exports = router
