<template>
  <section class="packager">
    <PreviewLayers
      class="pLayers"
      :layers="pLayers"
      :bbox.sync="bbox"
      :fit-bounds="fitBounds"
      :highlight-id="String(highlightLayer.layerId)"
      :moveable="true"
      :padding="{ bottom: 150 + 30 }"
    />

    <SideLayerList
      :layers.sync="layers"
      :fit-bounds.sync="fitBounds"
      :search.sync="search"
      :highlight.sync="highlightLayer"
      :f-layers="listLayer"
      name-attr="userLayerName"
      :disable-show-all="true"
      selected-attr="selected"
      :layer-list-height="layerListHeight"
    >
      <template v-slot:info="infoSlotProp" tag="span">
        <span v-if="!hasSiteLayer"> Pick </span>
        <p v-else-if="siteLayerId === infoSlotProp.layer.layerId">Base</p>
        <p v-else-if="infoSlotProp.layer.selected" class="info-selected">
          Selected
        </p>
        <p v-else>Select</p>
      </template>

      <template v-slot:action="actionSlotProp" tag="span">
        <span v-if="!hasSiteLayer" @click="setSiteLayer(actionSlotProp.layer)">
          Pick
        </span>
        <span v-else>
          <span
            v-if="!actionSlotProp.layer.selected"
            @click="selectDataLayer(actionSlotProp.layer)"
          >
            Select
          </span>

          <span v-else @click="selectDataLayer(actionSlotProp.layer)">
            Unselect
          </span>
        </span>
      </template>
    </SideLayerList>

    <div ref="guide" class="guide">
      <div class="top">
        <!-- <div style="float: left; width: 50px; transform: scale(1.5, 1);"> -->
        <div style="float: left; width: 50px;">
          <a-icon
            v-if="!hasSiteLayer"
            type="down"
            style="transform: scale(1.5, 1);"
          />
          <a-icon v-else type="left" style="transform: scale(1, 1.5);" />
        </div>
        <p v-if="!hasSiteLayer">1 - Pick a Base Layer</p>
        <p v-else>2 - Select Data Layers, and Edit Package</p>
      </div>

      <div v-if="hasSiteLayer" class="bottom">
        <div class="layers">
          <span>
            <fa-icon icon="layer-group" />
            Layers
          </span>
          <div v-if="hasSiteLayer">
            <label> Base Layer </label>
            <a-popconfirm
              placement="topLeft"
              ok-text="Yes"
              cancel-text="No"
              @confirm="reset"
            >
              <template slot="title">
                <span>
                  <!-- Reset the base layer, will also unselect all data layers. -->
                  Will unselect all data layers.
                </span>
              </template>
              <!-- <a-button size="small"> reset</a-button> -->
              <span class="reset">
                reset
              </span>
            </a-popconfirm>
            <p class="baseLayer">
              <!-- {{ siteLayer.layerId }} : -->
              {{ siteLayer.userLayerName }}
            </p>

            <label> Data Layer: </label>
            <p v-if="!selectedDataLayers.length">
              Please select data layer
            </p>
            <p v-else>
              <b>{{ selectedDataLayers.length }}</b>
              <i>data layers.</i>
            </p>
          </div>
        </div>

        <div class="edit">
          <a-form layout="vertical" class="form">
            <a-form-item>
              <span slot="label">
                <!-- <a-icon type="highlight" /> -->
                Name
              </span>
              <a-input
                v-model="siteName"
                v-decorator="[
                  'package name',
                  {
                    rules: [
                      { required: true, message: 'Please input package name' },
                    ],
                  },
                ]"
                size="small"
                placeholder="Please input package name"
              />
            </a-form-item>
            <a-form-item>
              <span slot="label">
                <!-- <a-icon type="form" /> -->
                Buffer Radius
                <a-select
                  v-model="siteRadiusUnit"
                  size="small"
                  style="width: fit-content; font-size: smaller;"
                  :dropdown-match-select-width="false"
                >
                  <a-icon slot="suffixIcon" type="radius-setting" />
                  <a-select-option value="meters">(meters)</a-select-option>
                  <a-select-option value="feet">(feet)</a-select-option>
                </a-select>
              </span>
              <a-row :gutter="8">
                <a-col :span="18">
                  <a-slider v-model="siteRadius" />
                </a-col>
                <a-col :span="6">
                  <a-input-number
                    v-model="siteRadius"
                    size="small"
                    :min="1"
                    :max="100"
                    width="50"
                  />
                </a-col>
              </a-row>
            </a-form-item>
            <!-- unused and haven't been implemented in backend. 2021 Jan 15
            <a-form-item>
              <span slot="label">
                Range of Sites (based on shape order)
              </span>
              <a-row :gutter="8">
                <a-col :span="4">
                  <a-input-number
                    v-model="siteRange[0]"
                    size="small"
                    :min="1"
                    :max="100"
                    width="100%"
                  />
                </a-col>
                <a-col :span="16">
                  <a-slider
                    range
                    :default-value="[20, 50]"
                    v-model="siteRange"
                  />
                </a-col>
                <a-col :span="2">
                  <a-input-number
                    v-model="siteRange[1]"
                    size="small"
                    :min="1"
                    :max="100"
                    width="100%"
                  />
                </a-col>
              </a-row>
            </a-form-item>
            <a-form-item>
              <a-row :gutter="8">
                <a-col :span="12"> Choose Projection System </a-col>
                <a-col :span="12">
                  <a-select
                    v-model="projectionSys"
                    size="small"
                    style="width: fit-content; font-size: smaller;"
                    :dropdown-match-select-width="false"
                  >
                    <a-select-option value="layer_x - EPSG:2263-1">
                      layer_x - EPSG:2263-1
                    </a-select-option>
                    <a-select-option value="layer_x - EPSG:2263-2">
                      layer_x - EPSG:2263-2
                    </a-select-option>
                    <a-select-option value="layer_x - EPSG:2263-3">
                      layer_x - EPSG:2263-3
                    </a-select-option>
                    <a-select-option value="layer_x - EPSG:2263-4">
                      layer_x - EPSG:2263-4
                    </a-select-option>
                  </a-select>
                </a-col>
              </a-row>
            </a-form-item>
            -->
            <a-form-item style="margin-bottom: 0px;">
              <a-button :disable="creating" size="small" @click="createSite">
                Create Package
              </a-button>
            </a-form-item>
          </a-form>
        </div>
      </div>
    </div>

    <!-- 

    <div class="selector">
      <h2>Selecter</h2>

      <h4>search filter:</h4>
      <a-input v-model="search" />

      <span>display: {{ fLayers.length }} / {{ layers.length }}</span>
      <a-button v-if="!hasSiteLayer" size="small" @click="showAllLayers">
        show All
      </a-button>
      <br />

      <span>
        selected: <b>{{ selectedDataLayers.length }}</b> <i>data layers.</i>
      </span>
      <span>highlightId: {{ highlightLayer.layerId }}</span>
    </div>

    <div v-if="!hasSiteLayer" class="layerList">
      <p
        v-for="layer in fLayers"
        :key="layer.id"
        class="layerName"
        @mouseenter="hoverLayerName(layer)"
        @mouseleave="hoverLayerName({})"
        @click="setSiteLayer(layer)"
      >
        {{ layer.layerId }} : {{ layer.userLayerName }}
      </p>
    </div>
    <div v-else class="layerList">
      <p
        v-for="layer in sfLayers"
        :key="layer.id"
        class="layerName"
        :class="{ selected: layer.selected }"
        @mouseenter="hoverLayerName(layer)"
        @mouseleave="hoverLayerName({})"
        @click="selectDataLayer(layer)"
      >
        {{ layer.layerId }} : {{ layer.userLayerName }}
      </p>
    </div>
      
     -->

    <SwitchSpatialQuery v-model="spatialQueryOn" />
  </section>
</template>

<script>
import { graphqlOperation } from 'aws-amplify'

import { auth, api } from '@/services/amplify'
import * as mutations from '@/graphql/mutations'

import PreviewLayers from '@/components/map/PreviewLayers'
import SideLayerList from '@/components/app/SideLayerList'
import SwitchSpatialQuery from '@/components/control/SwitchSpatialQuery'

import {
  booleanWithin,
  booleanOverlap,
  booleanEqual,
  bboxPolygon,
  featureCollection,
  bbox as getBBox,
} from '@turf/turf'
// import _ from 'lodash'

export default {
  components: {
    PreviewLayers,
    SideLayerList,
    SwitchSpatialQuery,
  },
  data() {
    return {
      layers: [],
      search: '',
      bbox: [],
      fitBounds: [],
      highlightLayer: {},
      packageName: '',
      siteLayer: {},
      siteName: '',
      siteRadius: 10,
      siteRange: [20, 50],
      siteRadiusUnit: 'meters',
      projectionSys: 'layer_x - EPSG:2263',
      layerListHeight: '100%',
      creating: false,
      spatialQueryOn: false,
    }
  },
  computed: {
    siteLayerId() {
      return this.siteLayer.layerId
    },
    hasSiteLayer() {
      return !!this.siteLayerId
    },
    pLayers() {
      return this.hasSiteLayer ? this.sLayers : this.fLayers
    },
    fLayers() {
      return this.layers
        .filter(layer => layer.userLayerName.includes(this.search))
        .filter(layer => {
          if (!this.bbox.length) return true

          if (!this.spatialQueryOn) return true

          const [[minX, minY], [maxX, maxY]] = this.bbox
          const mapBBox = bboxPolygon([minX, minY, maxX, maxY])

          const layerBBox = layer.bbox
          const within = booleanWithin(layerBBox, mapBBox)

          // console.log({ within, layerBBox, mapBBox })

          return within
        })
    },
    sfLayers() {
      // return _.sortBy(this.fLayers, ({ selected }) => ~selected)
      return this.fLayers
        .filter(layer => layer.layerId !== this.siteLayer.layerId)
        .filter(layer => {
          if (!this.spatialQueryOn) return true

          const sitelayerBBox = this.siteLayer.bbox
          const layerBBox = layer.bbox
          const intersect =
            booleanOverlap(layerBBox, sitelayerBBox) ||
            booleanEqual(layerBBox, sitelayerBBox)

          // console.log(layer.userLayerName, { intersect })

          return intersect
        })
    },
    sLayers() {
      return this.layers
        .filter(layer => layer.userLayerName.includes(this.search))
        .filter(layer => layer.layerId !== this.siteLayer.layerId)
        .filter(layer => {
          if (layer.layerId === this.siteLayer.layerId) return false

          if (!this.spatialQueryOn) return true

          const sitelayerBBox = this.siteLayer.bbox
          const layerBBox = layer.bbox
          const intersect =
            booleanOverlap(layerBBox, sitelayerBBox) ||
            booleanEqual(layerBBox, sitelayerBBox)

          // console.log(layer.userLayerName, { intersect })

          return intersect
        })
    },
    listLayer() {
      return this.hasSiteLayer ? this.sfLayers : this.fLayers
    },
    selectedDataLayers() {
      return this.layers.filter(layer => {
        return layer.selected
      })
    },
  },
  watch: {
    hasSiteLayer() {
      this.$nextTick(() => {
        this.resetListHeight()
      })
    },
  },
  async asyncData({ store, $axios, app }) {
    const id = store.state.auth.user.id
    console.log('packager gogogo')

    const layers = await store
      .dispatch('api/getLayers', { id })
      .catch(err => console.error('api/getLayers', err))

    return { layers: layers.filter(l => l.state === 'PROCESSED') }
  },
  mounted() {
    window.addEventListener('resize', this.handleWindleResize)
    this.resetListHeight()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleWindleResize)
  },
  methods: {
    // showAllLayers() {
    //   this.fitAllLayerBounds(this.layers)
    //   this.search = ''
    // },
    reset() {
      this.siteName = ''
      this.siteRadius = 10
      this.siteRadiusUnit = 'meters'
      this.layerListHeight = '100%'
      this.creating = false
      this.resetSiteLayer()
    },
    handleWindleResize() {
      this.resetListHeight()
    },
    resetListHeight() {
      if (window.innerWidth < 1350) {
        const guideDom = this.$refs.guide
        const guideHeight = guideDom.clientHeight

        this.layerListHeight = `calc(100% - ${guideHeight + 30}px)`
      } else {
        this.layerListHeight = '100%'
      }
    },
    fitAllLayerBounds(layers) {
      const layersCollection = featureCollection(layers.map(({ bbox }) => bbox))
      this.fitBounds = getBBox(layersCollection)
    },
    fitLayerBounds(layer) {
      this.fitBounds = getBBox(layer.bbox)
    },
    setSiteLayer(layer) {
      this.siteLayer = layer
      this.fitLayerBounds(layer)
    },
    resetSiteLayer() {
      this.siteLayer = {}
      this.layers.map(layer => (layer.selected = false))
      this.fitAllLayerBounds(this.layers)
      this.notifyLayersUpdate()
    },
    selectDataLayer(layer) {
      layer.selected = !layer.selected
      this.notifyLayersUpdate()
      console.log(layer.layerId, layer.selected)
    },
    notifyLayersUpdate() {
      this.layers.__ob__.dep.notify()
    },
    hoverLayerName(layer) {
      // console.log(`hoverLayerName(${layerId})`)
      this.highlightLayer = layer
    },
    async createSite() {
      if (!this.siteName) {
        this.$message.error('Please input the Package Name.', 5)
        return false
      }

      if (!this.selectedDataLayers.length) {
        if (!this.hasSiteLayer)
          this.$message.error("You haven't selected the Base Layer.", 5)
        else
          this.$message.error(
            "You haven't selected layers. Please select at least one layer.",
            5
          )
        return false
      }

      const currAuth = await auth.currentCredentials()
      const identityId = currAuth.identityId

      const userId = this.$store.state.auth.user.id

      if (!userId) return alert('Upload error. Please reload the page.')

      this.$message.info('Sending packager request !')
      this.action1()
      this.creating = true

      const input = {
        userId: userId,

        siteLayerId: this.siteLayer.layerId,
        siteFileId: this.siteLayer.fileId,

        layerIds: this.selectedDataLayers.map(({ layerId }) => layerId),
        layerFileIds: this.selectedDataLayers.map(({ fileId }) => fileId),

        name: this.siteName,

        radiusUnit: this.siteRadiusUnit,
        radius: this.siteRadius,

        progress: 0,
        state: 'CREATED',
      }

      console.log('createPkg input', input)

      const pkgId = await api
        .graphql(
          graphqlOperation(mutations.createPkg, {
            input,
          })
        )
        .then(res => {
          console.log('createSite res', res)

          this.$message.success('Start packaging your package!')
          return res.data.createPkg.id
        })
        .then(pkgId => {
          console.log('createPkg pkgId', pkgId)
          return pkgId
        })
        .catch(err => {
          console.error(err)
          this.reset()
        })
        .finally(() => {
          this.reset()

          this.creating = false
        })

      const data = JSON.stringify({
        pkgId,
      })
      console.log('createSite', data)

      const res = await api
        .graphql(
          graphqlOperation(mutations.runPackager, {
            type: 'PACK',
            userId,
            identityId,
            data,
          })
        )
        .then(res => res.data.runPackager)

      console.log('runPackager', res)
    },
    createSiteO() {
      if (!this.siteName) {
        this.$message.error('Please input the Package Name.', 5)
        return false
      }

      if (!this.selectedDataLayers.length) {
        if (!this.hasSiteLayer)
          this.$message.error("You haven't selected the Base Layer.", 5)
        else
          this.$message.error(
            "You haven't selected layers. Please select at least one layer.",
            5
          )
        return false
      }

      const datalayerIds = this.selectedDataLayers
        .map(({ layerId }) => layerId)
        .join(' ')

      this.$message.info('Sending packager request !')
      this.action1()
      this.creating = false

      this.$axios
        .$post('/api/createsite', {
          sitename: this.siteName,
          siteId: this.siteLayer.layerId,
          siteRadius: this.siteRadius,
          siteRadiusUnit: this.siteRadiusUnit,
          datalayerIds,
          selectedLayers: 'on', // legacy
          layerButton: 'compute', // legacy
        })
        .then(({ msg }) => {
          console.log('createSite', { msg })
          setTimeout(() => {
            this.$message.success('Start packaging your package!')
            this.reset()
          }, 1500)
        })
        .catch(e => {
          console.log(e.message)
          this.reset()
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.packager {
  position: relative;

  /deep/ {
    .info-selected {
      font-weight: bold;
    }
  }
}

.guide {
  position: absolute;
  width: 70%;
  margin: 0px 80%;
  padding: 1em;

  background-color: white;

  font-weight: bold;
  border-radius: 1px;
  z-index: 30;

  display: flex;
  justify-content: center;
  flex-direction: column;

  .top {
    font-size: 1.6em;
    text-align: center;
  }

  .bottom {
    padding-top: 1em;
    display: flex;

    > * {
      padding: 0px 1em;
    }
  }

  .layers {
    flex: 9;

    .baseLayer {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      width: 160px;
    }
  }
  .edit {
    flex: 16;
    // width: 400px;
  }

  label {
    font-weight: 200;
    margin-top: 0.8em;
    display: inline-block;
    vertical-align: middle;
  }

  .reset {
    font-size: 0.8em;
    margin-left: 0.4em;
    vertical-align: sub;
    text-decoration: underline;
    cursor: pointer;
  }

  p {
    margin: 0px;
    margin-left: 0.3em;
  }

  .form {
    .ant-form-item {
      margin: 0px;
      margin-bottom: 10px;
    }

    .ant-form-item-label {
      padding: 0px;
      padding-top: 10px;
    }

    .ant-input-number {
      margin-top: 0.5em;
      width: 60px;
    }

    button {
      width: 100%;
    }
  }
}

.pLayers {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
}
</style>

<style lang="scss" scoped>
.revise {
  .guide {
    width: 650px;
    left: 0px;
    top: 30px;
    right: 0px;
    margin: 0 auto;
  }
}
</style>
