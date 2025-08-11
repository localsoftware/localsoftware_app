<template>
  <div>
    <div class="doc">
      <!-- Add the background light yellow square -->
      <div class="sidebar">
        <div
          v-for="(content, key) in documentation"
          :key="`${key}`"
          @click="
            () => {
              active = key
            }
          "
        >
          <h3>{{ key }}</h3>
        </div>
      </div>

      <!-- Add the background light yellow square -->
      <div v-if="active" class="content">
        <div style="position: relative;">
          <div class="left-content">
            <h1>LOCAL CODE</h1>
            <h2>{{ active }}</h2>
            <div v-if="documentation[active].imagePath">
              <img :src="documentation[active].imagePath" />
            </div>
            <div v-if="documentation[active].ghPath">
              <a :href="documentation[active].ghPath" download>
                <h2
                  style="font-size: 20px; padding-top : 10px; cursor: pointer;"
                >
                  Download .gh file example
                </h2>
              </a>
            </div>
            <div v-if="documentation[active].otherPath">
              <a :href="documentation[active].otherPath" download>
                <h2
                  style="font-size: 20px; padding-top : 10px; cursor: pointer;"
                >
                  Download additional files
                </h2>
              </a>
            </div>
          </div>

          <div class="right-content">
            <div class="element" style="font-weight: bold;">
              {{ documentation[active].summary }}
            </div>
            <div class="element" style="font-weight: bold;">
              Typical usage example:
            </div>
            <div class="element">
              {{ documentation[active].example }}
            </div>
            <div class="element" style="font-weight: bold;">
              Inputs:
            </div>
            <div
              v-for="(content, key) in documentation[active].inputs"
              :key="content + key"
            >
              <i> {{ key }} </i> : {{ content }}
            </div>
          </div>
        </div>
      </div>

      <div v-else class="content">
        <div style="position: relative; ">
          <div class="left-content">
            <h1>LOCAL CODE</h1>
            <h2>DOCUMENTATION</h2>
            <div class="left">
              <a href="/site_ex/primer.pdf" download>
                <h2
                  style="font-size: 20px; padding-top : 10px; cursor: pointer;"
                >
                  Download primer
                </h2>
              </a>
            </div>
          </div>
        </div>
        <h2>
          In this section of the website you can find information on LOCAL CODE
          Grasshopper components; their inputs, potential uses and some
          examples.
        </h2>
      </div>
    </div>
    <TheFooter />
  </div>
</template>

<script>
import TheFooter from '@/components/TheFooter'
import FaqCard from '@/components/FaqCard'
import docs from '@/assets/documentation.json'

export default {
  layout: 'standard',
  components: {
    TheFooter,
    FaqCard,
  },
  data: function() {
    return {
      documentation: docs,
      active: '',
    }
  },
}
</script>

<style lang="scss" scoped>
.doc {
  position: relative;
  min-height: 85vh;

  h3 {
    font-size: 18px;
    line-height: 24px;
    // font-family: 'Nunito', sans-serif;
    color: black;
    font-weight: 600;
    cursor: pointer;

    .selected {
      color: #b4ae00;
    }

    &:hover {
      color: #b4ae00;
    }
  }

  .sidebar {
    position: absolute;
    top: 3vh;
    left: 2vw;
    width: 20vw;
    height: 80vh;

    margin-right: 0px;
    background-color: #ffffff50;
    background-clip: padding-box;

    text-align: right;
    padding: 30px;
  }

  .content {
    position: absolute;
    top: 3vh;
    left: 25vw;
    width: 62vw;
    height: 80vh;
    padding: 30px;

    background-color: #ffffff50;
    h2 {
      // font-family: 'Nunito', sans-serif;
      font-size: 32px;
      line-height: 45px;
      color: #b4ae00;
    }
    .left-content {
      float: left;
      width: 40%;
      text-align: right;
      padding-right: 20px;

      img {
        width: 100%;
        height: auto;
      }
      .filler-image {
        width: 100%;
        padding-bottom: 100%;
        position: relative;
        background-color: grey;
        // background-clip: padding-box;
      }
      h2 {
        // font-family: 'Nunito', sans-serif;
        font-size: 32px;
        line-height: 45px;
        color: #b4ae00;
      }
      h1 {
        font-size: 18px;
        line-height: 24px;
        font-weight: 500;
        // font-family: 'Roboto', sans-serif;
      }
    }

    .right-content {
      // font-family: 'Nunito', sans-serif;

      padding-left: 20px;
      float: right;
      width: 60%;

      .element {
        padding-bottom: 10px;
      }
    }
  }
}
</style>
