<template>
  <div class="draft">
    <div class="sidebar">
      <h1>Local Code</h1>

      <div class="menu top">
        <p v-for="(item, name) in menuTop" :key="name" class="item">
          {{ name }}
        </p>
      </div>
      <div class="menu bottom">
        <p v-for="(item, name) in menuBottom" :key="name" class="item">
          {{ name }}
        </p>
      </div>
    </div>
    <div class="content">
      <a-row>
        <a-col :span="12">
          <a-slider v-model="logoR" :min="150" :max="400" />
        </a-col>
        <a-col :span="4">
          <a-input-number
            v-model="logoR"
            :min="150"
            :max="400"
            style="marginLeft: 16px"
          />
        </a-col>
      </a-row>
      <BigLogo :r="logoR"></BigLogo>
    </div>
  </div>
</template>

<script>
import BigLogo from '@/components/BigLogo'

export default {
  components: {
    BigLogo,
  },
  data() {
    return {
      logoR: 150,
      menuTop: {
        'Site Packages': '/builder',
        'Data Layers': '/layers',
      },
      menuBottom: {
        'Desktop Tools': '/tools_download',
        Contact: '/concat',
        About: '/about',
        FAQ: '/faq',
      },
    }
  },
  computed: {},
  watch: {},
  methods: {},
}
</script>

<style lang="scss" scoped>
$pad-media: 768px;

.draft {
  display: flex;
  height: 100vh;
  width: 100%;
  padding: 50px 0px;
  justify-content: center;
  background-color: $bg-color;

  @media all and (max-width: $pad-media) {
    padding-left: 0px;
    padding-right: 0px;
  }

  .sidebar {
    $w: 200px;

    position: relative;

    width: $w;
    height: 100%;

    transition: width 0.3s ease-in;
    overflow: hidden;

    @media all and (max-width: $pad-media + $w) {
      width: 0px;
    }

    > * {
      width: $w;
    }

    .menu {
      &.bottom {
        position: absolute;
        bottom: 0px;
      }

      .item {
        background-color: #ffffffa3;
        padding: 15px;
        width: 140px;
        font-weight: bold;
        cursor: pointer;

        transition: background-color 0.3s ease-out, padding 0.15s ease-out;

        &:hover {
          background-color: #ffffff;
          border-radius: 5px;
          padding-left: 20px;
        }
      }
    }
  }

  .content {
    min-width: 768px;
    height: 100%;
    background-color: #ffffff;
    // border: black 2px dashed;
    border-radius: 15px;
    box-shadow: 0 0 30px 6px rgba(31, 51, 73, 0.05);
  }
}
</style>
