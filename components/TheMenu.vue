<template>
  <div class="the-menu">
    <a-dropdown placement="bottomRight">
      <div>
        <Icon :radius="40">
          <img src="~assets/icons/menu.svg" />
        </Icon>
      </div>

      <a-menu slot="overlay" :style="{ backgroundColor: 'black' }">
        <a-menu-item>
          <nuxt-link to="/" :style="{ color: 'white' }">
            Home
          </nuxt-link>
        </a-menu-item>
        <a-menu-item>
          <nuxt-link to="/team" :style="{ color: 'white' }">
            About the Team
          </nuxt-link>
        </a-menu-item>
        <a-menu-item>
          <nuxt-link to="/documentation" :style="{ color: 'white' }">
            Documentation
          </nuxt-link>
        </a-menu-item>
        <a-menu-item>
          <nuxt-link to="/faq" :style="{ color: 'white' }">
            FAQ
          </nuxt-link>
        </a-menu-item>
        <a-menu-item>
          <nuxt-link to="/download" :style="{ color: 'white' }">
            Download
          </nuxt-link>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
  </div>
</template>

<script>
import Icon from '@/components/Icon'

export default {
  components: {
    Icon,
  },
  data() {
    return {
      //
    }
  },
}
</script>
<style lang="scss" scoped>
//
</style>
