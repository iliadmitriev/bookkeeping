import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import info from './info'
import category from "./category";

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
      const res = await fetch(`https://www.cbr-xml-daily.ru/daily_json.js`, {
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
    auth, info, category
  }
})
