export const state = () => ({
  // state
})

export const getters = {
  // getters
}

export const mutations = {
  // mutations
}

export const actions = {
  // TODO: remove passport
  nuxtServerInit({ commit }, { req }) {
    if (req.session && req.session.passport && req.session.passport.user) {
      commit('auth/SET_USER', req.session.passport.user)
    }
  },
}
