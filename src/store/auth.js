import {fbAuth, providerAuth, getProviderForProviderId} from '@/utils/firebase'

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
      return await dispatch('loginWithPopUpProvider', 'google.com')
    },
    async loginWithFacebook({dispatch, commit}) {
      return await dispatch('loginWithPopUpProvider', 'facebook.com')
    },
    async loginWithPopUpProvider({dispatch, commit}, providerId) {

      const provider = getProviderForProviderId(providerId)

      fbAuth.useDeviceLanguage()

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
        const pendingCred = e.credential
        const email = e.email
        if (e.code === 'auth/account-exists-with-different-credential') {
          const methods = await fbAuth.fetchSignInMethodsForEmail(email)
          const popUpMethods = methods.filter( m => (m !== 'password' && m!== providerId ) )
          if (popUpMethods.length) {
            const fallbackProvider = getProviderForProviderId(methods[0])
            const fallbackResult = await fbAuth.signInWithPopup(fallbackProvider)
            await fallbackResult.user.linkAndRetrieveDataWithCredential(pendingCred)

          } else {
            commit('setError', e)
          }
        } else {
          commit('setError', e)
        }
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
