<template>
  <div>
    <a-modal
      :visible="visible"
      wrap-class-name="ModalPkgLayers"
      :title="title"
      style="top: 20px;"
      :get-container="getContainer"
      :footer="null"
      :width="600"
      @cancel="clear"
    >
      <div class="layers-content">
        <div class="layers-map">
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
        </div>
        <div class="layers-list">
          <div
            v-for="(layer, idx) in layers"
            :key="layer.id"
            class="layer-item"
          >
            <!-- <label> Layer {{ idx + 1 }}: </label> -->
            <h4>Layer {{ idx + 1 }}: {{ layer.userLayerName }}</h4>
            <div v-if="layer.properties">
              <label> Properties</label>
              <p>
                <a-tag
                  v-for="(_, key) in layer.properties"
                  :key="key"
                  class="property"
                >
                  {{ key }}
                </a-tag>
              </p>
            </div>
            <div v-if="layer.description">
              <!-- <label> Description</label> -->
              <p>{{ layer.description }}</p>
            </div>
          </div>

          <!-- 
          <a-list item-layout="horizontal" :data-source="layers">
            <a-list-item slot="renderItem" slot-scope="layer">
              <a-list-item-meta :description="layer.description">
                <span slot="title" :style="{ color: layer.color }">
                  {{ layer.Datalayers[0].userLayerName }}
                </span>
                <span slot="avatar" :style="{ color: layer.color }">
                  <a-icon type="file" />
                </span>
              </a-list-item-meta>
            </a-list-item>
          </a-list>
          -->
        </div>
      </div>

      <!-- 
      <a-divider> {{ pkg.userLayerName }}</a-divider>
      <div class="detail">
        <template>
          <label> Properties</label>
          <p>
            <a-tag v-for="(_, key) in pkg.properties" :key="key">
              {{ key }}
            </a-tag>
          </p>
        </template>
        <template v-if="pkg.description">
          <label> Description</label>
          <p>{{ pkg.description }}</p>
        </template>
      </div>
      -->
    </a-modal>

    <template v-if="loaded">
      <template v-for="layer in layers">
        <LayerTypeBBox
          :key="`ltbb-${pkg.layerId}-${layer.id}`"
          :layer-id="String(layer.id)"
          :features="layer.bbox"
          :highlight="false"
          :color="pkgColor"
        />
        <LayerTypeFeatureCollection
          v-if="layersData[layer.fileId]"
          :key="`ltfc-${pkg.layerId}-${layer.fileId}`"
          :geometries="layersData[layer.fileId].geoJSON"
          :color="pkgColor"
        />
      </template>

      <LayerBufferedPolygon
        v-if="layersData[baseLayerId]"
        :key="`lbp-${pkg.layerId}-${baseLayerId}`"
        :geometries="layersData[baseLayerId].geoJSON"
        :radius="pkg.radius"
        :units="pkg.unit"
        color="#ffffff"
      />
    </template>
  </div>
</template>

<script>
import Mapbox from 'mapbox-gl-vue'
import { bbox as getBBox } from '@turf/turf'

import { Subject } from 'rxjs'
import {
  //
  filter,
  flatMap,
  mergeMap,
  tap,
  distinct,
} from 'rxjs/operators'

import { storage } from '@/services/amplify'

import LayerTypeBBox from '@/components/map/layers/TypeBBox'
import LayerTypeFeatureCollection from '@/components/map/layers/TypeFeatureCollection'
import LayerBufferedPolygon from '@/components/map/layers/BufferedPolygon'

const mapId = 'mapId-ModalPkgLayers'

export default {
  components: {
    Mapbox,
    LayerTypeBBox,
    LayerTypeFeatureCollection,
    LayerBufferedPolygon,
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
    pkg: {
      type: Object,
      default: () => ({}),
    },
  },
  subscriptions() {
    // this.loaded$ = new Subject()
    this.newPkg$ = new Subject()

    // const loaded$ = this.$watchAsObservable('loaded')

    return {
      // checkLoaded$: this.$watchAsObservable('loaded').pipe(
      //   tap(loaded => console.log('loaded$ start', { loaded }))
      // ),
      layers$: this.newPkg$.pipe(
        // skipUntil(this.loaded$),
        tap(l => console.log('layer$ start', l)),
        // pluck('newValue'),
        filter(pkg => pkg),
        tap(pkg => this.fitLayer(pkg)),
        // tap(() => (this.layerData = null)),
        flatMap(({ layerFileIds }) => layerFileIds),
        tap(t => console.log('ttt', t)),
        distinct(layerFileId => layerFileId),
        mergeMap(layerFileId => this.getLayerData(layerFileId)),
        tap(layerData => {
          this.layersData = {
            ...this.layersData,
            [layerData.id]: layerData,
          }

          console.log('this.layersData', this.layersData)
        })
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
      layersData: {},
    }
  },
  computed: {
    title() {
      const layerIds = this.pkg.layerFileIds
      const layerDataIds = Object.keys(this.layersData)
      const loadedLayer = layerIds.filter(id => layerDataIds.indexOf(id) > -1)
      const loaded = loadedLayer.length === layerIds.length

      console.log('title', { layerIds, layerDataIds })

      const loadingText = loaded
        ? ' ( ✓ loaded)'
        : ` ☛ loading geometries... (${loadedLayer.length}/${layerIds.length})`

      return `Preview Package: ${this.pkg.sitename}  ${loadingText}`
    },
    layers() {
      return this.pkg.layers
    },
    layersO() {
      return this.pkg.Datafiles.map(layer => {
        // TODO: upgrade api to read layer name directly
        const { userLayerName, properties, description } = layer.Datalayers[0]

        return {
          ...layer,
          userLayerName,
          properties,
          description,
        }
      })
    },
    pkgColor() {
      return this.pkg.color
    },
    baseLayerId() {
      return this.pkg.siteFileId
    },
    baseLayerIdO() {
      const dataLayers = this.pkg.Datafiles
      const firstDataLayerId = dataLayers && dataLayers[0].id
      const baseLayerId = this.pkg.siteDatafileId || firstDataLayerId

      return baseLayerId
    },
  },
  watch: {
    // visible() {
    //   console.log(this.pkg)
    //   this.layerName = this.pkg.userLayerName
    //   this.layerDesc = this.pkg.description
    // },
    pkg(pkg) {
      // console.log('watch', this.pkg)
      // console.log('watch', JSON.stringify(this.pkg))

      // this.setLayer(pkg)

      // if (!pkg) this.layerData = null
      this.newPkg$.next(this.pkg)
      this.getLayerData(this.baseLayerId)

      // this.fitLayer(pkg)
    },
    baseLayerId(baseLayerId) {
      const baseLayer = {
        id: baseLayerId,
      }

      this.getLayerData(baseLayer).then(layerData => {
        this.layersData = {
          ...this.layersData,
          [layerData.id]: layerData,
        }
      })
    },
  },
  mounted() {
    window.mpl = this
  },
  beforeDestroy() {
    console.log('ModalPkgLayers beforeDestroy')
  },
  methods: {
    // methods

    mapInit(map) {
      console.log('[ModalPkgLayers] mapInit()', this.mapId, { map })
      this.map = map
    },
    mapLoaded(map) {
      console.log('[ModalPkgLayers] mapLoaded()', this.mapId, { map })
      this.loaded = true

      // this.loaded$.next(true)
      this.newPkg$.next(this.pkg)
      // this.fitLayer(this.pkg)
    },
    clear() {
      this.$emit('update:visible', false)
    },
    // setLayer(pkg) {
    //   if (pkg.layerId) this.getLayerData(pkg)
    //   if (pkg.bbox) this.fitLayer(pkg)
    // },
    fitLayer(pkg) {
      const bbox = getBBox(pkg.bbox)
      const fitBoundsOptions = { padding: 50 }
      if (!this.easing) fitBoundsOptions.easing = () => 1

      this.map.fitBounds(bbox, fitBoundsOptions)
    },

    async getLayerData(layerFileId) {
      console.log('getLayerData', layerFileId)

      const path = `thumbnails/${layerFileId}.json`

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

      json.id = layerFileId

      console.log('getLayerData', json)

      return json
    },
    getLayerDataO(layer) {
      // if (!pkg) {
      //   return (this.layerData = null)
      // }
      const layerId = layer.id

      return this.$axios
        .get(`/api/getThumbnailData/${layerId}`)
        .then(res => {
          // { geoJSON, centroid, bBox }
          console.log('[ModalPkgLayers] getThumbnailData success', res)
          /*
          this.$message.success(
            '[ModalPkgLayers] getThumbnailData successfully.'
          )
          */
          // this.layerData = Object.freeze({
          //   ...res.data,
          //   color: pkg.color,
          // })
          return Object.freeze({
            ...layer,
            ...res.data,
          })
        })
        .catch(err => {
          console.error('[ModalPkgLayers] getThumbnailData error', err)
        })
    },
    // onFinish() {
    //   this.$emit('on-finish')
    // },
  },
}
</script>

<style lang="scss">
.ModalPkgLayers {
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

#mapId-ModalPkgLayers {
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

.layers-content {
  .layers-map {
    //
  }
  .layers-list {
    max-height: 200px;
    overflow-y: auto;
    padding: 1em;

    h4 {
      font-size: 1.25em;
    }

    label {
      font-size: 1em;
    }

    p {
      font-size: 0.8em;
    }

    .property {
      font-size: 0.8em;
      margin-bottom: 0.5em;
    }
  }
}

.mapboxgl-map {
  height: 100%;
  width: 100%;
}
</style>
