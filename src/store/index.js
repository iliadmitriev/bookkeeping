import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import info from './info'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    error: null
  },
  mutations: {
    setError(state, error) {
      state.error = error
    },
    clearError(state) {
      state.error = null
    }
  },
  actions: {
    async fetchCurrency() {
      const key = process.env.VUE_APP_FIXER
      const res = await fetch(`http://data.fixer.io/api/latest?symbols=USD,EUR,RUB&access_key=${key}`, {
        method: 'GET',
        cache: "no-cache",
        redirect: "follow"
      })
      return await res.json()
    }
  },
  getters: {
    error: s => s.error
  },
  modules: {
    auth, info
  }
})
