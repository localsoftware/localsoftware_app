<template>
  <div
    :id="person.name.last"
    :style="{
      height: '100%',
    }"
    class="card-container"
  >
    <a-card :bordered="false" style="width: 100%">
      <img slot="cover" :src="person.imageUrl" :alt="person.imageUrl" />
      <template slot="actions" class="ant-card-actions">
        <a-icon key="plus" type="plus" @click="clicked()" />
      </template>
      <a-card-meta loading :description="person.title">
        <div slot="title" class="title">
          <div>
            {{ person.name.first }}
          </div>
          <div>
            {{ person.name.last }}
          </div>
        </div>
      </a-card-meta>
    </a-card>
  </div>
</template>

<script>
export default {
  name: 'BioCard',
  props: ['person', 'onclick'],
  data() {
    return {
      show: false,
      modalCoords: {},
    }
  },
  methods: {
    clicked() {
      this.onclick(this.person)
    },
  },
}
</script>

<style scoped>
.card-container {
  margin: 10px;
}
.ant-card {
  background-color: transparent;
}

.ant-card >>> .ant-card-cover {
  margin-bottom: 20px;
}

.ant-card >>> .ant-card-body {
  background-color: #ffffff7d;
  height: 200px;
}
.ant-card >>> .ant-card-actions {
  background-color: #ffffff7d;
  border: none;
}

.ant-card >>> .ant-card-meta {
  /* font-family: 'Nunito', sans-serif; */
  text-align: center;
  white-space: normal;
  text-overflow: unset;
}

.ant-card >>> .ant-card-meta-title {
  font-size: 24px;
  margin-bottom: 10px;
  overflow: visible;
}

.ant-card >>> .ant-card-meta-description {
  font-size: 20px;
}
</style>
