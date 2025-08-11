import { bboxPolygon, feature as getFeature, area as getArea } from '@turf/turf'
import _ from 'lodash'
import Color from 'color'

import { graphqlOperation } from 'aws-amplify'

import { api } from '@/services/amplify'
import * as queries from '@/graphql/queries'

const baseColor = Color.hsl(0, 60, 60)

export const state = () => ({
  // state
})

export const getters = {
  // getters
}

export const mutations = {
  // mutations
}

export const actions = {
  async getPkgs(_store, { userId }) {
    const queryData = await api.graphql(graphqlOperation(queries.listPkgs))
    const pkgs = queryData.data.listPkgs.items || []

    console.log('pkgs', { pkgs })

    return Promise.all(
      pkgs
        .filter(pkg => pkg.id)
        .map(async pkg => {
          pkg.pkgId = String(pkg.id)

          // const idHue = (pkg.fileId % 12) * 30 || Math.random() * 360
          // pkg.color = baseColor.rotate(idHue).hex()
          pkg.color = baseColor.hex()

          pkg.bbox = pkg.bbox
            ? JSON.parse(pkg.bbox)
            : bboxPolygon([0, 0, 0, 0]).geometry

          pkg.bbox = getFeature(pkg.bbox)
          pkg.area = Math.floor(getArea(pkg.bbox) / 1000000) // m² -> km²

          pkg.bbox = {
            ...pkg.bbox,
            properties: { isLC: true, bbox: pkg.bbox },
          }
          pkg.layerId = String(pkg.id)

          pkg.layers = await Promise.all(pkg.layerIds.map(getLayer))

          return { ...pkg }
        })
    )
  },

  getSitesO(_store, { id }) {
    return this.$axios.get(`/api/sites/${id}`).then(res => {
      // console.log(res)
      return res.data.datasites.map(site => {
        const idHue = (site.id % 12) * 30
        site.color = baseColor.rotate(idHue).hex()

        site.bbox = getFeature(site.bbox)
        site.area = Math.floor(getArea(site.bbox) / 1000000) // m² -> km²

        site.bbox = {
          ...site.bbox,
          properties: { isLC: true, bbox: site.bbox },
        }
        site.layerId = String(site.id)

        return site
      })
    })
  },

  async getLayers(_store, { userId }) {
    const queryData = await api.graphql(graphqlOperation(queries.listLayers))
    const layers = queryData.data.listLayers.items || []

    console.log('layers', { layers })

    // return layers

    return layers.filter(layer => layer.id).map(formatLayer)
  },

  async getLayersOO(_store, { userId }) {
    const model = 'Datafile'
    const method = 'findAll'
    let query = {
      where: {
        userId,
        deleted: { $not: true },
      },
    }
    query = JSON.stringify(query)

    console.log('getLayers', { queries, model, method, query })

    const datafiles = await api
      .graphql(
        graphqlOperation(queries.queryDataFromDb, { model, method, query })
      )
      .then(res => {
        const { data } = res

        return data.queryDataFromDB
      })
      .then(data => JSON.parse(data))
      .then(data => {
        return data
      })

    console.log('datafiles', { datafiles })

    if (!datafiles) return []

    return datafiles
      .filter(layer => layer.bbox)
      .map(layer => {
        // .filter(layer => layer.Datalayers[0])

        layer.layerId = String(layer.id)
        const bboxCoords = layer.bbox.coordinates[0]

        const minX = _.minBy(bboxCoords, '0')[0]
        const maxX = _.maxBy(bboxCoords, '0')[0]
        const minY = _.minBy(bboxCoords, '1')[1]
        const maxY = _.maxBy(bboxCoords, '1')[1]

        layer.bbox = bboxPolygon([minX, minY, maxX, maxY])
        layer.bbox = {
          ...layer.bbox,
          properties: { isLC: true, bbox: layer.bbox },
        }

        layer.bboxArray = [minX, minY, maxX, maxY]

        const idHue = (layer.id % 12) * 30
        layer.color = baseColor.rotate(idHue).hex()
        layer.userLayerName = layer.filename
        // TODO: set & get userLayerName w/ graphql

        return { ...layer }
      })
  },

  getLayersO(_store, { userId }) {
    return this.$axios.get(`/api/layers/${userId}`).then(res => {
      console.log(`/api/layers/${userId}`, res)
      return res.data.datafiles
        .filter(layer => layer.Datalayers[0])
        .map(layer => {
          const dataLayer = layer.Datalayers[0]
          layer.layerId = String(layer.id)
          layer.dataId = String(dataLayer.id)
          const bboxCoords = layer.bbox.coordinates[0]

          const minX = _.minBy(bboxCoords, '0')[0]
          const maxX = _.maxBy(bboxCoords, '0')[0]
          const minY = _.minBy(bboxCoords, '1')[1]
          const maxY = _.maxBy(bboxCoords, '1')[1]

          layer.bbox = bboxPolygon([minX, minY, maxX, maxY])
          layer.bbox = {
            ...layer.bbox,
            properties: { isLC: true, bbox: layer.bbox },
          }

          layer.bboxArray = [minX, minY, maxX, maxY]

          const idHue = (layer.id % 12) * 30
          layer.color = baseColor.rotate(idHue).hex()
          layer.userLayerName = layer.userLayerName
            ? layer.userLayerName
            : 'unnamed'

          return { ...layer, ...dataLayer }
        })
    })
  },
}

async function getLayer(layerId) {
  const queryData = await api.graphql(
    graphqlOperation(queries.getLayer, {
      id: layerId,
    })
  )

  const layer = queryData.data.getLayer
  if (!layer) return null

  return formatLayer(layer)
}

function formatLayer(layer) {
  layer.layerId = String(layer.id)

  const [minX, minY, maxX, maxY] = layer.bbox || [0, 0, 0, 0]

  layer.bbox = bboxPolygon([minX, minY, maxX, maxY])
  layer.bbox = {
    ...layer.bbox,
    properties: { isLC: true, bbox: layer.bbox },
  }

  layer.bboxArray = [minX, minY, maxX, maxY]

  // const idHue = (layer.fileId % 12) * 30 || Math.random() * 360
  // layer.color = baseColor.rotate(idHue).hex()
  layer.color = baseColor.hex()
  layer.userLayerName = layer.name
  layer.description = layer.desc

  return { ...layer }
}
