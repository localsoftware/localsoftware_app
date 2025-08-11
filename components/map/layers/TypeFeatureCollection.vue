<template>
  <div />
</template>

<script>
import {
  feature as Feature,
  featureCollection as FeatureCollection,
} from '@turf/turf'

export default {
  name: 'TypeBBox',
  props: {
    geometries: {
      type: Array,
      default: () => [],
    },
    color: {
      type: String,
      required: true,
    },
  },
  computed: {
    map() {
      return this.$parent.map
    },
    mapLayerId() {
      return `lc-layer-${this._uid}`
    },
    mapSourceId() {
      return `lc-source-${this._uid}`
    },
    featureCollection() {
      return FeatureCollection(
        this.geometries.map(geometry => Feature(geometry))
      )
    },
  },
  watch: {
    geometries() {
      console.log('[TypeFeatureCollection] watch geometries', this.geometries)
      this.setLayer()
    },
    color(color) {
      console.log(this.layerId, { color })
    },
  },
  created() {
    console.log('[TypeFeatureCollection] created', this.color, this.geometries)

    this.setLayer()
  },
  beforeDestroy() {
    // console.log('beforeDestroy', this.layerId)

    if (this.map) {
      this.clear()
    }
  },
  methods: {
    clear() {
      const mapLayerId = this.mapLayerId
      const mapSourceId = this.mapSourceId

      try {
        this.map.removeLayer(`${mapLayerId}-circle`)
        this.map.removeLayer(`${mapLayerId}-fill`)

        this.map.removeSource(mapSourceId)
      } catch (e) {
        console.log('error', e.message)
      }
    },
    setLayer() {
      const mapLayerId = this.mapLayerId
      const mapSourceId = this.mapSourceId

      if (this.map.getSource(mapSourceId))
        this.map.getSource(mapSourceId).setData(this.featureCollection)
      else
        this.map.addSource(mapSourceId, {
          type: 'geojson',
          data: this.featureCollection,
        })

      if (this.map.getLayer(`${mapLayerId}-fill`))
        this.map.removeLayer(`${mapLayerId}-fill`)

      this.map.addLayer({
        id: `${mapLayerId}-fill`,
        type: 'fill',
        source: mapSourceId,
        layout: {
          // visibility: this.highlight ? 'visible' : 'none',
        },
        paint: {
          'fill-color': this.color,
          'fill-opacity': 0.3,
        },
        filter: ['==', '$type', 'Polygon'],
      })

      if (this.map.getLayer(`${mapLayerId}-circle`))
        this.map.removeLayer(`${mapLayerId}-circle`)

      this.map.addLayer({
        id: `${mapLayerId}-circle`,
        type: 'circle',
        source: mapSourceId,
        paint: {
          'circle-radius': {
            base: 1.75,
            stops: [
              [9, 2],
              [12, 4],
              [22, 180],
            ],
          },
          'circle-color': this.color,
          'circle-opacity': 0.3,
        },
        filter: ['==', '$type', 'Point'],
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
