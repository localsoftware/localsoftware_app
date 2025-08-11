<template>
  <div class="draft">
    <div class="list"></div>
    <div class="detail">
      <div class="map"></div>
      <div class="info"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
}
</script>

<style lang="scss" scoped>
.draft {
  display: flex;

  .list {
    flex: 1;
    background-color: red;
  }

  .detail {
    flex: 3;
    background-color: green;

    display: flex;
    flex-direction: column;

    .map {
      flex: 2;
      background-color: blue;
    }

    .info {
      flex: 1;
      background-color: pink;
    }
  }
}
</style>
