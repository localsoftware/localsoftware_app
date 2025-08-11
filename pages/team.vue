<template>
  <div id="team-main" class="team-main">
    <BigLogo class="team-logo" :r="logoR" :show-bg="false" />

    <ModalLayer
      :show="modalVisibile"
      :position="modalPos"
      :content="modalContent"
      :onclick="callbackFromModal"
    />

    <div class="team-content">
      <div class="leftSide">
        <h3>
          <b>LOCAL CODE</b>
        </h3>
        <p>TEAM</p>
      </div>

      <div class="rightSide">
        <div>
          <div
            v-for="row in numRows"
            :key="row"
            :class="row >= 2 ? 'last-row' : null"
          >
            <a-row type="flex" justify="space-around" align="middle">
              <a-col v-for="col in numCols" :key="col" :span="24 / numCols">
                <BioCard
                  :person="
                    team[(numCols * (row - 1) + (col - 1)) % team.length]
                  "
                  :onclick="callbackFromCard"
                />
              </a-col>
            </a-row>
          </div>
        </div>
        <div class="block">
          <h3>
            <b>Emeritus Team:</b>
          </h3>
          <p>
            Benjamin Golder, Shivang Patwa, David Lung, Rudy Letsche, Miles
            Stemper, Sarah Jensen, Natalia Echeverri
          </p>
        </div>
      </div>
    </div>

    <TheFooter />
  </div>
</template>

<script>
import BigLogo from '@/components/BigLogo'
import BioCard from '@/components/BioCard'
import TheFooter from '@/components/TheFooter'
import ModalLayer from '@/components/Modal'
import theTeam from '@/assets/team.json'

/**
 * get the boundary the card element of the specified person.
 * this is  then returned to be used in the modal layer
 *  */
function getBoundary(person, personsArray, numCols) {
  const index = personsArray.indexOf(person)
  const initBound = document
    .getElementById(person.name.last)
    .getBoundingClientRect()
  const cardWidth = initBound.width
  const margin = 10
  const boundary = {
    top: initBound.top + window.scrollY,
    left: initBound.left,
    width: initBound.width,
    height: initBound.height,
  }

  // determine limit of boundary based on columns
  if (numCols > 1) {
    const end = numCols - 1
    boundary.width += 2 * margin + cardWidth
    if (index % numCols >= 1) {
      // middle  or right side
      if (index % numCols === end) {
        boundary.left -= 2 * margin + cardWidth
      } else {
        boundary.left -= (2 * margin + cardWidth) / 2
      }
    }
  }

  return boundary
}

export default {
  layout: 'standard',
  components: {
    BigLogo,
    BioCard,
    TheFooter,
    ModalLayer,
  },
  data() {
    return {
      team: theTeam,
      modalVisibile: false,
      modalPos: {},
      modalContent: null,
      numRows: null,
      numCols: null,
      logoR: 400,
    }
  },
  beforeMount() {
    // depending on size of table cols and rows change

    // ENHANCEMENT(TK): should use css grid and media query here.
    const adjustTable = () => {
      console.log('adjustTable')

      if (window.innerWidth > 800) {
        this.numCols = 3
      } else if (window.innerWidth > 500) {
        this.numCols = 2
      } else {
        this.numCols = 1
      }
      this.numRows = Math.ceil(this.team.length / this.numCols)
    }

    adjustTable()

    window.addEventListener('resize', adjustTable)

    this.$once('hook:beforeDestroy', () => {
      window.removeEventListener('resize', adjustTable)
    })
  },
  methods: {
    /**
     * callback function thats called when the bioCard is clicked. triggering the modal
     */
    callbackFromCard(person) {
      this.modalVisibile = true
      this.modalContent = person.about
      this.modalPos = getBoundary(person, this.team, this.numCols)
    },

    /**
     * callback function thats called when the modal is offclicked
     */
    callbackFromModal() {
      this.modalVisibile = false
    },
  },
}
</script>
<style lang="scss" scoped>
.team-logo {
  position: absolute;
  z-index: 0;
  transform: translate(-50%, -50%);
  color: black;
  font-size: 1.075em;
}

.rightSide {
  float: right;
  width: 55%;
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
    color: black;
  }

  p {
    // font-family: 'Nunito', sans-serif;
    width: 100%;
    color: #b4ae00;
    font-size: 32px;
  }
}

.team-main {
  color: $text-color-dark;
  font-size: 1.2em;
  z-index: 20;

  .team-content {
    position: relative;
    display: flex;
    padding-top: 10%;
    padding-left: 150px;
    padding-right: 150px;
  }

  .last-row {
    padding-bottom: 10px;
  }
}

.block {
  // font-family: 'Nunito', sans-serif;
  font-size: 24px;
  background-color: #ffffff7d;
  padding: 1vw;
  margin-bottom: 4vh;
}
</style>
