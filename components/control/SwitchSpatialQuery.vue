<template>
  <div class="SwitchSpatialQuery">
    <div class="block">
      <span class="label">
        spatial query
      </span>
      <a-switch
        v-model="switchValue"
        checked-children="on"
        un-checked-children="off"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      switchValue: true,
    }
  },
  watch: {
    switchValue(value) {
      console.log('switchValue', { value })
      this.$emit('change', value)
      this.$emit('input', value)
    },
  },
  created() {
    this.switchValue = this.value
  },
}
</script>

<style lang="scss" scoped>
.SwitchSpatialQuery {
  position: absolute;
  pointer-events: none;

  left: 0;
  bottom: 0;

  background-color: transparent;

  width: 100%;
  height: auto;

  display: flex;
  justify-content: center;
  align-items: start;
}

.block {
  margin: 0rem auto;
  padding: 0.75rem 2rem;
  background-color: white;

  border-radius: 3px 3px 0px 0px;
  pointer-events: auto;
}

.label {
  margin-right: 0.5rem;
}
</style>
