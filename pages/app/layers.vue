<template>
  <section ref="layers" class="layers">
    <h1>layers</h1>

    <PreviewLayers
      :layers="fLayers"
      :bbox.sync="bbox"
      :fit-bounds="fitBounds"
      :highlight-id="String(highlightLayer.layerId)"
      class="pLayers"
    />

    <SideLayerList
      :layers.sync="layers"
      :fit-bounds.sync="fitBounds"
      :search.sync="search"
      :highlight.sync="highlightLayer"
      :f-layers="fLayers"
      name-attr="userLayerName"
      @onLayerCtxMenu="deleteLayer"
      @onLayerDelete="deleteLayer"
    >
      <template v-slot:action="actionSlotProp" tag="span">
        <template v-if="actionSlotProp.layer.state === 'PROCESSED'">
          <a-icon @click="editLayer(actionSlotProp.layer)" type="edit" />
          <a-icon
            @click="actionSlotProp.fitLayerBounds(actionSlotProp.layer)"
            type="zoom-in"
          />
          <a-icon @click="viewLayer(actionSlotProp.layer)" type="ellipsis" />
        </template>
        <template v-else>
          <a-icon @click="deleteLayer(actionSlotProp.layer.id)" type="delete" />
        </template>
      </template>
    </SideLayerList>

    <SwitchSpatialQuery v-model="spatialQueryOn" />

    <div class="upload" @click="() => (uploading = true)">
      New Layer
    </div>
    <ModalUploadLayer :visible.sync="uploading" :get-container="getContainer" />
    <ModalEditLayer
      :visible.sync="editing"
      :layer="editingLayer"
      :get-container="getContainer"
      @on-finish="updateLayers"
    />
    <ModalLayerInfo
      v-if="viewingLayer"
      :visible.sync="viewing"
      :layer="viewingLayer"
      :get-container="getContainer"
    />
  </section>
</template>

<script>
import { graphqlOperation } from 'aws-amplify'

import { api } from '@/services/amplify'
import * as mutations from '@/graphql/mutations'

import PreviewLayers from '@/components/map/PreviewLayers'
import QuickLookLayer from '@/components/map/QuickLookLayer'
import ModalUploadLayer from '@/components/app/ModalUploadLayer'
import ModalEditLayer from '@/components/app/ModalEditLayer'
import ModalLayerInfo from '@/components/app/ModalLayerInfo'
import SideLayerList from '@/components/app/SideLayerList'

import SwitchSpatialQuery from '@/components/control/SwitchSpatialQuery'

import { booleanWithin, bboxPolygon } from '@turf/turf'

export default {
  components: {
    PreviewLayers,
    QuickLookLayer,
    ModalUploadLayer,
    ModalEditLayer,
    ModalLayerInfo,
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
      uploading: false,
      editing: false,
      viewing: false,
      editingLayer: {},
      viewingLayer: null,
      spatialQueryOn: false,
    }
  },
  computed: {
    fLayers() {
      return this.layers
        ? this.layers
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
        : []
    },
  },
  watch: {
    fLayers() {
      console.log('fLayers updated')
    },
  },
  async asyncData({ store, $axios, app }) {
    console.log('layer gogogo')

    const userId = store.state.auth.user.id

    const layers = await store
      .dispatch('api/getLayers', { userId })
      .catch(err => console.error('api/getLayers', err))

    console.log({ layers })

    return { layers }
  },
  mounted() {
    this.setDragEnterEvt(true)

    const intervalUpdateLayer = setInterval(() => {
      this.updateLayers()
    }, 5000)

    this.$once('hook:beforeDestroy', () => {
      clearInterval(intervalUpdateLayer)
    })
  },
  beforeDestroy() {
    this.setDragEnterEvt(false)
  },
  methods: {
    updateLayers() {
      // console.log('updateLayers()', { layers: this.layers })
      const userId = this.$store.state.auth.user.id

      return this.$store
        .dispatch('api/getLayers', { userId })
        .then(layers => {
          this.layers = layers || this.layers
        })
        .catch(err => console.error('updateLayers() api/getLayers', err))
    },
    getContainer() {
      // return this.$refs.layers
      const layers = document.querySelector('.layers')
      console.log('getContainer', { layers })
      return layers
    },
    editLayer(layer) {
      this.editingLayer = layer
      this.editing = true
    },
    deleteLayer(layerId) {
      const check = confirm(`🚨 delete layer`)
      console.log('deleteLayer()', { layerId })
      if (!check) return

      const input = {
        id: layerId,
      }

      return api
        .graphql(
          graphqlOperation(mutations.deleteLayer, {
            input,
          })
        )
        .then(res => {
          console.log('deleteLayer res', res)
          this.$message.success('delete successfully.')

          return res.data.deleteLayer.id
        })
        .catch(err => {
          console.error('deleteLayer error', err)
          this.$message.error('delete failed.' + err.message, 5)
        })
    },
    viewLayer(layer) {
      this.viewingLayer = layer
      this.viewing = true
    },
    setDragEnterEvt(set) {
      if (set) window.ondragenter = () => (this.uploading = true)
      else window.ondragenter = null
    },
  },
}
</script>

<style lang="scss" scoped>
.layers {
  position: relative;

  /deep/ {
    .ant-modal-wrap,
    .ant-modal-mask {
      position: absolute;
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

.upload {
  position: absolute;
  right: 50px;
  bottom: 50px;
  // font-family: 'Nunito', sans-serif;
  font-size: 1rem;
  line-height: 30px;
  height: 30px;
  text-align: center;
  width: 160px;
  color: white;
  border-radius: 10px;
  background-color: #646100;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.15);

  cursor: pointer;
  user-select: none;
  transition: background-color 0.3s, transform 0.15s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.4);
    transform: scale(1.05);
  }
}
</style>
