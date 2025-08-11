<template>
  <div />
</template>

<script>
import { feature as Feature } from '@turf/turf'

export default {
  name: 'TypeBBox',
  props: {
    geometry: {
      type: Object,
      default: () => {},
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
    feature() {
      return Feature(this.geometry)
    },
  },
  watch: {
    geometry() {
      console.log('watch geometry', this.geometry)
      this.setLayer()
    },
    color(color) {
      console.log(this.layerId, { color })
    },
  },
  created() {
    console.log('[TypePolygon Layer created]', this.feature)

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
        this.map.removeLayer(`${mapLayerId}`)

        this.map.removeSource(mapSourceId)
      } catch (e) {
        console.log('error', e.message)
      }
    },
    setLayer() {
      const mapLayerId = this.mapLayerId
      const mapSourceId = this.mapSourceId

      if (this.map.getSource(mapSourceId))
        this.map.getSource(mapSourceId).setData(this.feature)
      else
        this.map.addSource(mapSourceId, {
          type: 'geojson',
          data: this.feature,
        })

      if (this.map.getLayer(mapLayerId)) this.map.removeLayer(mapLayerId)

      this.map.addLayer({
        id: mapLayerId,
        type: 'fill',
        source: mapSourceId,
        layout: {
          // visibility: this.highlight ? 'visible' : 'none',
        },
        paint: {
          'fill-color': this.color,
          'fill-opacity': 0.7,
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
