import {db} from '@/utils/firebase'

export default {
  state: {
    info: {}
  },
  mutations: {
    setInfo(state, info) {
      state.info = info
    },
    clearInfo(state) {
      state.info = {}
    }
  },
  actions: {
    async fetchInfo({dispatch, commit}) {
      try {
        const uid = await dispatch('getUid')
        const info = (await db.ref(`/users/${uid}/info`).once('value')).val()
        commit('setInfo', info)
        return info
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    async updateInfo({dispatch, commit, getters}, toUpdate) {
      try {
        const uid = await dispatch('getUid')
        const updateData = {...getters.info, ...toUpdate}
        await db.ref(`/users/${uid}/info`).update(toUpdate)
        commit('setInfo', updateData)
      } catch (e) {
        commit('setError', e)
        throw e
      }

    },
    async fetchOrCreateInfo({dispatch, commit}, fallbackUser) {
      try {
        const uid = await dispatch('getUid')
        const prevInfo = (await db.ref(`/users/${uid}/info`).once('value')).val()
        const info = {
          bill: prevInfo && prevInfo.bill ? prevInfo.bill : fallbackUser.bill,
          name: prevInfo && prevInfo.name ? prevInfo.name : fallbackUser.name,
          accepted: prevInfo && prevInfo.accepted ? prevInfo.accepted : fallbackUser.accepted || true,
          locale: prevInfo && prevInfo.locale ? prevInfo.locale : fallbackUser.locale || 'ru-RU'
        }
        await db.ref(`/users/${uid}/info`).set(info)
        commit('setInfo', info)
      } catch (e) {
        commit('setError', e)
        throw e
      }
    }
  },
  getters: {
    info: s => s.info
  }
}
