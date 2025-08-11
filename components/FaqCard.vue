<template>
  <div
    :class="
      selected
        ? 'container positioned-relative'
        : 'container positioned-absolute'
    "
    :style="getStyle()"
  >
    <div v-if="selected">
      <div style="display: flex;">
        <div class="faq-left-side">
          <h3>LOCAL CODE</h3>
          <h2>{{ label }}</h2>
        </div>

        <div class="faq-right-side">
          <div
            v-for="(question, index) in questions"
            :key="`${label}-question-${index}`"
          >
            <h1
              class="question"
              :style="{
                color: openQuestions.includes(index) ? '#b4ae00' : null,
              }"
              @click="toggleQuestion(index)"
            >
              {{ question.question }}
            </h1>
            <p
              v-if="openQuestions.includes(index)"
              :id="`answer-${label}-${index}`"
            >
              {{ question.answer }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <h3>LOCAL CODE</h3>
      <h2>{{ label }}</h2>
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap'
// import htmlContent from '@/htmlContent'

/*
using vue state tansition docs and GreenSock.js 
https://vuejs.org/v2/guide/transitioning-state.html
*/

function removeItem(arr, value) {
  const index = arr.indexOf(value)
  if (index > -1) {
    arr.splice(index, 1)
  }
  return arr
}

export default {
  name: 'FaqCard',
  props: ['info', 'label', 'selected', 'questions'],
  data: function() {
    return {
      tweenedTop: this.info.top,
      tweenedLeft: this.info.left,
      tweenedHeight: this.info.height,
      tweenedWidth: this.info.width,
      openQuestions: [],
    }
  },
  watch: {
    info: function(newValue) {
      const duration = 0.5
      gsap.to(this.$data, { duration, tweenedTop: newValue.top })
      gsap.to(this.$data, { duration, tweenedLeft: newValue.left })
      gsap.to(this.$data, { duration, tweenedWidth: newValue.width })
      gsap.to(this.$data, { duration, tweenedHeight: newValue.height })
    },
  },
  updated() {
    if (!this.selected) {
      this.openQuestions = []
    }
  },

  methods: {
    toggleQuestion(index) {
      const temp = this.openQuestions
      if (this.openQuestions.includes(index)) {
        this.openQuestions = removeItem(temp, index)
      } else {
        this.openQuestions.push(index)
      }
    },
    getStyle() {
      // styling depends on whether or not the card is currently selected
      return this.selected
        ? {
            left: `${this.tweenedLeft}%`,
            top: `${this.tweenedTop}vh`,
            minHeight: `${this.tweenedHeight}vh`,
            width: `${this.tweenedWidth}%`,
          }
        : {
            left: `${this.tweenedLeft}%`,
            top: `${this.tweenedTop}%`,
            height: `${this.tweenedHeight}%`,
            width: `${this.tweenedWidth}%`,
          }
    },
  },
}
</script>

<style lang="scss" scoped>
.positioned-absolute {
  position: absolute;
}
.positioned-relative {
  position: relative;
  margin-bottom: 10vh;
}

.container {
  background-color: #ffffff50;
  margin-top: 20px;
  padding: 20px;
  user-select: none;
  text-align: right;
  justify-content: right;
  // font-family: 'Nunito', sans-serif;

  display: flex;
  justify-content: flex-end;
  align-items: center;

  h3 {
    font-size: 18px;
    line-height: 18px;
    // font-family: 'Roboto', sans-serif;
    color: black;
    font-weight: 600;
  }
  h2 {
    font-size: 32px;
    line-height: 32px;
    color: #b4ae00;

    margin-bottom: 0px;
  }

  h1 {
    cursor: pointer;
    font-size: 20px;
  }

  .question:hover {
    color: #b4ae00;
  }

  p {
    font-size: 16px;
  }
}

.faq-left-side {
  position: sticky;
  top: 10vh;
  padding: 0px;
  float: left;
  justify-content: right;
  text-align: right;
  // width: 30%;
  padding-right: 3em;
}

.faq-right-side {
  text-align: left;
  justify-content: left;
  padding: 0px;
  position: relative;
  float: right;
  max-width: 75%;
}
</style>
