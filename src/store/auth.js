import {fbAuth, db} from '@/utils/firebase'

export default {

  actions: {
    async login({dispatch, commit}, {email, password}) {
      try {
        await fbAuth.signInWithEmailAndPassword(email, password)
      } catch (err) {
        commit('setError', err)
        throw err
      }
    },
    async logout() {
      await fbAuth.signOut()
    },
    async register({dispatch, commit}, {email, password, name, accepted}) {
      try {
        await fbAuth.createUserWithEmailAndPassword(email, password)
        const uid = await dispatch('getUid')
        await db.ref(`/users/${uid}/info`).set({
          bill: 10000,
          name: name,
          accepted: accepted
        })
      } catch (err) {
        commit('setError', err)
        throw err
      }
    },
    getUid() {
      const user = fbAuth.currentUser
      return user ? user.uid : null
    }
  }

}
