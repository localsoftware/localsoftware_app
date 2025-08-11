<template>
  <div />
</template>

<script>
import {
  buffer,
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
    radius: {
      type: Number,
      required: true,
    },
    units: {
      type: String,
      default: 'meters',
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
    bufferedFeatures() {
      const bufferedFeatures = buffer(this.featureCollection, this.radius, {
        units: this.units,
        steps: 4,
      })
      console.log({ bufferedFeatures })
      return bufferedFeatures
    },
  },
  watch: {
    geometry() {
      this.setLayer()
    },
    color(color) {
      console.log(this.layerId, { color })
    },
    bufferedFeatures(bufferedFeatures) {
      this.setLayer()
    },
  },
  created() {
    console.log('[BufferedPolygon Layer created]', { feature: this.feature })

    this.setLayer()
  },
  beforeDestroy() {
    if (this.map) {
      this.clear()
    }
  },
  methods: {
    clear() {
      const mapLayerId = this.mapLayerId
      const mapSourceId = this.mapSourceId

      try {
        this.map.removeLayer(mapLayerId)
        this.map.removeSource(mapSourceId)
      } catch (e) {
        console.log('error', e.message)
      }
    },
    setLayer() {
      const mapLayerId = this.mapLayerId
      const mapSourceId = this.mapSourceId

      if (this.map.getSource(mapSourceId))
        this.map.getSource(mapSourceId).setData(this.bufferedFeatures)
      else
        this.map.addSource(mapSourceId, {
          type: 'geojson',
          data: this.bufferedFeatures,
        })

      if (this.map.getLayer(mapLayerId)) this.map.removeLayer(mapLayerId)

      this.map.addLayer({
        id: mapLayerId,
        type: 'line',
        source: mapSourceId,
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
        paint: {
          'line-color': this.color,
          'line-width': {
            base: 1.75,
            stops: [
              [3, 1],
              [5, 2],
              [9, 3],
              [18, 6],
              [22, 20],
            ],
          },
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
