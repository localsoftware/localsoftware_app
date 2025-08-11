<template>
  <div>
    <div :class="show ? 'overlay' : 'overlay hidden'" @click="onclick"></div>
    <div
      id="aboutModal"
      :class="show ? 'modal' : 'modal hidden'"
      :style="{
        left: `${position.left}px`,
        top: `${position.top}px`,
        width: `${position.width}px`,
        height: `${position.height}px`,
      }"
    />
  </div>
</template>

<script>
export default {
  name: 'Modal',
  props: ['show', 'content', 'position', 'onclick'],
  updated() {
    document.getElementById('aboutModal').innerHTML = this.content
  },
}
</script>

<style lang="scss" scoped>
.overlay {
  position: fixed;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  background-color: black;
  opacity: 0.5;
  overscroll-behavior: contain;
}

.modal {
  // font-family: 'Nunito', sans-serif;
  font-size: 20px;
  position: absolute;
  z-index: 1001;
  left: 300px;
  color: white;
  background-color: black;
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  padding: 20px;
}

.hidden {
  visibility: hidden;
}
</style>
