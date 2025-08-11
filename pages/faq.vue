<template>
  <div>
    <div class="faq">
      <div
        v-for="(label, index) in labels"
        :key="`${label}`"
        @click="swap(index)"
      >
        <FaqCard
          :label="label.toUpperCase()"
          :questions="questions ? questions[label] : null"
          :selected="active && index === 3"
          :style="{ position: active && index !== 3 ? 'fixed' : null }"
          :info="positions[index + labels.length * active]"
        />
      </div>
    </div>
    <TheFooter />
  </div>
</template>

<script>
import TheFooter from '@/components/TheFooter'
import FaqCard from '@/components/FaqCard'

const csvUrl =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQdoYII_80XDj7Ez-gbBvDluGxOm4X66CNpNV4T-uqL5Ygn7wbG_G6BEfiB9Oj7Nw_RnZ2FwJw6d2T7/pubhtml'

export default {
  layout: 'standard',
  components: {
    TheFooter,
    FaqCard,
  },
  data: function() {
    return {
      labels: ['app', 'desktop', 'account', 'introduction'],
      questions: null,
      positions: [
        // in % width and height  of parent div
        // non-active mode
        { top: 27.5, left: 30, width: 20, height: 20 },
        { top: 27.5, left: 52.5, width: 20, height: 20 },
        { top: 52.5, left: 30, width: 20, height: 20 },
        { top: 52.5, left: 52.5, width: 20, height: 20 },
        // active mode
        { top: 5, left: 3, width: 20, height: 20 },
        { top: 30, left: 3, width: 20, height: 20 },
        { top: 55, left: 3, width: 20, height: 20 },
        { top: 5, left: 25, width: 72, height: 20 },
      ],
      active: false,
    }
  },
  beforeMount() {
    // since google won't fix CORS policy, we will parse the html of the csv webpage itself
    this.$axios.get(csvUrl).then(res => {
      // rows in table have columns 'index' 'category' 'question' 'answer' with first row being column names
      const table = new DOMParser()
        .parseFromString(res.data, 'text/html')
        .getElementsByTagName('tbody')[0]

      const rows = table.getElementsByTagName('tr')

      const data = {}
      // start with i=1 to avoid title row
      for (let i = 1; i < rows.length; i++) {
        const columns = rows[i].getElementsByTagName('td')
        const category = columns[1].textContent
        const question = columns[2].textContent
        const answer = columns[3].textContent

        if (!data[category]) {
          data[category] = []
        }

        data[category].push({
          question: question,
          answer: answer || 'No Answer Yet',
        })
      }

      this.questions = data
    })
  },
  methods: {
    swap(index) {
      this.active = true
      const temp = Array.from(this.labels)
      temp[3] = this.labels[index]
      temp[index] = this.labels[3]
      this.labels = temp
    },
  },
}
</script>

<style lang="scss" scoped>
.faq {
  position: relative;
  min-height: 85vh;
}
</style>
