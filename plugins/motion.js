import Vue from 'vue'

export default () => {
  Vue.mixin({
    methods: {
      action1() {
        console.log('action1')
        this.$store.commit('motion/SET_ACTION', 1)
      },
      action2() {
        console.log('action2')
        this.$store.commit('motion/SET_ACTION', 2)
      },
    },
  })
}
