<template>
  <div class="PreviewBBox" style="display: unset;">
    <mapbox
      :map-options="options"
      :geolocate-control="{
        show: true,
        position: 'top-right',
      }"
      :scale-control="{
        show: true,
        position: 'bottom-left',
      }"
      :fullscreen-control="{
        show: false,
        position: 'top-right',
      }"
      :nav-control="{
        show: false,
      }"
      @map-init="mapInit"
      @map-load="mapLoaded"
      @map-moveend="areaUpdated"
      access-token="pk.eyJ1IjoicjA0NTIxNTE3IiwiYSI6ImNqdjhmMnF0ZDBmMmc0NHF5b2I1NXVqa28ifQ.I5XN52YAZSMSmV1qoRaQ9A"
    />

    <template v-if="loaded">
      <LayerTypeBBox
        v-for="layer in layers"
        :key="layer.id"
        :layer-id="String(layer.id)"
        :features="layer.bbox"
        :highlight="highlightId == layer.layerId"
        :color="layer.color"
      />

      <!-- 
      <LayerTypeFeatureCollection
        v-if="highlightLayerData"
        :geometries="highlightLayerData.geoJSON"
        :color="highlightLayerData.color"
      />
      -->
    </template>
  </div>
</template>

<script>
import Mapbox from 'mapbox-gl-vue'

import { asyncScheduler } from 'rxjs'
import { pluck, throttleTime, tap } from 'rxjs/operators'

import LayerTypeBBox from '@/components/map/layers/TypeBBox'
// import LayerTypeFeatureCollection from '@/components/map/layers/TypeFeatureCollection'

const mapId = 'mapId'

// eslint-disable-next-line no-undef
const navControl = process.client ? new mapboxgl.NavigationControl() : {}

export default {
  name: 'PreviewBBox',
  components: {
    Mapbox,
    LayerTypeBBox,
    // LayerTypeFeatureCollection,
  },
  props: {
    center: {
      type: Array,
      default: () => [-71.96091592947357, 41.669210763993476],
    },
    bbox: {
      type: Array,
      default: () => [],
    },
    layers: {
      type: Array,
      default: () => [],
    },
    fitBounds: {
      type: Array,
      default: () => [],
    },
    highlightId: {
      type: String,
      default: '',
    },
    moveable: {
      type: Boolean,
      default: false,
    },
    hoveredLayers: {
      type: Array,
      default: () => [],
    },
    padding: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      loaded: false,
      options: {
        center: this.center,
        // style: 'mapbox://styles/mapbox/light-v9',
        // style: 'mapbox://styles/mapbox/dark-v9',
        style: 'mapbox://styles/r04521517/cjxbw8sqs4be41cl9fj95ldpf',
        container: mapId,
        zoom: 5,
        maxZoom: 18,
      },
      mapId,
      point: {},
      // highlightLayerData: null,
    }
  },
  /*
  computed: {
    highlightLayer() {
      const highlightLayer = this.layers.find(
        ({ layerId }) => layerId === this.highlightId
      )
      return Object.freeze(highlightLayer)
    },
  },
  */
  subscriptions() {
    return {
      hoveredLayers$: this.$watchAsObservable('point').pipe(
        pluck('newValue'),
        throttleTime(100, asyncScheduler, { leading: true, trailing: true }),
        tap(point => this.getHoveredLayers(point))
      ),
    }
  },
  watch: {
    fitBounds(bbox) {
      if (bbox.length === 0) return

      const defaultPedding = 100
      const padding = Object.assign(
        {
          top: defaultPedding,
          bottom: defaultPedding,
          left: defaultPedding,
          right: defaultPedding,
        },
        this.padding
      )

      try {
        this.map.fitBounds(bbox, {
          padding: padding || 100,
        })
      } catch (err) {
        console.warn(err.message)
      }
    },
    moveable(moveable) {
      const setting = moveable ? 'enable' : 'disable'

      try {
        this.map.scrollZoom[setting]()
        this.map.boxZoom[setting]()
        this.map.doubleClickZoom[setting]()
        this.map.touchZoomRotate[setting]()
        this.map.dragPan[setting]()
        this.map.keyboard[setting]()

        if (moveable) this.map.addControl(navControl, 'top-right')
        else this.map.removeControl(navControl)
      } catch (err) {
        console.error(err.message)
      }
    },
    /*
    highlightLayer(highlightLayer) {
      if (!highlightLayer) {
        return (this.highlightLayerData = null)
      }
      const highlightId = highlightLayer.layerId

      return this.$axios
        .get(`/api/getThumbnailData/${highlightId}`)
        .then(res => {
          // { geoJSON, centroid, bBox }
          console.log('getThumbnailData success', res)
          this.$message.success('getThumbnailData successfully.')
          this.highlightLayerData = Object.freeze({
            ...res.data,
            color: highlightLayer.color,
          })
        })
        .catch(err => {
          console.error('getThumbnailData error', err)
          this.$message.error('getThumbnailData failed.' + err.message, 5)
        })
    },
    */
  },
  beforeDestroy() {
    console.log('PreviewLayers beforeDestroy')

    try {
      this.map.off('mousemove', this.mousemove)
      this.map.off('click', this.handleClick)
    } catch (e) {
      // console.log('error', e.message)
    }
  },
  methods: {
    mapInit(map) {
      console.log('mapInit()', this.mapId, { map })
      this.map = map
    },
    mapLoaded(map) {
      console.log('mapLoaded()', this.mapId, { map })
      this.loaded = true

      this.map.on('mousemove', this.mousemove)
      this.map.on('click', this.handleClick)

      this.map.addControl(navControl, 'top-right')
    },
    areaUpdated(map, event) {
      // event 'zoomend' would also trigger 'moveend'.
      const zoom = ~~map.getZoom()
      const center = map.getCenter().toArray()
      this.updateBounds()

      console.log(
        `areaUpdated ${event.type}`,
        { map, event },
        `zoom: ${zoom}`,
        `center: ${center}`
      )
    },
    updateBounds() {
      const bbox = this.map.getBounds() // return [LngLatBounds](https://docs.mapbox.com/mapbox-gl-js/api/#lnglatbounds)
      this.$emit('update:bbox', Object.freeze(bbox.toArray()))
    },
    mousemove(e) {
      this.point = e.point
    },
    getHoveredLayers(point) {
      const features = this.map.queryRenderedFeatures(point, {
        filter: ['has', 'isLC'],
      })

      if (features.length) this.map.getCanvas().style.cursor = 'pointer'
      else this.map.getCanvas().style.cursor = ''

      this.$emit('update:hoveredLayers', Object.freeze(features))
      return features
    },
    handleClick(e) {
      this.$emit('click', e)
    },
  },
}
</script>

<style lang="scss" scoped>
.PreviewBBox {
  width: 100%;
  height: 100%;
  background-color: #191b1b;
}

#mapId {
  height: 100%;
  width: 100%;
}
</style>
