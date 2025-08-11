<template>
  <div>
    <a-modal
      :visible="visible"
      :title="title"
      :get-container="getContainer"
      :footer="null"
      :width="600"
      @cancel="clear"
      wrap-class-name="ModalLayerInfo"
      style="top: 20px;"
    >
      <!-- <div :id="mapId"></div> -->

      <mapbox
        :map-options="options"
        :geolocate-control="{ show: false }"
        :scale-control="{ show: false }"
        :fullscreen-control="{ show: false }"
        :nav-control="{ show: false }"
        @map-init="mapInit"
        @map-load="mapLoaded"
        access-token="pk.eyJ1IjoicjA0NTIxNTE3IiwiYSI6ImNqdjhmMnF0ZDBmMmc0NHF5b2I1NXVqa28ifQ.I5XN52YAZSMSmV1qoRaQ9A"
      />

      <a-divider> {{ layer ? layer.userLayerName : null }}</a-divider>
      <div class="detail">
        <template v-if="layer.properties">
          <label> Properties</label>
          <p>
            <a-tag v-for="(_, key) in layer.properties" :key="key">
              {{ key }}
            </a-tag>
          </p>
        </template>
        <template v-if="layer.description">
          <!-- <label> Description</label> -->
          <p>{{ layer.description }}</p>
        </template>
      </div>
    </a-modal>

    <template v-if="loaded">
      <LayerTypeBBox
        v-if="layer.bbox && visible"
        :layer-id="String(layer.layerId)"
        :features="layer.bbox"
        :highlight="!layerData"
        :color="layer.color"
      />

      <LayerTypeFeatureCollection
        v-if="layerData && visible"
        :geometries="layerData.geoJSON"
        :color="layerData.color"
      />
    </template>
  </div>
</template>

<script>
import Mapbox from 'mapbox-gl-vue'
import { bbox as getBBox } from '@turf/turf'

import { Subject } from 'rxjs'
import { filter, switchMap, tap } from 'rxjs/operators'

/*
import { graphqlOperation } from 'aws-amplify'
import { api } from '@/services/amplify'
import * as queries from '@/graphql/queries'
*/

import { storage } from '@/services/amplify'

import LayerTypeBBox from '@/components/map/layers/TypeBBox'
import LayerTypeFeatureCollection from '@/components/map/layers/TypeFeatureCollection'

const mapId = 'mapId-ModalLayerInfo'

export default {
  components: {
    Mapbox,
    LayerTypeBBox,
    LayerTypeFeatureCollection,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    getContainer: {
      type: Function,
      default: () => document.body,
    },
    layer: {
      type: Object,
      default: () => ({}),
    },
  },
  subscriptions() {
    // this.loaded$ = new Subject()
    this.newLayer$ = new Subject()

    // const loaded$ = this.$watchAsObservable('loaded')

    return {
      // checkLoaded$: this.$watchAsObservable('loaded').pipe(
      //   tap(loaded => console.log('loaded$ start', { loaded }))
      // ),
      layers$: this.newLayer$.pipe(
        // skipUntil(this.loaded$),
        tap(l => console.log('layer$ start', l)),
        // pluck('newValue'),
        filter(layer => layer),
        tap(() => (this.layerData = null)),
        tap(layer => this.fitLayer(layer)),
        switchMap(layer => this.getLayerData(layer)),
        tap(layerData => (this.layerData = layerData))
      ),
    }
  },
  data() {
    return {
      // loaded$: null,
      // editing: false,
      // deleteing: false,
      //
      // layerName: '',
      // layerDesc: '',
      // map
      easing: false,
      loaded: false,
      options: {
        center: [0, 0],
        style: 'mapbox://styles/r04521517/cjxbw8sqs4be41cl9fj95ldpf',
        container: mapId,
        zoom: 5,
        maxZoom: 20,
      },
      mapId,
      layerData: null,
    }
  },
  computed: {
    title() {
      const loadingText = this.layerData ? '' : ' ( loading geometries... )'

      return `Layer Data ${loadingText}`
    },
  },
  watch: {
    // visible() {
    //   console.log(this.layer)
    //   this.layerName = this.layer.userLayerName
    //   this.layerDesc = this.layer.description
    // },
    layer(layer) {
      console.log('watch', this.layer)

      // this.setLayer(layer)

      // if (!layer) this.layerData = null
      this.newLayer$.next(this.layer)
    },
  },
  beforeDestroy() {
    console.log('ModalLayerInfo beforeDestroy')
  },
  methods: {
    // methods

    mapInit(map) {
      console.log('[ModalLayerInfo] mapInit()', this.mapId, { map })
      this.map = map
    },
    mapLoaded(map) {
      console.log('[ModalLayerInfo] mapLoaded()', this.mapId, { map })
      this.loaded = true

      // this.loaded$.next(true)
      this.newLayer$.next(this.layer)
    },
    clear() {
      this.$emit('update:visible', false)
    },
    setLayer(layer) {
      if (layer.layerId) this.getLayerData(layer)
      if (layer.bbox) this.fitLayer(layer)
    },
    fitLayer(layer) {
      const bbox = getBBox(layer.bbox)
      const fitBoundsOptions = { padding: 50 }
      if (!this.easing) fitBoundsOptions.easing = () => 1

      this.map.fitBounds(bbox, fitBoundsOptions)
    },
    async getLayerData(layer) {
      console.log('getLayerData', layer)

      const path = `thumbnails/${layer.fileId}.json`

      const res = await storage.get(path, {
        level: 'private', // defaults to public
        download: true, // defaults to false
        // expires?: number, // validity of the URL, in seconds. defaults to 900 (15 minutes)
        // contentType?: string // set return content type, eg "text/html"
      })

      const json = await res.Body.text().then(string => {
        // handle the String data return String
        return JSON.parse(string)
      })

      json.color = layer.color

      console.log('getLayerData', json)

      return json
    },
    getLayerDataO(layer) {
      // if (!layer) {
      //   return (this.layerData = null)
      // }

      /*
      console.log('getLayerData', layer.layerId)

      const res = await api
        .graphql(
          graphqlOperation(queries.serveData, {
            type: 'thumbnail',
            payload: JSON.stringify({
              id: layer.layerId,
            }),
          })
        )
        .then(res => res.data)
      */

      const layerId = layer.layerId

      /*
      console.log('getLayerData', layerId)

      const thumbnailData = await api
        .get('db', `/rds/getThumbnailData/${layerId}`)
        .catch(err => console.error(err))

      console.log('thumbnailData', thumbnailData)
      return thumbnailData
      */

      return this.$axios
        .get(`/api/getThumbnailData/${layerId}`)
        .then(res => {
          // { geoJSON, centroid, bBox }
          console.log('[ModalLayerInfo] getThumbnailData success', res)
          /*
          this.$message.success(
            '[ModalLayerInfo] getThumbnailData successfully.'
          )
          */
          // this.layerData = Object.freeze({
          //   ...res.data,
          //   color: layer.color,
          // })
          return Object.freeze({
            ...res.data,
            color: layer.color,
          })
        })
        .catch(err => {
          console.error('[ModalLayerInfo] getThumbnailData error', err)
        })
    },
    // onFinish() {
    //   this.$emit('on-finish')
    // },
  },
}
</script>

<style lang="scss">
.ModalLayerInfo {
  .ant-modal-body {
    padding: 5px;
  }
}
</style>

<style lang="scss" scoped>
// .PreviewBBox {
//   width: 100%;
//   height: 100%;

//   background-color: #191b1b;
// }

#mapId-ModalLayerInfo {
  height: 350px;
  width: 100%;
}

.detail {
  max-height: 150px;
  overflow-y: auto;

  > label {
    margin-left: 0.25em;
    font-size: 1.25em;
    text-decoration: underline;
  }
}

.mapboxgl-map {
  height: 100%;
  width: 100%;
}
</style>
