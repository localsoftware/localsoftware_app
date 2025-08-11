<template>
  <svg>
    <g>
      <rect
        v-for="(rect, idx) in rects"
        :key="idx"
        :x="rect.x"
        :y="rect.y"
        :width="rect.s"
        :height="rect.s"
        :fill="rect.c"
      ></rect>
    </g>
  </svg>
</template>

<script>
import _ from 'lodash'

const colors = {
  white: '#ffffff',
  darker: '#3d3a00',
  brown: '#646100',
  lighter: '#b4ae00',
}

const randomInt = range => ~~(range * Math.random())

export default {
  data() {
    return {
      rects: [],
    }
  },
  computed: {
    action() {
      return this.$store.state.motion.action
    },
  },
  watch: {
    action(action) {
      this.interval = clearInterval(this.interval)
      if (action[0] === 1) this.generateRects()
      if (action[0] === 2) {
        this.generateRects()
        this.interval = setInterval(() => {
          this.generateRects()
        }, 1000)
      }
    },
    $route() {
      this.interval = clearInterval(this.interval)
    },
  },
  mounted() {
    this.generateRects()
  },
  methods: {
    generateRects() {
      const w = window.innerWidth
      const h = window.innerHeight

      const rectNumer = (w * h) / 40000

      const rects = []

      for (let i = 0; i < rectNumer; i++) {
        rects[i] = {
          x: randomInt(w),
          y: randomInt(h),
          s: randomInt(10) * 10,
          c: _.sample(colors),
        }
      }

      this.rects = rects
    },
  },
}
</script>

<style lang="scss" scoped>
svg {
  position: fixed;
  left: 0px;
  top: 0px;

  width: 100vw;
  height: 100vh;
  opacity: 0.8;
  filter: brightness(3);

  rect {
    transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
    transition-property: x, y, width, height, fill;
  }
}
</style>
