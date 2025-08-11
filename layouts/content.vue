<template>
  <a-layout id="components-layout-demo-top" class="layout">
    <a-layout-header>
      <nuxt-link to="/app">
        <div class="logo">
          <p class="mock">LOGO</p>
        </div>
      </nuxt-link>
      <a-menu theme="dark" mode="horizontal" :style="{ lineHeight: '64px' }">
        <a-menu-item key="1">
          <nuxt-link to="/about">About</nuxt-link>
        </a-menu-item>
        <a-menu-item key="2">
          <nuxt-link to="/faq">FAQ</nuxt-link>
        </a-menu-item>
      </a-menu>
    </a-layout-header>

    <a-layout>
      <!-- <a-layout-header style="background: #fff; padding: 0" /> -->
      <a-layout-content style="margin: 0 16px">
        <nuxt />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
export default {
  layout: 'default',
  components: {
    //
  },
  data() {
    return {
      collapsed: false,
    }
  },
}
</script>

<style lang="scss" scoped>
.logo {
  $h: 31px;

  width: 120px;
  height: 31px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px 24px 16px 0;
  float: left;

  .mock {
    margin: auto;
    text-align: center;
    line-height: $h;
    color: white;
  }
}
</style>
