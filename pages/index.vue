<template>
  <div>
    <div id="main" class="main">
      <!-- INTRO SECTION -->

      <section id="0">
        <BigLogo class="logo" :r="logoR" :show-bg="false" />
        <div
          class="content"
          :style="{
            'padding-left': `150px`,
            'padding-right': `150px`,
            display: 'flex',
          }"
        >
          <div class="leftSide">
            <h3>
              <b>LOCAL CODE</b>
            </h3>
            <p>
              Connecting
            </p>
            <p>
              GIS to CAD
            </p>
          </div>

          <div class="rightSide">
            <p>
              <b>Local Code</b> connects two previously separate ways of looking
              at the world digitally; Geographic Information Systems (GIS) and
              Computer-Aided Design (CAD). Local Code systematically connects
              what we know about the world to what we make in it.
            </p>
            <b> What is Local Code? </b>
            <p>
              Over the last several years, <b>Local Code</b> has shown how a
              robust integration between CAD and GIS can produce unprecedented
              and essential design work, such as our 3,659 individual proposals
              for distributed ecological infrastructure in San Francisco, Los
              Angeles, and New York. Using GIS we learned that these spaces were
              in some of the most park-poor and underserved areas of the city.
              We also saw how their location overlapped with some of the city’s
              most urgent environmental and ecological needs, including the
              urban heat island, pollution, and impedances in the city’s storm
              sewer system.
            </p>
            <p>
              This analysis is possible with existing GIS tools. What is not is
              the next part of our process; for each individual site we develop
              a locally-specific model of wind, water and solar exposure that
              produces the optimum arrangement of paving, drainage, and planting
              on each site, and can form the basis for larger, digitally engaged
              model community engagement.
            </p>
          </div>
        </div>
      </section>

      <!-- WORK FLOW SECTION -->
      <section id="1">
        <div
          class="content"
          :style="{
            'padding-left': `${logoR * 0.5}px`,
            'padding-right': `${logoR * 0.5}px`,
          }"
        >
          <h3>WorkFlow</h3>
          <img width="100%" src="~/assets/workflow.svg" alt="image" />
        </div>
      </section>

      <!-- CASE STUDY SECTION -->
      <section id="2">
        <div class="end">
          <h3
            :style="{
              'padding-left': `${logoR * 0.4}px`,
              'padding-right': `${logoR * 0.4}px`,
            }"
          >
            Case Studies
          </h3>

          <Carousel />
        </div>
        <TheFooter />
      </section>
    </div>

    <a :href="`#${section}`" @click="handleClick">
      <Arrow
        :orientation="section < numSections - 1 ? 'down' : 'up'"
        class="arrow"
      />
    </a>
  </div>
</template>

<script>
import BigLogo from '@/components/BigLogo'
import Arrow from '@/components/Arrow'
import Carousel from '@/components/Carousel'
import TheFooter from '@/components/TheFooter'

export default {
  layout: 'standard',
  components: {
    BigLogo,
    Arrow,
    Carousel,
    TheFooter,
  },

  data() {
    return {
      readMore: true,
      logoR: 500,
      section: 0,
      numSections: 3,
      sectionSize: 0,
      main: null,
    }
  },
  mounted() {
    // ENHANCEMENT(TK): should this.$refs.main here.
    this.main = document.getElementById('main')
    this.main.addEventListener('scroll', this.handleScroll)
    this.sectionSize = this.main.scrollHeight / this.numSections
  },
  beforeDestroy() {
    this.main.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleClick() {
      this.section = (this.section + 1) % this.numSections
      window.location = `#${this.section}`
    },
    handleScroll() {
      const pos = this.main.scrollTop / this.sectionSize
      if (pos - this.section >= 1) {
        this.section += 1
      } else if (pos - this.section <= -1) {
        this.section -= 1
      }
      this.section %= this.numSections
    },
    login() {
      this.$router.push({ path: '/login' })
    },
  },
}
</script>

<style lang="scss" scoped>
.logo {
  position: absolute;
  z-index: 0;
  transform: translate(-50%, -50%);
  color: black;
  font-size: 1.075em;
}

.arrow {
  position: fixed;
  z-index: 100;
  padding-left: 50vw;
}

.main {
  height: 100vh;
  color: $text-color-dark;
  font-size: 1.2em;
  overflow-y: scroll;
  z-index: 1000;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;

  section {
    height: 100vh;
    position: relative;
    h3 {
      // font-family: 'Nunito', sans-serif;
      color: #b4ae00;
      font-size: 48px;
    }

    h2 {
      // font-family: 'Nunito', sans-serif;
      color: #b4ae00;
      font-size: 48px;
      margin: 0;
    }

    .content {
      position: absolute;
      top: 50%;
      transform: translate(0%, -50%);

      .rightSide {
        float: right;
        width: 55%;
        p {
          // font-family: 'Nunito', sans-serif;
          font-size: 17px;
        }
      }

      .leftSide {
        float: left;
        padding-right: 2em;
        width: 45%;
        text-align: right;

        h3 {
          // font-family: 'Roboto', sans-serif;
          margin: 0px;
          width: 100%;
          font-size: 64px;
          font-weight: 300;
          color: black;
        }

        p {
          // font-family: 'Nunito', sans-serif;
          width: 100%;
          margin-bottom: 10px;
          line-height: 32px;
          color: #b4ae00;
          font-size: 32px;
        }
      }
    }

    .end {
      position: relative;
      height: 85vh;
    }
  }
}
</style>
