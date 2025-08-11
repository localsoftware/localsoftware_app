<template>
  <div class="index">
    <div class="head">
      <TheMenu class="menu" />

      <nuxt-link to="/signin">
        <div v-if="main()" class="open">
          Open App
        </div>
      </nuxt-link>
    </div>

    <nuxt />
  </div>
</template>

<script>
import TheMenu from '@/components/TheMenu'

export default {
  components: {
    TheMenu,
  },

  data() {
    return {}
  },

  methods: {
    main() {
      return this.$route.path !== '/signin'
    },
  },
}
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css?family=Nunito:200,200i,400,400i,700&display=swap&subset=latin-ext');

html {
  // font-family: Nunito, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  scroll-behavior: smooth;
}

body {
  overflow: hidden;
  scroll-behavior: smooth;
}

span {
  line-height: 1;
  vertical-align: middle;
}

#__nuxt,
#__layout {
  height: 100%;
}

.index {
  position: static;
  background-color: $bg-color;
  width: 100vw;
  height: 100vh;
  scroll-behavior: smooth;

  overflow-y: scroll;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
}

.head {
  position: absolute;
  top: 0px;
  right: 0px;
  z-index: 10000;
  .menu {
    position: relative;
    display: flex;
    float: left;
    margin: 1em;
    margin-right: 10px;
  }

  .open {
    display: flex;
    float: right;
    border-radius: 1.5em;
    padding: 0.75em 1em;
    margin-top: 0.75em;
    margin-right: 10px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);

    color: $btn-color;
    background-color: $btn-bg-color;
    border: 1px solid rgba(0, 0, 0, 0);
  }
  .open:hover {
    color: $btn-bg-color;
    background-color: rgba(0, 0, 0, 0);
    border: 1px solid $btn-bg-color;
  }
}
</style>
