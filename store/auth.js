import { graphqlOperation } from 'aws-amplify'

import { api, auth } from '@/services/amplify'
import * as queries from '@/graphql/queries'

export const state = () => ({
  user: null,
  isAuthenticated: false,
})

export const getters = {
  // getters
}

export const mutations = {
  SET_USER: function(state, user) {
    console.log('SET_USER', { state, user })
    state.isAuthenticated = !!user
    state.user = user
  },
}

export const actions = {
  async check({ state, commit, dispatch }) {
    if (state.isAuthenticated) return true

    console.log('store/auth check')

    try {
      const user = await auth.currentAuthenticatedUser()
      const email = user.attributes.email
      console.log('store/auth check', email, { user })

      if (user) {
        const userId = await api
          .graphql(graphqlOperation(queries.getUserIdFromDb))
          .then(res => {
            const data = res.data
            const userId = data.getUserIdFromDB
            return userId
          })

        console.log('userId', userId)

        if (userId) {
          user.id = userId
          commit('SET_USER', user)
          return true
        }
      }
    } catch (error) {
      commit('SET_USER', null)
      return false
    }

    commit('SET_USER', null)
    return false
  },
  async signup(_, { email, password }) {
    const user = await auth.signUp({
      username: email,
      password,
    })
    return user
  },
  confirmSignUp(_, { email, code }) {
    return auth.confirmSignUp(email, code)
  },
  async signin({ commit }, { email, password }) {
    const user = await auth.signIn(email, password)

    if (!user) return

    return this.$axios
      .post('/api/users/signin', {
        email,
        link: 'link',
      })
      .then(res => {
        console.log('store/auth signin', { res })

        if (res.status === 401) {
          throw new Error('Bad credentials')
        } else {
          return res.data
        }
      })
      .then(({ user }) => {
        if (user) {
          commit('SET_USER', user)
          return { user }
        }
      })
  },
  async signout({ commit }) {
    await auth.signOut()
    commit('SET_USER', null)
  },
}
