<template>
  <a-modal
    :visible="visible"
    class="EditModal"
    title="Edit Data Layer"
    :get-container="getContainer"
    :footer="null"
    @cancel="clear"
  >
    <div class="form">
      <a-form layout="vertical" class="inputs">
        <a-form-item>
          <p slot="label">
            <a-icon type="highlight" />
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
            <a-icon type="form" />
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
      </a-form>
    </div>
    <a-button
      type="primary"
      :disabled="!layerName"
      :loading="editing"
      style="margin-top: 16px"
      icon="edit"
      class="editBtn"
      @click="handleEdit"
    >
      {{ editing ? 'Editing' : 'Edit' }}
    </a-button>
    <a-button
      type="danger"
      :loading="deleteing"
      style="margin-top: 8px"
      icon="delete"
      class="editBtn"
      @click="handleDelete"
    >
      {{ deleteing ? 'Deleting' : 'Delete' }}
    </a-button>
  </a-modal>
</template>

<script>
import { api } from '@/services/amplify'

import { graphqlOperation } from 'aws-amplify'

// import * as queries from '@/graphql/queries'
import * as mutations from '@/graphql/mutations'

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
    layer: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      editing: false,
      deleteing: false,
      layerName: '',
      layerDesc: '',
    }
  },
  watch: {
    visible() {
      console.log(this.layer)

      this.layerName = this.layer.userLayerName
      this.layerDesc = this.layer.description
    },
  },
  methods: {
    // methods

    clear() {
      this.$emit('update:visible', false)

      this.layerName = ''
      this.layerDesc = ''
    },

    handleEdit() {
      this.editing = true

      const input = {
        id: this.layer.layerId,

        name: this.layerName,
        desc: this.layerDesc,
      }

      return api
        .graphql(
          graphqlOperation(mutations.updateLayer, {
            input,
          })
        )
        .then(res => {
          console.log('updateLayer res', res)
          return res.data.updateLayer.id
        })
        .then(layerId => {
          console.log('updateLayer layerId', layerId)

          this.$message.success('edit successfully.')

          this.onFinish()
          return layerId
        })
        .catch(err => {
          console.error('edit error', err)
          this.$message.error('edit failed.' + err.message, 5)
        })
        .finally(() => {
          this.editing = false
          this.clear()
        })
    },
    handleEditO() {
      this.editing = true

      const payload = {
        body: {
          name: this.layerName,
          description: this.layerDesc,
          id: this.layer.layerId,
        },
      }

      console.log('api/editdatalayer', { payload })

      return (
        api
          .post('db', '/rds/editdatalayer/', payload)
          // .get('db', '/rds/layers/3')
          .then(res => {
            console.log('edit success', res)
            this.$message.success('edit successfully.')

            this.onFinish()
          })
          .catch(err => {
            console.error('edit error', err)
            this.$message.error('edit failed.' + err.message, 5)
          })
          .finally(() => {
            this.editing = false
            this.clear()
          })
      )
    },
    handleDelete() {
      const layerId = this.layer.layerId
      const check = confirm(`🚨 delete layer`)
      console.log('deleteLayer()', { layerId })
      if (!check) return

      this.deleteing = true

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
          console.log('delete success', res)
          this.$message.success('delete successfully.')

          this.layer.userLayerName = '(deleted)'
          this.layer.description = '(deleted)'
          this.onFinish()

          return res.data.deleteLayer.id
        })
        .catch(err => {
          console.error('delete error', err)
          this.$message.error('delete failed.' + err.message, 5)
        })
        .finally(() => {
          this.deleteing = false
          this.clear()
        })
    },
    handleDeleteO() {
      this.deleteing = true

      return this.$axios
        .post('/api/delete/datalayers', {
          id: this.layer.layerId,
        })
        .then(res => {
          console.log('delete success', res)
          this.$message.success('delete successfully.')

          this.layer.userLayerName = '(deleted)'
          this.layer.description = '(deleted)'
          this.onFinish()
        })
        .catch(err => {
          console.error('delete error', err)
          this.$message.error('delete failed.' + err.message, 5)
        })
        .finally(() => {
          this.deleteing = false
          this.clear()
        })
    },
    onFinish() {
      this.$emit('on-finish')
    },
  },
}
</script>

<style lang="scss">
.EditModal {
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
.EditModal {
  .ant-modal-body {
    color: red;

    p {
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

    .inputs {
      /deep/ {
        .ant-form-item {
          margin: 0px;
        }
      }
    }
  }
  .editBtn {
    // float: right;
    width: 100%;
  }
}

.fileCheck {
  margin: 5px;

  &.required {
    background-color: black;
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
