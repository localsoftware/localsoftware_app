<template>
  <section class="layer">
    <h4>Layer {{ layerId }}</h4>
  </section>
</template>

<script>
export default {
  computed: {
    layerId() {
      return this.$route.params.layerId
    },
  },
}
</script>

<style>
.layer {
}
</style>
