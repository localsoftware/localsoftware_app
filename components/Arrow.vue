<template>
  <div>
    <div v-if="orientation === 'down'">
      <svg version="1.0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <polyline
          fill="none"
          points="21,8.5  12,17.5  3,8.5 "
          stroke="#000"
          stroke-miterlimit="10"
          stroke-width="2"
        />
      </svg>
    </div>
    <div v-else>
      <svg version="1.0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <polyline
          fill="none"
          points="21,17.5  12,8.5  3,17.5"
          stroke="#fff"
          stroke-miterlimit="10"
          stroke-width="2"
        />
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Arrow',
  props: {
    orientation: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
svg {
  width: 40px;
  height: 40px;
  cursor: pointer;
  transform: translate(-50%, -7vh);
}
</style>
