<template>
  <a-modal
    :visible="visible"
    class="EditModal"
    title="Edit Package"
    :get-container="getContainer"
    :footer="null"
    @cancel="clear"
  >
    <div class="form">
      <a-form layout="vertical" class="inputs">
        <a-form-item>
          <p slot="label">
            <a-icon type="highlight" />
            Package Name
          </p>
          <a-input
            v-model="pkgName"
            v-decorator="[
              'package name',
              {
                rules: [{ required: true, message: 'Please input your name' }],
              },
            ]"
            placeholder="Please input package name"
          />
        </a-form-item>
      </a-form>
    </div>
    <a-button
      type="primary"
      :disabled="!pkgName"
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
import { graphqlOperation } from 'aws-amplify'
import { api } from '@/services/amplify'
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
    pkg: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      editing: false,
      deleteing: false,
      pkgName: '',
    }
  },
  watch: {
    visible() {
      console.log(this.pkg)

      this.pkgName = this.pkg.name
    },
  },
  methods: {
    // methods

    clear() {
      this.$emit('update:visible', false)

      this.pkgName = ''
    },
    handleEdit() {
      this.editing = true

      const input = {
        id: this.pkg.pkgId,
        name: this.pkgName,
      }

      return api
        .graphql(
          graphqlOperation(mutations.updatePkg, {
            input,
          })
        )
        .then(res => {
          console.log('updatePkg res', res)
          return res.data.updatePkg.id
        })
        .then(pkgId => {
          console.log('updatePkg layerId', pkgId)

          this.$message.success('edit successfully.')

          this.onFinish()
          return pkgId
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

      return this.$axios
        .post('/api/editsitepackage', {
          name: this.pkgName,
          id: this.pkg.id,
        })
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
    },
    handleDelete() {
      const pkgId = this.pkg.pkgId
      const check = confirm(`🚨 delete pkg`)
      console.log('deletePkg()', { pkgId })
      if (!check) return

      this.deleteing = true

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
          console.log('delete success', res)
          this.$message.success('delete successfully.')

          this.pkg.name = '(deleted)'
          this.onFinish()

          return res.data.deletePkg.id
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
        .post('/api/delete/sitepackages', {
          id: this.pkg.id,
        })
        .then(res => {
          console.log('delete success', res)
          this.$message.success('delete successfully.')

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
