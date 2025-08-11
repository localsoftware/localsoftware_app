<template>
  <section class="app">
    <!-- 
    <h1>Welcome to the Local Software App</h1>
    <hr />
    <p>How?</p>
    <p>Why?</p>
    <p>Who?</p>
    <p>You are ?</p>
    <p>This Tool provide the xxx ?</p>
    <br />
    <hr />
    <br />
    <h2>Pages</h2>
    <p>The <b>[Data Layers]</b> page is XXX</p>
    <p>The <b>[Site Packages]</b> page is XXX</p>
    <p>The <b>[Packager]</b> page is XXX</p>
     -->
    <a-spin size="large" />
  </section>
</template>

<script>
export default {
  created() {
    this.$router.replace({ path: '/app/layers' })
  },
}
</script>

<style lang="scss" scoped>
.app {
  padding: 50px;

  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
