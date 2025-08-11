import { auth } from '@/services/firebase'

export const state = () => ({
  user: null,
})

export const getters = {
  // getters
}

export const mutations = {
  SET_USER: function(state, user) {
    state.user = user
  },
}

export const actions = {
  signup({ commit }, { email }) {
    const host = window.location.origin

    const actionCodeSettings = {
      // URL you want to redirect back to.
      // URL must be whitelisted in the Firebase Console.
      url: `${host}/signin`,
      // This must be true.
      handleCodeInApp: true,
    }

    return auth.sendSignInLinkToEmail(email, actionCodeSettings).then(() => {
      // The link was successfully sent. Inform the user.
      // Save the email locally so you don't need to ask the user for it again
      // if they open the link on the same device.
      window.localStorage.setItem('emailForSignIn', email)
    })
  },
  signin({ commit }, { email, link }) {
    return this.$axios
      .post('/api/users/signin', {
        email,
        link,
      })
      .then(res => {
        console.log(res)

        if (res.status === 401) {
          throw new Error('Bad credentials')
        } else {
          return res.data
        }
      })
      .then(({ user, msg }) => {
        if (user) {
          commit('SET_USER', user)
          return { user }
        } else {
          return { user, err: msg }
        }
      })
  },
  signout({ commit }) {
    return this.$axios.$post('/api/users/signout', {}).then(() => {
      commit('SET_USER', null)
    })
  },
  login({ commit }, { username, password }) {
    return this.$axios
      .$post('/api/users/login', {
        username,
        password,
      })
      .then(res => {
        if (res.status === 401) {
          throw new Error('Bad credentials')
        } else {
          return res
        }
      })
      .then(({ user }) => {
        if (user) commit('SET_USER', user)
        return !!user
      })
  },
  logout({ commit }) {
    return this.$axios.$post('/api/users/logout', {}).then(() => {
      commit('SET_USER', null)
    })
  },
}
