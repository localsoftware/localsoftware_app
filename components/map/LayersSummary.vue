<template>
  <div
    v-show="pos.x"
    class="LayersSummary"
    :style="{
      top: `${pos.y}px`,
      left: `${pos.x}px`,
      opacity: layers.length > 0 ? 1 : 0,
      width: `${width}px`,
    }"
  >
    <div class="count">
      <a-icon type="inbox" />
      {{ layers.length }}
      packages
    </div>
    <p class="tooltip">
      <slot></slot>
    </p>
  </div>
</template>

<script>
import { pluck, map, tap } from 'rxjs/operators'

export default {
  name: 'LayersSummary',

  props: {
    layers: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      mouse: {},
      pos: {},
      width: 140,
    }
  },
  subscriptions() {
    return {
      pos$: this.$watchAsObservable('mouse').pipe(
        pluck('newValue'),
        map(({ x, y }) => ({
          x: x + 5,
          y: y - 5,
        })),
        map(({ x, y }) => {
          const overWidth = x + this.width > window.innerWidth
          return {
            x: overWidth ? window.innerWidth - this.width : x,
            y: overWidth ? y + 20 : y,
          }
        }),
        tap(pos => (this.pos = pos))
      ),
    }
  },
  watch: {
    layers(layers) {
      if (layers.length) console.log('LayersSummary', { layers })
    },
  },
  mounted() {
    document.addEventListener('mousemove', this.setMouse)
  },
  beforeDestroy() {
    document.removeEventListener('mousemove', this.setMouse)
  },
  methods: {
    setMouse({ clientX, clientY }) {
      this.mouse = Object.freeze({ x: clientX, y: clientY })
      // console.log(this.mouse)
    },
    setPos({ x, y }) {
      this.pos = { x, y }
    },
  },
}
</script>

<style lang="scss" scoped>
.LayersSummary {
  position: fixed;

  // width: 140px;
  text-align: center;

  background-color: white;
  border-radius: 5px;
  padding: 5px;
  color: black;

  pointer-events: none;

  transition: all 0.1s;
  transition-property: top, left;

  .tooltip {
    margin: 0.2em 0;
    font-size: 0.8em;
    color: hsla(0, 0%, 40%, 1);
  }
}
</style>
