import {db} from '@/utils/firebase'

export default {
  actions: {
    async fetchRecords({dispatch, commit}) {
      try {
        const uid = await dispatch('getUid')
        const records = (await db.ref(`/users/${uid}/records`).once('value')).val() || {}
        return Object.entries(records).map(el => ({id: el[0], ...el[1]}))
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    async createRecord({dispatch, commit}, record) {
      try {
        const uid = await dispatch('getUid')
        return await db.ref(`/users/${uid}/records`).push(record)
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    async fetchRecordById({dispatch, commit}, id) {
      try {
        const uid = await dispatch('getUid')
        const record = (await db.ref(`/users/${uid}/records`).child(id).once('value')).val() || {}
        return {...record, id}
      } catch (e) {
        commit('setError', e)
        throw e
      }
    }
  }
}
