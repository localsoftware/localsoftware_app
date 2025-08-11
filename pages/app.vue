<template>
  <!-- 
    <h1>Path: {{ this.$route.path }}</h1>
    -->
  <nuxt-child class="app" />
</template>

<script>
import { mapState } from 'vuex'

export default {
  middleware: 'auth',
  layout: 'app',
  computed: {
    ...mapState('auth', ['user']),
  },
  watch: {
    user(user) {
      console.log({ user })
      if (!user) this.$router.push({ path: '/' })
    },
    $route() {
      console.log('$route', this.$route)
    },
  },
  fetch({ req, store, redirect }) {
    if (!store.state.auth.user) {
      return redirect('/signin')
    }
  },
  mounted() {
    this.$message.config({
      getContainer: () => document.querySelector('.app'),
    })
  },
}
</script>

<style lang="scss" scoped>
.app {
  width: 100%;
  height: 100%;
  color: $text-color-dark;

  /deep/ {
    .ant-message {
      position: absolute;
    }
  }
}
</style>
