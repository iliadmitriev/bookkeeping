import {fbAuth, providerAuth, db} from '@/utils/firebase'

export default {

  actions: {
    async login({dispatch, commit}, {email, password}) {
      try {
        const {user} = await fbAuth.signInWithEmailAndPassword(email, password)
        await dispatch('fetchOrCreateInfo', {
          uid: user.uid
        })
      } catch (err) {
        commit('setError', err)
        throw err
      }
    },
    async loginWithGoogle({dispatch, commit}) {

      const provider = new providerAuth.GoogleAuthProvider()

      provider.addScope('openid');
      provider.addScope('profile');
      provider.addScope('email');

      // To apply the default browser preference instead of explicitly setting it.
      fbAuth.useDeviceLanguage();

      try {
        const result = await fbAuth.signInWithPopup(provider)
        const user = result.user
        const uid = user.uid

        await dispatch('fetchOrCreateInfo', {
          uid,
          name: user.displayName,
          bill: 10000,
          accepted: true
        })

      } catch (e) {
        console.log(e)
        commit('setError', e)
      }
    },
    async logout({commit}) {
      await fbAuth.signOut()
      commit('clearInfo')
    },
    async register({dispatch, commit}, {email, password, name, accepted}) {
      try {
        await fbAuth.createUserWithEmailAndPassword(email, password)
        const uid = await dispatch('getUid')
        await dispatch('fetchOrCreateInfo', {
          uid,
          name: name,
          bill: 10000,
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
