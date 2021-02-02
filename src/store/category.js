import {db} from '@/utils/firebase'

export default {
  actions: {
    async createCategory({commit, dispatch}, {title, limit}) {
      try {
        const uid = await dispatch('getUid')
        const category = await db.ref(`/users/${uid}/categories`).push({title, limit})
        return {title, limit, id: category.key}
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    async updateCategory({commit, dispatch}, {title, limit, id}) {
      try {
        const uid = await dispatch('getUid')
        const category = await db.ref(`/users/${uid}/categories`)
          .child(id)
          .update({title, limit})
        return category
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    async fetchCategories({commit, dispatch}) {
      try {
        const uid = await dispatch('getUid')
        const categories = (await db.ref(`/users/${uid}/categories`).once('value')).val() || {}

        return Object.entries(categories).map(el=>({id:el[0], ...el[1]}))
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    async fetchCategoryById({commit, dispatch}, id) {
      try {
        const uid = await dispatch('getUid')
        const category = (await db.ref(`/users/${uid}/categories`).child(id).once('value')).val() || {}
        return {...category, id}
      } catch (e) {
        commit('setError', e)
        throw e
      }
    }
  }
}
