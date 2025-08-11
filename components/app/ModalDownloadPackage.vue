<template>
  <a-modal
    :visible="downloadId.length > 0"
    class="DownloadModal"
    title="Download Site Package"
    :get-container="getContainer"
    :footer="null"
    width="380px"
    @cancel="close"
  >
    <!-- <p>{{ downloadId }}</p> -->
    <p style="color: red;">how to download a package....</p>

    <!-- TBD
    <a-spin :spinning="!ready">
      <label for="range">XXX? Range (unit?)</label>
      <div class="range">
        <a-input-number v-model="range[0]" size="small" />
        <a-slider v-model="range" range :min="1" :max="rangeMax" />
        <a-input-number v-model="range[1]" size="small" />
      </div>
    </a-spin>
    -->

    <!-- TBD
    <label for="link">Download Link (access token??)</label>
    <div class="link">
      <a-input v-model="link" placeholder="download link" disabled>
        <a-icon slot="prefix" type="link" />
      </a-input>
    </div>
    -->

    <label for="button">Download File (type?)</label>

    <!-- 20200514 deprecated
    <div class="button">
      <form method="post" action="/api/downloadsites">
        <input type="hidden" name="type" value="opensome" />
        <input type="hidden" name="datasiteId" :value="downloadId" />
        <input type="hidden" name="min" :value="range[0]" />
        <input type="hidden" name="max" :value="range[1]" />
        <a-button icon="download" type="primary" html-type="submit">
          Download
        </a-button>
      </form>
    </div> 
    -->

    <div class="button">
      <a-button
        type="primary"
        :icon="downloading ? 'loading' : 'download'"
        @click="download"
      >
        <template v-if="!downloading">
          Download
        </template>
        <template v-else>
          Packaging
        </template>
      </a-button>
    </div>
  </a-modal>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import JSZip from 'jszip'

import Download from 'downloadjs'

import { storage } from '@/services/amplify'

export default {
  components: {},
  props: {
    getContainer: {
      type: Function,
      default: () => document.body,
    },
    downloadId: {
      required: true,
      type: String,
    },
    downloadName: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      range: [0, 10],
      rangeMax: 10,
      ready: false,
      downloading: false,
    }
  },
  computed: {
    link() {
      if (process.client)
        return `${window.location.origin}/api/pkg-dl/${this.downloadId}`
      else return `/api/pkg-dl/${this.downloadId}`
    },
  },
  watch: {
    /* TBD
    downloadId(downloadId) {
      console.log('watch downloadID', { downloadId })
      if (downloadId === -1) return false

      this.clear()

      this.$axios
        .get(`/api/countSites/${downloadId}`)
        .then(({ data }) => {
          console.log('get countSites done', { data })
          const sitecount = data.datasiteCount - 1
          this.rangeMax = sitecount

          this.range = [0, sitecount]

          this.ready = true
        })
        .catch(err => console.error(err.message))
    },
    */
  },
  methods: {
    // methods
    download() {
      if (this.downloading) return
      this.downloading = true

      const { downloadId, downloadName } = this
      const path = `pkgs/${downloadId}.json`

      console.log('download', { downloadId, downloadName, path })

      return storage
        .get(path, {
          level: 'private', // defaults to public
          download: true, // defaults to false
          // expires?: number, // validity of the URL, in seconds. defaults to 900 (15 minutes)
          // contentType?: string // set return content type, eg "text/html"
        })
        .then(async res => {
          console.log('download s3', { res })
          const jsons = await res.Body.text().then(string => {
            return JSON.parse(string)
          })

          console.log('download success', Object.keys(jsons).length, { jsons })

          const zip = new JSZip()

          Object.entries(jsons).map(([path, json]) => {
            // console.log('zip json file', { path, json })
            zip.file(path, JSON.stringify(json))
          })

          return zip
        })
        .then(async zip => {
          const blob = await zip.generateAsync({ type: 'blob' })

          if (!this.downloading) return
          if (downloadId !== this.downloadId) return

          const filename = `[LC-Pkg] ${downloadName} (${new Date().toDateString()}).zip`
          Download(blob, filename)

          this.$message.success('download successfully.')
        })
        .catch(err => {
          console.error('download error', err)
          this.$message.error('download failed.' + err.message, 5)
        })
        .finally(() => {
          if (downloadId !== this.downloadId) return

          this.downloading = false
        })
    },
    downloadO() {
      if (this.downloading) return

      this.downloading = true

      const { downloadId, downloadName } = this
      console.log('download', { downloadId, downloadName })
      this.action1()

      const formData = new FormData()

      formData.append('datasiteId', downloadId)
      formData.append('type', 'opensome')
      formData.append('min', this.range[0])
      formData.append('max', this.range[1])

      return this.$axios
        .post(
          '/api/downloadsites',
          {
            datasiteId: downloadId,
            type: 'opensome',
            min: this.range[0],
            max: this.range[1],
          },
          // formData,
          {
            // headers: { 'Content-Type': 'multipart/form-data' },
            // headers: { 'Content-Type': undefined },
            responseType: 'blob',
          }
        )
        .then(res => {
          console.log('download success', res.data)

          const filename = `[LC-Pkg] ${downloadName} (${new Date().toLocaleDateString()}).zip`
          Download(new Blob([res.data]), filename)

          this.$message.success('download successfully.')
        })
        .catch(err => {
          console.error('download error', err)
          this.$message.error('download failed.' + err.message, 5)
        })
        .finally(() => {
          this.downloading = false
        })
    },
    clear() {
      this.ready = false
      this.downloading = false
    },
    close() {
      this.$emit('update:downloadId', '')
      this.$emit('update:downloadName', '')

      this.clear()
    },
  },
}
</script>

<style lang="scss">
.DownloadModal {
  .ant-modal-header {
    border-width: 0px;
  }

  .ant-modal-body {
    padding-top: 10px;
  }

  user-select: none;
}
</style>

<style lang="scss" scoped>
.DownloadModal {
  .ant-modal-body {
    p {
      margin: 0px;
    }
  }
}

label {
  font-weight: bold;
  color: black;
  margin-top: 1.7em;
  margin-bottom: 0.8em;
  display: block;
}

.range {
  display: flex;
  align-items: baseline;

  .ant-slider {
    flex: 10;
    margin: 0px 20px;
  }

  .ant-input-number {
    min-width: 55px;
    flex: 2;
  }
}

.link {
  /deep/ * {
    cursor: text;
  }
}

.button {
  width: 100%;
  button {
    width: 95%;
    margin-left: 2.5%;
  }
}
</style>
