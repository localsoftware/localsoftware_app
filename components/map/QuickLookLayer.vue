<template>
  <div class="QuickLookLayer">
    <mapbox
      :map-options="options"
      :geolocate-control="{ show: false }"
      :scale-control="{ show: false }"
      :fullscreen-control="{ show: false }"
      :nav-control="{ show: false }"
      access-token="pk.eyJ1IjoicjA0NTIxNTE3IiwiYSI6ImNqdjhmMnF0ZDBmMmc0NHF5b2I1NXVqa28ifQ.I5XN52YAZSMSmV1qoRaQ9A"
      @map-init="mapInit"
      @map-load="mapLoaded"
    />

    <template v-if="loaded">
      <LayerTypeBBox
        v-if="layer.bbox"
        :layer-id="String(layer.id)"
        :features="layer.bbox"
        :highlight="true"
        :color="layer.color"
      />
    </template>
  </div>
</template>

<script>
import Mapbox from 'mapbox-gl-vue'
import { bbox as getBBox } from '@turf/turf'

import LayerTypeBBox from '@/components/map/layers/TypeBBox'

const mapId = 'mapId-QuickLook'

export default {
  name: 'QuickLookLayer',
  components: {
    Mapbox,
    LayerTypeBBox,
  },
  props: {
    center: {
      type: Array,
      default: () => [0, 0],
    },
    layer: {
      type: Object,
      default: () => {},
    },
    easing: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loaded: false,
      options: {
        center: this.center,
        style: 'mapbox://styles/mapbox/light-v9',
        container: mapId,
        zoom: 5,
        maxZoom: 8,
      },
      mapId,
    }
  },
  watch: {
    layer(layer) {
      if (layer.bbox) {
        const bbox = getBBox(layer.bbox)
        const fitBoundsOptions = { padding: 20 }
        if (!this.easing) fitBoundsOptions.easing = () => 1

        // console.log('quickLook', { layer, bbox })
        this.map.fitBounds(bbox, fitBoundsOptions)
      }
    },
  },
  beforeDestroy() {
    console.log('QuickLookLayer beforeDestroy')
  },
  methods: {
    mapInit(map) {
      console.log('mapInit()', this.mapId, { map })
      this.map = map
    },
    mapLoaded(map) {
      console.log('mapLoaded()', this.mapId, { map })
      this.loaded = true
    },
  },
}
</script>

<style lang="scss" scoped>
.QuickLookLayer {
  width: 100%;
  height: 100%;
}

.mapboxgl-map {
  height: 100%;
  width: 100%;
}
</style>
