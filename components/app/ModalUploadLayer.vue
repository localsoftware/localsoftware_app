<template>
  <!-- <section class="upload"> -->
  <a-modal
    :visible="visible"
    class="UploadModal"
    title="Upload Data Layer"
    :get-container="getContainer"
    :footer="null"
    width="600px"
    @cancel="clear"
  >
    <p @click="testAPI">
      Upload a Zipped Shapefile. The Zipped Shapefile should include a .shp,
      .dbf, .prj, and a .shx file.
    </p>
    <p>
      A shapefile is a format for storing geometric location with the attribute
      information for its respective georeferenced features.
      <span>
        (<a href="https://wikipedia.org/wiki/Shapefile">More on Wikipedia</a>)
      </span>
    </p>

    <div class="form">
      <a-upload-dragger
        name="file"
        :file-list="fileList"
        :remove="handleRemove"
        :before-upload="beforeUpload"
        :multiple="false"
        :show-upload-list="false"
        accept="application/zip"
        @change="newFile"
      >
        <a-spin :spinning="loading" :delay="300">
          <p class="ant-upload-drag-icon">
            <svg
              width="92"
              height="80"
              viewBox="0 0 92 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 0.98257C9.69956 0.98257 19.3991 0.99827 29.0987 0.959022C30.2037 0.955097 30.9941 1.25731 31.773 2.07759C34.7964 5.26058 37.9273 8.33761 40.9392 11.5324C41.8179 12.4626 42.7157 12.7726 43.9473 12.7687C59.9661 12.7334 75.9811 12.7451 92 12.7451C92 34.9633 92 57.1815 92 79.4036C61.3359 79.4036 30.6679 79.4036 0.0038406 79.4036C3.74701e-06 53.2646 0 27.1216 0 0.98257ZM46.0115 75.4827C59.4213 75.4827 72.8311 75.4513 86.2409 75.5259C87.8332 75.5338 88.2053 75.1531 88.2015 73.5203C88.1363 55.2309 88.1402 36.9375 88.1977 18.648C88.2016 17.0545 87.8831 16.615 86.2601 16.6228C71.5726 16.6974 56.8852 16.6503 42.1977 16.6974C41.0083 16.7013 40.1949 16.3481 39.3738 15.4846C36.3504 12.2977 33.2233 9.21283 30.1922 6.02984C29.421 5.22133 28.6574 4.87203 27.5371 4.87988C20.1933 4.9309 12.8496 4.96622 5.50592 4.86025C3.95967 4.83671 3.79849 5.3744 3.80233 6.72452C3.8407 29.0644 3.84836 51.4042 3.79081 73.7441C3.78697 75.2669 4.21288 75.522 5.58648 75.5141C19.0615 75.4592 32.5365 75.4827 46.0115 75.4827Z"
                fill="#646100"
              />
            </svg>
          </p>
          <p class="ant-upload-text">
            Click or drag a Zip file here.
          </p>
          <p class="ant-upload-hint">
            The Shapefile must be compressed to a ZIP file
            <!-- containing *.dbf, *.prj, *.shp, *.shx files. -->
          </p>
        </a-spin>
      </a-upload-dragger>
      <a-form layout="vertical" class="inputs">
        <a-form-item>
          <p slot="label">
            Layer Name
          </p>
          <a-input
            v-model="layerName"
            v-decorator="[
              'layer name',
              {
                rules: [{ required: true, message: 'Please input your name' }],
              },
            ]"
            placeholder="Please input layer name"
          />
        </a-form-item>
        <a-form-item>
          <p slot="label">
            Layer Description
          </p>
          <a-input
            v-model="layerDesc"
            type="textarea"
            rows="2"
            style="resize: none;"
            placeholder="Input layer description (optional)"
          />
        </a-form-item>
        <a-form-item>
          <p slot="label">
            File Check
            <span v-if="previewTime" class="previewTime">
              checked in {{ previewTime }} ms
            </span>
          </p>
          <a-badge
            v-for="(checked, ext) in requiredFilesCheck"
            :key="ext"
            class="checkBedges"
            :count="checked"
            :number-style="{ backgroundColor: checked == 1 ? '#52c41a' : '' }"
          >
            <a-avatar
              shape="square"
              :size="40"
              style="--bedge-height: 40px;"
              class="fileCheck required"
              :class="{ checked: checked == 1 }"
            >
              <span class="ext">
                {{ ext }}
              </span>
            </a-avatar>
          </a-badge>

          <p class="text-xs text-gray-600 pl-1">
            Total File Size Before Unzipping:
            {{ Number(totalMBSize).toFixed(2) }} MB
          </p>
          <p></p>
          <p v-if="isOverLimitSize" class="text-xs text-red-600 pl-1 pt-1">
            The Size Limit is {{ FILES_SIZE_MB_LIMIT }} MB.
            <br />
            Please Choose a Different File or Reduce the File Size
          </p>
        </a-form-item>
        <!-- <a-form-item>
          <a-button
            type="primary"
            :disabled="fileList.length === 0 || !allowUpload"
            :loading="uploading"
            style="margin-top: 16px"
            icon="upload"
            class="uploadBtn"
            @click="handleUpload"
          >
            {{ uploading ? 'Uploading' : 'Start Upload' }}
          </a-button>
          <a-progress
            :percent="progress"
            size="small"
            :status="progress == 100 ? 'success' : 'active'"
          />
        </a-form-item> -->
      </a-form>
    </div>
    <a-button
      type="primary"
      :disabled="!layerName || fileList.length === 0 || !allowUpload"
      :loading="uploading"
      style="margin-top: 16px"
      icon="upload"
      class="uploadBtn"
      @click="handleUpload"
    >
      {{ uploading ? 'Uploading' : 'Start Upload' }}
    </a-button>
    <a-progress
      :percent="progress"
      size="small"
      :status="progress == 100 ? 'success' : 'active'"
    />
  </a-modal>

  <!-- <div> -->
  <!-- 

      <a-upload
        :file-list="fileList"
        :remove="handleRemove"
        :before-upload="beforeUpload"
        :multiple="false"
        accept="application/zip"
        @change="newFile"
      >
        <a-button> <a-icon type="upload" /> Select File </a-button>
      </a-upload>
       -->

  <!-- <template v-if="previewTime"> -->
  <!--
        <p>checked in {{ previewTime }} ms</p>
        <p>Required Files</p>
           <a-badge
          v-for="(checked, filename) in requiredFilesCheck"
          :key="filename"
          :count="checked"
          :number-style="{ backgroundColor: checked == 1 ? '#52c41a' : '' }"
        >
          <a-avatar
            shape="square"
            size="large"
            class="fileCheck required"
            :class="{ checked: checked == 1 }"
          >
            {{ filename }}
          </a-avatar>
        </a-badge> 
        -->

  <!-- 

        <p>Excluded Files</p>
        <a-badge
          v-for="(checked, filename) in excludedFilesCheck"
          :key="filename"
          :count="checked"
        >
          <a-avatar
            shape="square"
            size="large"
            class="fileCheck excluded"
            :class="{ checked: checked > 0 }"
          >
            {{ filename }}
          </a-avatar>
        </a-badge>
        -->
  <!-- </template> -->
  <!-- </div> -->

  <!-- 
    <h4 v-show="previewFiles.length">Preview Zip files</h4>
    <p v-for="(previewFile, key) in previewFiles" :key="key">
      {{ previewFile.name }}
    </p>
     -->
  <!-- </section> -->
</template>

<script>
import JSZip from 'jszip'
import { graphqlOperation } from 'aws-amplify'

import { auth, storage, api } from '@/services/amplify'

// import * as queries from '@/graphql/queries'
import * as mutations from '@/graphql/mutations'
// import * as subscriptions from '@/graphql/subscriptions'

// NOTE: unzipped files size.
const FILES_SIZE_MB_LIMIT = 300

export default {
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    getContainer: {
      type: Function,
      default: () => document.body,
    },
  },
  data() {
    return {
      fileList: [],
      uploading: false,
      loading: false,
      layerName: '',
      layerDesc: '',
      previewTime: 0,
      previewFiles: {},
      progress: 0,
      requiredFiles: ['.dbf', '.prj', '.shp', '.shx'],
      /*
      excludedFiles: ['.shp.xml'],
      */
      excludedFiles: [],
      totalMBSize: 0,
      FILES_SIZE_MB_LIMIT,
    }
  },
  computed: {
    file() {
      return Object.freeze(this.fileList[0])
    },
    requiredFilesCheck() {
      return this.checkFiles(this.previewFiles, this.requiredFiles)
    },
    excludedFilesCheck() {
      return this.checkFiles(this.previewFiles, this.excludedFiles)
    },
    isOverLimitSize() {
      return this.totalMBSize > FILES_SIZE_MB_LIMIT
    },
    allowUpload() {
      const requiredFilesCheck =
        Object.values(this.requiredFilesCheck).filter(c => c === 1).length ===
        Object.values(this.requiredFilesCheck).length

      const excludedFilesCheck =
        Object.values(this.excludedFilesCheck).filter(c => c === 0).length ===
        Object.values(this.excludedFilesCheck).length

      console.log({ requiredFilesCheck, excludedFilesCheck })

      return requiredFilesCheck && excludedFilesCheck && !this.isOverLimitSize
    },
  },
  watch: {
    visible(visible) {
      if (!visible) this.action1()
    },
  },
  methods: {
    // methods
    checkFiles(checkFiles, checkNames) {
      const files = Object.keys(checkFiles)
      const check = {}

      checkNames.map(filename => {
        const regexp = new RegExp(`${filename}$`)
        const checked = files.filter(f => regexp.test(f))

        check[filename] = checked.length
      })

      return check
    },
    previewZip(file) {
      console.log('previewZip', file)

      const name = `${file.name}`.split('.')[0]
      if (!this.layerName) this.layerName = name
      if (!this.layerDesc) this.layerDesc = name

      this.previewTime = 0
      this.loading = true
      const dateBefore = Date.now()

      return JSZip.loadAsync(file) // 1) read the Blob
        .then(
          zip => {
            console.log({ zip })

            const dateAfter = Date.now()
            this.previewTime = dateAfter - dateBefore

            let files = {}

            Object.entries(zip.files)
              .filter(([path]) => `${path}`.indexOf('/') === -1)
              .map(([path, file]) => (files[path] = file))

            console.log('previewZip 1', { files })

            if (Object.values(files).length === 0) {
              files = {}

              const dir = Object.entries(zip.files)
                .filter(([_, { dir }]) => dir)
                .map(([path]) => `${path}`)[0]

              if (dir) {
                Object.entries(zip.files)
                  .filter(([_, { dir }]) => !dir)
                  .filter(([path]) => `${path}`.indexOf(dir) === 0)
                  .map(([path, file]) => [`${path}`.substr(dir.length), file])
                  .filter(([path]) => `${path}`.indexOf('/') === -1)
                  .map(([path, file]) => (files[path] = file))

                console.log('previewZip 2', { dir, files })
              }
            }

            let totalByteSize = 0
            Object.values(files).map(file => {
              const uncompressedSize = file._data.uncompressedSize
              console.log(file, { uncompressedSize })
              if (uncompressedSize > 0) totalByteSize += uncompressedSize
            })
            const totalMBSize = totalByteSize / 1000 / 1000
            console.log({ totalByteSize, totalMBSize })

            this.totalMBSize = totalMBSize

            this.previewFiles = files
          },
          err => {
            console.error(err.message)

            this.$message.error(`Error reading [${file.name}] file`, 5)

            this.fileList = []
          }
        )
        .then(() => {
          this.loading = false
        })
    },
    newFile({ file }) {
      this.fileList = [file]
      this.previewZip(file)
    },
    handleRemove(file) {
      console.log('handleRemove', file)
      this.fileList = []
      this.previewFiles = {}
      this.previewTime = 0
    },
    beforeUpload() {
      // Hook function which will be executed before uploading. Uploading will be stopped with false.
      return false
    },
    clear() {
      this.$emit('update:visible', false)

      this.fileList = []
      this.layerName = ''
      this.layerDesc = ''
      this.previewTime = 0
      this.previewFiles = {}
      this.progress = 0
    },
    async handleUpload() {
      console.log('handleUpload()')

      const file = this.file
      const filename = encodeURIComponent(`${Date.now()}_${file.name}`)
      const path = 'zipfiles/'

      const currAuth = await auth.currentCredentials()
      const identityId = currAuth.identityId

      const userId = this.$store.state.auth.user.id

      if (!userId) return alert('Upload error. Please reload the page.')

      this.uploading = true

      let layerIdCreated = ''

      await storage
        .put(`${path}${filename}`, file, {
          contentType: 'application/zip',
          metadata: { filename: file.name },
          progressCallback: progress => {
            // console.log({ progress })
            const { loaded, total } = progress
            console.log(`Uploaded: ${progress.loaded}/${progress.total}`)

            this.progress = ~~((loaded / total) * 65)
          },
        })
        .then(() => {
          return api
            .graphql(
              graphqlOperation(mutations.createLayer, {
                input: {
                  userId: userId,

                  zipfile: filename,

                  name: this.layerName,
                  desc: this.layerDesc,

                  progress: 0,
                  state: 'CREATED',
                },
              })
            )
            .then(res => {
              console.log('createLayer res', res)
              return res.data.createLayer.id
            })
            .then(layerId => {
              console.log('createLayer layerId', layerId)
              return layerId
            })
        })
        .then(async layerId => {
          layerIdCreated = layerId

          const data = JSON.stringify({
            layerId,
            zipfile: filename, // TODO: it's deprecated in the newest version, but now it's reverting to old version
          })

          const res = await api
            .graphql(
              graphqlOperation(mutations.runPackager, {
                type: 'UPLOAD',
                userId,
                identityId,
                data,
              })
            )
            .then(res => res.data.runPackager)

          console.log('runPackager', res)

          return true
        })
        .then(res => {
          console.log('upload success', res)
          this.$message.success('upload successfully.')

          return true
        })
        // .then(datafileId => {
        //   return this.$axios.post('/api/savedata', {
        //     layername: this.layerName,
        //     description: this.layerDesc,
        //     datafileId,
        //   })
        // })
        .catch(err => {
          console.error('upload error', err)
          this.$message.error('upload failed.' + err.message, 5)

          if (layerIdCreated) {
            const input = {
              id: layerIdCreated,

              state: 'FAILED',
            }

            return api
              .graphql(
                graphqlOperation(mutations.updateLayer, {
                  input,
                })
              )
              .then(res => {
                console.log('handleUpload FAILED updateLayer res', res)
                return res.data.updateLayer.id
              })
              .catch(err => {
                console.error('handleUpload FAILED updateLayer error', err)
              })
          }
        })
        .finally(() => {
          this.progress = 100
          this.uploading = false
          this.clear()
        })
    },
    async testAPI() {
      // const helloworld = await api.graphql(graphqlOperation(queries.helloworld))

      const user = await auth.currentUserInfo()
      console.log({ user })

      const helloworld = await api
        // .get('helloworld', '/helloworld')
        .get('db', '/rds')
        .catch(err => console.error(err))

      console.log('testAPI', { helloworld })
    },
    handleUploadO() {
      console.log('handleUpload()')

      // const { fileList } = this
      const formData = new FormData()
      // fileList.forEach(file => {
      //   formData.append('files[]', file)
      // })

      formData.append('key', this.file, this.file.name)

      this.uploading = true

      // if (this.uploading) return console.log({ formData })

      return this.$axios
        .post('/api/uploadfile', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          // `onUploadProgress` allows handling of progress events for uploads
          onUploadProgress: progressEvent => {
            // Do whatever you want with the native progress event
            console.log({ progressEvent })
            const { loaded, total } = progressEvent

            this.progress = ~~((loaded / total) * 90)
          },
        })
        .then(res => {
          console.log('upload success', res)
          this.$message.success('upload successfully.')

          const datafileId = res.data.id.split('$$')[0]

          return datafileId
        })
        .then(datafileId => {
          return this.$axios.post('/api/savedata', {
            layername: this.layerName,
            description: this.layerDesc,
            datafileId,
          })
        })
        .catch(err => {
          console.error('upload error', err)
          this.$message.error('upload failed.' + err.message, 5)
        })
        .finally(() => {
          this.progress = 100
          this.uploading = false
          this.clear()
        })
    },
  },
}
</script>

<style scoped>
.ant-modal >>> .ant-modal >>> .ant-modal-body {
  color: red !important;
}
/* 
  .ant-modal-body {
    padding-top: 10px;
  } */
</style>

<style lang="scss" scoped>
.UploadModal {
  user-select: none;
  .ant-modal-title {
    color: red;
    margin: 0px;
  }
  .ant-modal-body {
    p {
      // font-family: 'Nunito', sans-serif;
      margin: 0px;
    }
  }

  .form {
    margin-top: 10px;
    display: flex;

    > * {
      flex: 1;
      padding: 0px 5px;
    }

    .ant-upload-text {
      font-size: 1em;
    }

    .ant-upload-hint {
      font-size: 0.6em;
    }

    .inputs {
      /deep/ {
        .ant-form-item {
          margin: 0px;
        }

        .checkBedges {
          margin-top: 4px;

          .ext {
            font-size: 0.8em;
            line-height: var(--bedge-height);
          }
        }

        .previewTime {
          font-size: 0.6em;
        }
      }
    }
  }
  .uploadBtn {
    // float: right;
    width: 100%;
  }
}

.fileCheck {
  margin: 5px;
  &.required {
    background-color: #646100;
    &.checked {
      background-color: green;
    }
  }

  &.excluded {
    background-color: green;
    &.checked {
      background-color: red;
    }
  }
}
</style>
