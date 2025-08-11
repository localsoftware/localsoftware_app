<template>
  <div class="footer-all">
    <footer>
      <div class="label">
        <div class="title">LOCAL CODE</div>
        <div class="copyright">CopyRight © 2018-2020 MIT・UC Berkeley</div>
      </div>
      <div class="links">
        <a href="/">Home</a>
        <a href="/team">Team</a>
        <a href="/documentation">Learn</a>
        <a href="/download">Download</a>
        <a href="mailto:">Contact</a>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'Footer',
}
</script>

<style lang="scss" scoped>
.footer-all {
  position: relative;
  background-color: black;
  opacity: 1;
}

footer {
  height: 15vh;
  width: 100%;
  color: white;
  background-color: black;
  // padding-bottom: 50%;

  // border-bottom: 10vh solid black;

  display: flex;
  justify-content: space-between;
  align-items: center;

  .label {
    user-select: none;
    width: 22em;
    padding-left: 2vw;
    float: left;
    background-color: black;

    .title {
      font-size: 2.5em;
      // font-family: 'Roboto', sans-serif;
    }

    .copyright {
      font-size: 0.75em;
    }
  }

  .links {
    flex: 1;
    float: right;
    padding-right: 2vw;
    text-align: right;
    align-items: center;
    user-select: none;
    background-color: black;

    a {
      font-size: 1.125em;
      margin-left: 1.5em;
      color: white;
      &:focus {
        outline: none;
      }
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
