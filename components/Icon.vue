<template>
  <div>
    <div
      class="icon-outer"
      :style="{
        '--r': `${radius}px`,
      }"
      @mouseover="hover = true"
      @mouseleave="hover = false"
    >
      <div class="icon-inner">
        <slot> </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Icon',
  props: {
    radius: {
      type: Number,
      default: 0,
    },
    fill: {
      type: String,
      default: 'black',
    },
  },
}
</script>
<style lang="scss" scoped>
.icon-outer {
  cursor: pointer;
  position: relative;
  width: var(--r);
  height: var(--r);
  border-radius: 50%;
  background-color: $btn-bg-color;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  svg:focus {
    outline: none;
  }

  &:hover {
    color: $btn-bg-color;
    background-color: rgba(0, 0, 0, 0);
    border: 1px solid $btn-bg-color;

    .icon-inner {
      filter: invert(100%);
    }
  }
}

.icon-inner {
  text-align: center;
  display: block;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
