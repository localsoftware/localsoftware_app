<template>
  <div>
    <div :class="{ revise }" class="header">
      <p>LOCAL CODE</p>
    </div>

    <div :class="{ revise }" class="appLayout">
      <div class="sidebar">
        <div class="menu top">
          <router-link
            v-for="([icon, name], link) in menuTop"
            :key="name"
            :to="link"
            @click.native="linkHandler"
            class="item"
            :class="{ divide: link === '/tools_download' }"
          >
            <a-tooltip :title="name" placement="right" arrow-point-at-center>
              <img class="icon" :src="icon" />
            </a-tooltip>
          </router-link>
        </div>
        <div class="menu bottom">
          <router-link
            v-for="([icon, name], link) in menuBottom"
            :key="name"
            :to="link"
            class="item"
          >
            <a-tooltip placement="right" arrow-point-at-center>
              <img class="icon" :src="icon" />
              <div slot="title">
                <div>
                  <nuxt-link to="/faq" style="cursor:pointer">{{
                    name
                  }}</nuxt-link>
                </div>
                <div>
                  <nuxt-link to="/documentation" style="cursor:pointer">
                    Documentation
                  </nuxt-link>
                </div>
              </div>
            </a-tooltip>
          </router-link>
          <div @click="signout()" class="item divide">
            <a-tooltip title="Log Out" placement="right" arrow-point-at-center>
              <img src="/icons/SignOut.svg" />
            </a-tooltip>
          </div>
        </div>
      </div>
      <div :class="{ revise }" class="content">
        <nuxt />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      revise: true,
      menuTop: {
        /**
         * link: [iconPath, name]
         * icon file paths are in /static directory not /assets
         */
        '/app/layers': ['/icons/Upload.svg', 'Upload your files'],
        '/app/packager': ['/icons/MergeLayers.svg', 'Package your layers'],
        '/app/packages': ['/icons/Group.svg', 'Access layer Packages'],
        '/download': ['/icons/DesktopTools.svg', 'Download Desktop Tools'],
      },
      menuBottom: {
        '/faq': ['/icons/FAQ.svg', 'FAQ'],
      },
    }
  },
  computed: {},
  watch: {},
  methods: {
    linkHandler(e) {
      const isCurrLink = e.target.className.match(/nuxt-link-active/)

      if (!isCurrLink) this.action2()
    },
    signout() {
      this.$store.dispatch('auth/signout')
    },
  },
}
</script>
<style>
.ant-tooltip-inner {
  background-color: black;
}
</style>
<style lang="scss" scoped>
$pad-media: 768px;
$pc-media: 1024px;
.appLayout {
  display: flex;
  height: 100vh;
  width: 100%;
  padding: 50px 0px;
  justify-content: center;
  background-color: $bg-color;

  .sidebar {
    $w: 75px;

    position: relative;

    width: $w;
    height: 100%;

    transition: width 0.3s ease-in;
    overflow: hidden;
    margin: 0 20px;

    @media all and (max-width: $pad-media + $w) {
      width: 0px;
      margin: 0px;
    }

    h1 {
      font-size: 1.6rem;
    }

    .menu {
      $m: 5px;
      $p: 7px;

      &.top {
        margin-top: $m;
        text-align: center;
      }

      &.bottom {
        width: 100%;
        position: absolute;
        bottom: 0px;
        margin-bottom: $m;
        text-align: center;
      }

      .item {
        margin: 1rem 0px;

        display: flex;
        justify-content: center;
        align-items: center;

        color: #2d2d2d;
        padding-top: $p;
        padding-bottom: $p;
        font-weight: bold;
        cursor: pointer;

        font-size: 1.1em;
        white-space: nowrap;

        transition: background-color 0.3s ease-out,
          padding 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
        &.divide {
          border-top: 1px solid black;
        }

        &.nuxt-link-active {
          &::before {
          }
        }
      }
    }
  }

  .content {
    // width: 768px;
    height: 100%;
    background-color: #ffffff;
    box-shadow: 0 1.2rem 3.6rem rgba(0, 0, 0, 0.2);
    overflow: hidden;
    // border: black 2px dashed;

    user-select: none;

    z-index: 1;
  }
}
</style>

<style lang="scss" scoped>
.revise-checkbox {
  position: fixed;
  right: 0px;
  top: 0px;
}

.revise {
  &.appLayout {
    padding: 0rem;
    height: 93vh;
  }

  &.header {
    background-color: black;
    color: white;
    height: 7vh;
    // font-family: 'Roboto', sans-serif;
    font-weight: 500;
    font-size: 24px;
    line-height: 24px;
    position: relative;
    p {
      position: absolute;
      top: 50%;
      transform: translateY(-12px);

      left: 115px;
    }
  }

  .content {
    width: 100%;
  }
}
</style>
