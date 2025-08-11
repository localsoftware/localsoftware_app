<template>
  <section class="packages">
    <PreviewLayers
      class="pLayers"
      :layers="fPkgs"
      :bbox.sync="bbox"
      :fit-bounds="fitBounds"
      :highlight-id="String(highlightPkg.id)"
      :hovered-layers.sync="hoveredLayers"
      :padding="{ bottom: tableHeight + 30 }"
      @click="clickMap"
    />

    <SideLayerList
      :layers.sync="packages"
      :fit-bounds.sync="fitBounds"
      :search.sync="search"
      :highlight.sync="highlightPkg"
      :f-layers="fPkgs"
      :show-list="!selectedPkgs.length"
      name-attr="name"
      @onLayerCtxMenu="deletePkg"
      @onLayerDelete="deletePkg"
    >
      <template v-slot:info="infoSlotProp" tag="span">
        <p class="count">
          <fa-icon icon="layer-group" />
          <span>{{ infoSlotProp.layer.layerIds.length }}</span>
        </p>
        <p class="area">
          <a-icon type="border-inner" />
          <span>{{ infoSlotProp.layer.area }} </span>
        </p>
      </template>
      <template v-slot:action="actionSlotProp" tag="span">
        <a-icon
          v-if="actionSlotProp.layer.state === 'PROCESSED'"
          type="cloud-download"
          @click="download(actionSlotProp.layer)"
        />
        <fa-icon
          icon="layer-group"
          style="font-size: 0.8em;"
          @click="viewPkg(actionSlotProp.layer)"
        />

        <a-icon type="edit" @click="editPackage(actionSlotProp.layer)" />
        <a-icon
          type="zoom-in"
          @click="actionSlotProp.fitLayerBounds(actionSlotProp.layer)"
        />
      </template>
    </SideLayerList>

    <div
      class="selectedPkgs"
      :class="{ selected: showTable }"
      :style="{ '--max-height': `${tableHeight}px` }"
    >
      <a-table
        v-if="showTable"
        :columns="columns"
        :row-key="site => site.id"
        :data-source="fPkgs"
        size="small"
        :show-header="false"
        :pagination="false"
        :custom-row="
          record => ({
            on: {
              mouseenter: () => (highlightPkg = Object.freeze(record)), // mouse enter row
              mouseleave: () => (highlightPkg = {}), // mouse leave row
            },
          })
        "
      >
        <template slot="name" slot-scope="{ name, color }">
          <span class="cell-name">
            <a-icon type="file" :style="{ color }" />
            <span> {{ name }} </span>
          </span>
        </template>

        <template slot="layers" slot-scope="pkg">
          <span class="cell-layers" @click="viewPkg(pkg)">
            <fa-icon icon="layer-group" />
            {{ pkg.layerIds.length }}
          </span>
        </template>

        <template slot="area" slot-scope="area">
          <a-icon type="border-inner" />
          <span> {{ area }} km² </span>
        </template>
        <template slot="date" slot-scope="date">
          <a-icon type="calendar" />
          <span>
            {{ new Date(date).toLocaleDateString() }}
          </span>
        </template>
        <template slot="operation" slot-scope="pkg">
          <span class="cell-operation" @click="editPackage(pkg)">
            <a-icon type="form" />
            <a-icon type="delete" />
          </span>
        </template>
        <template slot="download" slot-scope="pkg">
          <span class="cell-download">
            <a-icon
              v-if="pkg.state === 'PROCESSED'"
              type="cloud-download"
              @click="download(pkg)"
            />
            <a-icon v-else-if="pkg.state === 'FAILED'" type="warning" />
            <a-icon v-else type="loading" />
          </span>
        </template>
      </a-table>
    </div>

    <SwitchSpatialQuery v-model="spatialQueryOn" />

    <LayersSummary v-if="!selectedPkgs.length" :layers="hoveredLayers">
      Click To Show
    </LayersSummary>

    <ModalDownloadPackage
      :download-id.sync="downloadId"
      :get-container="getContainer"
      :download-name.sync="downloadName"
    />
    <ModalEditPackage
      :visible.sync="editing"
      :pkg="editingPkg"
      :get-container="getContainer"
      @on-finish="updatePackages"
    />

    <ModalPkgLayers
      v-if="viewingPkg"
      :visible.sync="viewing"
      :pkg="viewingPkg"
      :get-container="getContainer"
    />
  </section>
</template>

<script>
import {
  booleanWithin,
  bboxPolygon,
  featureCollection,
  bbox as getBBox,
} from '@turf/turf'
// import _ from 'lodash'

import { graphqlOperation } from 'aws-amplify'

import { api } from '@/services/amplify'
import * as mutations from '@/graphql/mutations'

import PreviewLayers from '@/components/map/PreviewLayers'
import SideLayerList from '@/components/app/SideLayerList'
import LayersSummary from '@/components/map/LayersSummary'
import ModalDownloadPackage from '@/components/app/ModalDownloadPackage'
import ModalEditPackage from '@/components/app/ModalEditPackage'
import ModalPkgLayers from '@/components/app/ModalPkgLayers'

import SwitchSpatialQuery from '@/components/control/SwitchSpatialQuery'

const columns = [
  // {
  //   title: 'ID',
  //   dataIndex: 'id',
  //   defaultSortOrder: 'ascend',
  // },
  {
    title: 'Name',
    scopedSlots: { customRender: 'name' },
    width: 200,
  },
  {
    title: 'Layers',
    // dataIndex: 'Datafiles',
    scopedSlots: { customRender: 'layers' },
  },
  {
    title: 'Area',
    dataIndex: 'area',
    scopedSlots: { customRender: 'area' },
  },
  // {
  //   title: 'Processed',
  //   dataIndex: 'processed',
  //   scopedSlots: { customRender: 'boolean' },
  // },
  // {
  //   title: 'Deleted',
  //   dataIndex: 'deleted',
  //   scopedSlots: { customRender: 'boolean' },
  // },
  // {
  //   title: 'Status',
  //   dataIndex: 'progress.status',
  // },
  // {
  //   title: 'Percentage',
  //   dataIndex: 'progress.percentage',
  // },
  // {
  {
    title: 'createdAt',
    dataIndex: 'createdAt',
    // sorter: true,
    // sortOrder: 'ascend',
    // defaultSortOrder: 'ascend',
    scopedSlots: { customRender: 'date' },
  },
  {
    title: 'Operation',
    scopedSlots: { customRender: 'operation' },
  },
  {
    title: 'Download',
    // dataIndex: 'id',
    scopedSlots: { customRender: 'download' },
  },
]

export default {
  components: {
    PreviewLayers,
    SideLayerList,
    LayersSummary,
    ModalDownloadPackage,
    ModalEditPackage,
    ModalPkgLayers,
    SwitchSpatialQuery,
  },
  data() {
    return {
      search: '',
      packages: [],
      bbox: [],
      fitBounds: [],
      highlightPkg: {},
      columns,
      pickedPkg: {},
      hoveredLayers: [],
      focusing: false,
      selectedPkgs: [],
      showTable: false,
      tableHeight: 200,
      downloadId: '',
      downloadName: '',
      editing: false,
      editingPkg: {},
      viewing: false,
      viewingPkg: null,
      spatialQueryOn: false,
    }
  },
  computed: {
    fPkgs() {
      const packages = [...this.packages]

      return packages
        .reverse()
        .map(pkg => ({ ...pkg, d: pkg.id }))
        .filter(pkg => pkg.name.includes(this.search))
        .filter(pkg => {
          if (!this.bbox.length) return true

          if (!this.spatialQueryOn) return true

          const [[minX, minY], [maxX, maxY]] = this.bbox
          const mapBBox = bboxPolygon([minX, minY, maxX, maxY])

          const layerBBox = pkg.bbox
          const within = booleanWithin(layerBBox, mapBBox)

          // console.log({ within, layerBBox, mapBBox })

          return within
        })
    },
  },
  watch: {
    // watch
    bbox(n, o) {
      const changed = n.flat().toString() !== o.flat().toString()

      if (changed) {
        if (this.focusing) this.focusing = false
        else this.selectedPkgs = []
      }

      if (this.selectedPkgs.length) this.showTable = true
      else this.showTable = false
    },
    highlightPkg(highlightPkg) {
      if (highlightPkg.id) this.hoveredLayers = []
    },
  },
  async asyncData({ store, $axios, app }) {
    console.log('packages gogogo')

    const userId = store.state.auth.user.id

    const packages = await store
      .dispatch('api/getPkgs', { userId })
      .catch(err => console.error('api/getPkgs', err))

    return { packages }
  },
  created() {
    // console.log(this.packages)
  },
  mounted() {
    // this.interval = setInterval(this.updatePackages, 3000)

    const intervalUpdate = setInterval(() => {
      this.updatePackages()
    }, 5000)

    this.$once('hook:beforeDestroy', () => {
      clearInterval(intervalUpdate)
    })
  },
  beforeDestroy() {
    // clearInterval(this.interval)
  },
  methods: {
    updatePackages() {
      // console.log('updatePackages()', { pkgs: this.packages })
      const userId = this.$store.state.auth.user.id

      return this.$store
        .dispatch('api/getPkgs', { userId })
        .then(packages => {
          this.packages = packages || this.packages
        })
        .catch(err => console.error('updatePackages() api/getPkgs', err))
    },
    deletePkg(pkgId) {
      const check = confirm(`🚨 delete package`)
      console.log('deletePkg()', { pkgId })
      if (!check) return

      const input = {
        id: pkgId,
      }

      return api
        .graphql(
          graphqlOperation(mutations.deletePkg, {
            input,
          })
        )
        .then(res => {
          console.log('deletePkg res', res)
          this.$message.success('delete successfully.')

          return res.data.deletePkg.id
        })
        .catch(err => {
          console.error('deletePkg error', err)
          this.$message.error('delete failed.' + err.message, 5)
        })
    },
    clickMap() {
      console.log('click map', this.hoveredLayers)
      if (!this.hoveredLayers.length) {
        this.showTable = false
        this.selectedPkgs = []
        return
      }

      const layersCollection = featureCollection(
        this.hoveredLayers.map(layer => JSON.parse(layer.properties.bbox))
      )

      this.fitBounds = getBBox(layersCollection)

      this.selectedPkgs = Object.freeze(this.hoveredLayers)
      this.focusing = true
    },
    download(pkg) {
      console.log('package download', pkg)

      const { fileId, name } = pkg
      this.downloadId = fileId
      this.downloadName = name
    },
    downloadO(id, name) {
      console.log('package download', { id, name })

      this.downloadId = id
      this.downloadName = name
    },
    getContainer() {
      const packages = document.querySelector('.packages')
      console.log('getContainer', { packages })

      return packages
    },
    editPackage(pkg) {
      console.log('editPackage', { pkg })
      this.editingPkg = pkg
      this.editing = true
    },
    viewPkg(pkg) {
      this.viewingPkg = pkg
      this.viewing = true
    },
  },
}
</script>

<style lang="scss" scoped>
.packages {
  position: relative;
  background-color: #191b1b;
  display: flex;

  /deep/ {
    .ant-modal-wrap,
    .ant-modal-mask {
      position: absolute;
    }
  }

  /deep/ {
    .layerListInfo {
      > * {
        font-size: 0.33em;
        line-height: 1.5em;
        margin: 0;
        margin-top: 0.06em;
      }

      .area {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}

.packageList {
  $sh: 40px;
  .search {
    height: $sh;
    display: flex;

    border: 0px solid rgba(100, 121, 143, 0.122);
    border-bottom-width: 1px;

    /deep/ {
      input {
        border-width: 0px !important;
        box-shadow: none;
        border-radius: 0px;
      }
    }
  }

  .pkgItems {
    height: calc(100% - #{$sh});
    overflow-y: auto;
    overflow-x: hidden;
    user-select: none;

    .pkgItem {
      $h: 50px;
      height: $h;
      width: 100%;
      position: relative;

      background-color: white;
      padding: 5px 0px;

      font-weight: 200;
      // border: black 1px solid;
      margin: -1px 0px;

      transition: all 135ms cubic-bezier(0.4, 0, 0.2, 1);
      transition-property: box-shadow, margin;

      border-collapse: collapse;
      box-shadow: inset 0 -1px 0 0 rgba(100, 121, 143, 0.122);
      margin: 1px 0px;

      &:hover {
        box-shadow: inset 1px 0 0 #dadce0, inset -1px 0 0 #dadce0,
          0 1px 2px 0 rgba(60, 64, 67, 0.3),
          0 1px 3px 1px rgba(60, 64, 67, 0.15);
        z-index: 1;
      }

      > * {
        margin: 0px;
      }

      .name {
        width: 100%;
        position: absolute;
        padding: 0px 0.5em;
        font-size: 0.9em;

        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .layerCount {
        position: absolute;
        padding: 0.5em 1em;
        margin-left: 1.5em;

        font-size: 0.8em;
        left: 0px;
        bottom: 0px;
      }

      .createdAt {
        position: absolute;
        padding: 0.5em 1em;
        margin-right: 1.5em;

        font-size: 0.6em;
        right: 0px;
        bottom: 0px;
      }
    }
  }
}

.selectedPkgs {
  opacity: 0;
  position: absolute;
  bottom: -100px;

  transition: opacity 235ms cubic-bezier(0.4, 0, 0.2, 1),
    bottom 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
  transition-delay: 0.15s;

  background-color: white;
  border-radius: 0px;

  overflow-y: auto;

  padding: 0px;
  margin: 0% 5%;

  color: black;

  width: 90%;
  max-height: var(--max-height);
  z-index: 10;

  &.selected {
    opacity: 0.9;
    bottom: 30px;
  }

  .ant-table-wrapper {
  }

  /deep/ {
    .ant-table {
      // border-width: 0px;
    }

    .ant-table-body {
      // margin: 0px;
    }

    [class^='cell-'] > * {
      vertical-align: middle;
    }

    .cell- {
      &name > span {
        overflow: hidden;
        white-space: nowrap;
        display: inline-block;
        text-overflow: ellipsis;
        width: 160px;
      }

      &layers {
        cursor: pointer;
      }

      &operation {
        cursor: pointer;
      }

      &download {
        cursor: pointer;
      }
    }
  }
}
</style>
