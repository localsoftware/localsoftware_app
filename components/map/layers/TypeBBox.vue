<template>
  <div />
</template>

<script>
import Color from 'color'
const baseColor = Color.hsl(0, 60, 60)
const randomColor = baseColor.rotate(~~(Math.random() * 360)).hex()

export default {
  name: 'TypeBBox',
  props: {
    layerId: {
      type: String,
      required: true,
    },
    features: {
      type: Object,
      required: true,
    },
    highlight: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: randomColor,
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
  },
  watch: {
    highlight(n, o) {
      // console.log({ highlight: n })
      // if (n !== o)
      //   this.map.setLayoutProperty(
      //     `${this.layerId}-fill`,
      //     'visibility',
      //     this.highlight ? 'visible' : 'none'
      //   )

      if (n !== o)
        this.map.setPaintProperty(
          `${this.mapLayerId}-fill`,
          'fill-opacity',
          this.highlight ? 0.3 : 0
        )
    },
    color(color) {
      console.log(this.layerId, { color })
    },
  },
  created() {
    // console.log('[TypeBBox Layer Mounted]', this.layerId, this.features)

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
        // this.map.off('mouseenter', this.layerId)
        // this.map.off('mouseleave', this.layerId)
        this.map.removeLayer(`${mapLayerId}-line`)
        this.map.removeLayer(`${mapLayerId}-fill`)

        this.map.removeSource(mapSourceId)
      } catch (e) {
        // console.log('error', e.message)
      }
    },
    setLayer() {
      const mapLayerId = this.mapLayerId
      const mapSourceId = this.mapSourceId

      if (this.map.getSource(mapSourceId))
        this.map.getSource(mapSourceId).setData(this.features)
      else
        this.map.addSource(mapSourceId, {
          type: 'geojson',
          data: this.features,
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
          // 'fill-opacity': 0.3,
          'fill-opacity': this.highlight ? 0.3 : 0,
        },
      })

      if (this.map.getLayer(`${mapLayerId}-line`))
        this.map.removeLayer(`${mapLayerId}-line`)

      this.map.addLayer({
        id: `${mapLayerId}-line`,
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
