<template>
  <div>
    <nuxt />
  </div>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Nunito:200,200i,400,400i,700&display=swap&subset=latin-ext');

html {
  font-family: 'monotype-grotesque', 'Nunito', Roboto, 'Helvetica Neue', Arial,
    sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  background-color: $bg-color;
}

body {
  font-family: 'monotype-grotesque', 'Nunito', Roboto, 'Helvetica Neue', Arial,
    sans-serif;
}

span {
  line-height: 1;
  vertical-align: middle;
}

#__nuxt,
#__layout {
  height: 100%;
}
</style>
