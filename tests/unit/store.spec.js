import {createLocalVue} from "@vue/test-utils";
import Vuex from 'vuex';
import store from '@/store'
import firebase from 'firebase/app';

const localVue = createLocalVue()
localVue.use(Vuex)

global.fetch = jest.fn()
const mockInfoGet = jest.fn(() => ({
  accepted: true,
  bill: 10000,
  locale: "en-US",
  name: "Ivan"
}))
const mockFbUpdate = jest.fn(() => ({}))
const mockFbOnce = jest.fn(() => ({
  val: mockInfoGet
}))
const mockFbSet = jest.fn(() => ({}))
const mockAuthProvider = {
  addScope: jest.fn(),
  setCustomParameters: jest.fn()
}

jest.mock('firebase/app', () => {
  const auth = jest.fn().mockReturnThis()
  auth.GoogleAuthProvider = jest.fn(() => mockAuthProvider)
  auth.FacebookAuthProvider = jest.fn(() => mockAuthProvider)
  auth.GithubAuthProvider = jest.fn(() => mockAuthProvider)
  return {
    auth,
    currentUser: {
      email: 'user@example.com', uid: 123, emailVerified: true
    },
    useDeviceLanguage: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    signInWithPopup: jest.fn(),
    fetchSignInMethodsForEmail: jest.fn(),
    signOut: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
    initializeApp: jest.fn(),
    database: jest.fn(() => ({
      ref: jest.fn(() => ({
        once: mockFbOnce,
        update: mockFbUpdate,
        set: mockFbSet
      }))
    }))
  }
});

describe('Vuex Store modules testsuite', () => {

  describe('Index module tests', () => {
    beforeEach(() => {
      fetch.mockClear();
    });

    it('Fetch currency exchange rate', async () => {
      fetch.mockImplementationOnce(() =>
        Promise.resolve({
          status: 200,
          json: () => Promise.resolve({
            "Date": "2021-07-03T11:30:00+03:00",
            "PreviousDate": "2021-07-02T11:30:00+03:00",
            "PreviousURL": "\/\/www.cbr-xml-daily.ru\/archive\/2021\/07\/02\/daily_json.js",
            "Timestamp": "2021-07-04T23:00:00+03:00",
            "Valute": {
              "USD": {
                "ID": "R01235",
                "NumCode": "840",
                "CharCode": "USD",
                "Nominal": 1,
                "Name": "Доллар США",
                "Value": 73.6175,
                "Previous": 72.9086
              },
              "EUR": {
                "ID": "R01239",
                "NumCode": "978",
                "CharCode": "EUR",
                "Nominal": 1,
                "Name": "Евро",
                "Value": 87.0748,
                "Previous": 86.4113
              }
            }
          }),
        })
      );
      const res = await store.dispatch('fetchCurrency')
      expect(res.Valute.EUR.Value).toBeCloseTo(87.0748)
      expect(res.Valute.USD.Value).toBeCloseTo(73.6175)
      expect(fetch).toBeCalledTimes(1)
      expect(fetch).toBeCalledWith(`https://www.cbr-xml-daily.ru/daily_json.js`, {
        method: 'GET',
        cache: "no-cache",
        redirect: "follow"
      })
    })

    it('Set error and clear error message', () => {
      store.commit('clearError')
      expect(store.getters.error).toBe(null)
      const err = new Error('Test error message')
      store.commit('setError', err)
      expect(store.getters.error).toStrictEqual(err)
    })
  })

  describe('Info module tests', () => {

    beforeEach(() => {
      mockFbOnce.mockClear()
      mockFbUpdate.mockClear()
      mockInfoGet.mockClear()
    })

    it('setInfo mutation', async () => {
      store.commit('setInfo', {
        accepted: true,
        bill: 10000,
        locale: "en-US",
        name: "Ivan"
      })
      expect(store.state.info).toStrictEqual({
        info: {
          accepted: true,
          bill: 10000,
          locale: "en-US",
          name: "Ivan"
        }
      })
      expect(store.getters.info).toStrictEqual({
        accepted: true,
        bill: 10000,
        locale: "en-US",
        name: "Ivan"
      })
    })

    it('clearInfo mutation', async () => {
      store.commit('clearInfo')
      expect(store.state.info).toStrictEqual({info: {}})
      expect(store.getters.info).toStrictEqual({})
    })

    it('fetchInfo action', async () => {

      await store.dispatch('fetchInfo')

      expect(mockInfoGet).toBeCalledTimes(1)

      expect(store.state.info).toStrictEqual({
        info: {
          accepted: true,
          bill: 10000,
          locale: "en-US",
          name: "Ivan"
        }
      })
      expect(store.getters.info).toStrictEqual({
        accepted: true,
        bill: 10000,
        locale: "en-US",
        name: "Ivan"
      })
    })

    it('fetchInfo action throw exception', async () => {
      const testError = new Error('This is error message')
      mockFbOnce.mockImplementationOnce(() => ({
        val: jest.fn(() => {
          throw testError
        })
      }))
      await expect(store.dispatch('fetchInfo'))
        .rejects.toThrowError(testError)
      expect(store.getters.error).toStrictEqual(testError)
      expect(store.getters.info).toStrictEqual({
        accepted: true,
        bill: 10000,
        locale: "en-US",
        name: "Ivan"
      })

    })

    it('updateInfo action', async () => {
      await store.dispatch('updateInfo', {
        name: "John",
        bill: 20000
      })

      expect(store.getters.info).toStrictEqual({
        accepted: true,
        bill: 20000,
        locale: "en-US",
        name: "John"
      })

    })

    it('updateInfo action throw exception', async () => {
      const testError = new Error('This is test error message')
      mockFbUpdate.mockImplementationOnce(() => {
        throw testError
      })
      await expect(store.dispatch('updateInfo', {}))
        .rejects.toThrowError(testError)
      expect(store.getters.error).toStrictEqual(testError)
      expect(store.getters.info).toStrictEqual({
        accepted: true,
        bill: 20000,
        locale: "en-US",
        name: "John"
      })

    })

    it('fetchOrCreateInfo action fallback with partial data and without info', async () => {
      mockFbOnce.mockImplementationOnce(() => ({
        val: jest.fn(() => undefined)
      }))

      await store.dispatch('fetchOrCreateInfo', {
        bill: 10000,
        name: "Ivan"
      })

      expect(store.getters.info).toStrictEqual({
        accepted: true,
        bill: 10000,
        locale: "ru-RU",
        name: "Ivan"
      })

    })

    it('fetchOrCreateInfo action fallback without info', async () => {
      mockFbOnce.mockImplementationOnce(() => ({
        val: jest.fn(() => undefined)
      }))

      await store.dispatch('fetchOrCreateInfo', {
        accepted: true,
        bill: 10000,
        locale: "ru-RU",
        name: "Ivan"
      })

      expect(store.getters.info).toStrictEqual({
        accepted: true,
        bill: 10000,
        locale: "ru-RU",
        name: "Ivan"
      })

    })

    it('fetchOrCreateInfo action with info', async () => {
      mockFbOnce.mockImplementationOnce(() => ({
        val: jest.fn(() => ({
          accepted: true,
          bill: 20000,
          locale: "en-US",
          name: "John"
        }))
      }))

      await store.dispatch('fetchOrCreateInfo', {
        accepted: true,
        bill: 20000,
        locale: "en-US",
        name: "John"
      })

      expect(store.getters.info).toStrictEqual({
        accepted: true,
        bill: 20000,
        locale: "en-US",
        name: "John"
      })

    })

    it('fetchOrCreateInfo action with throw error', async () => {
      const testError = new Error('This is test error message')
      mockFbOnce.mockImplementationOnce(() => ({
        val: jest.fn(() => {
          throw testError
        })
      }))

      await expect(store.dispatch('fetchOrCreateInfo', {
        accepted: true,
        bill: 10000,
        locale: "ru-RU",
        name: "Ivan"
      })).rejects.toThrowError(testError)

      expect(store.getters.error).toStrictEqual(testError)

    })

  })

  describe('Auth module tests', () => {
    beforeEach(() => {
      mockFbOnce.mockClear()
      mockFbUpdate.mockClear()
      mockInfoGet.mockClear()
      firebase.auth().useDeviceLanguage.mockClear()
      firebase.auth().signInWithPopup.mockClear()
      firebase.auth().fetchSignInMethodsForEmail.mockClear()
      firebase.auth().signOut.mockClear()
      firebase.auth().createUserWithEmailAndPassword.mockClear()
      firebase.auth().sendPasswordResetEmail.mockClear()

    })

    it('login with user and password', async () => {
      mockFbOnce.mockImplementationOnce(() => ({
        val: jest.fn(() => ({
          accepted: true,
          bill: 1500,
          locale: "ru-RU",
          name: "James"
        }))
      }))
      firebase.auth().signInWithEmailAndPassword
        .mockImplementationOnce(() => ({
          user: {
            email: 'user@example.com', uid: 123, emailVerified: true
          }
        }))

      await store.dispatch('login', {
        email: 'user@example.com',
        password: 'secret'
      })

      expect(firebase.auth().signInWithEmailAndPassword)
        .toBeCalledTimes(1)
      expect(firebase.auth().signInWithEmailAndPassword)
        .toBeCalledWith('user@example.com', 'secret')
      expect(store.getters.info).toStrictEqual({
        accepted: true,
        bill: 1500,
        locale: "ru-RU",
        name: "James"
      })
    })

    it('login with user and password throws exception', async () => {
      const testError = new Error('Test error message')
      firebase.auth().signInWithEmailAndPassword
        .mockImplementationOnce(() => {
          throw testError
        })

      await expect(store.dispatch('login', {
        email: 'user@example.com',
        password: 'secret'
      })).rejects.toThrowError(testError)
      expect(store.getters.error).toStrictEqual(testError)
    })

    it('login with google provider', async () => {
      mockFbOnce.mockImplementationOnce(() => ({
        val: jest.fn(() => ({
          accepted: true,
          bill: 1500,
          locale: "ru-RU",
          name: "James"
        }))
      }))
      firebase.auth().signInWithPopup.mockImplementationOnce(() => ({
        user: {
          email: 'user5@example.com', uid: 234, emailVerified: true,
          displayName: 'John'
        }
      }))

      await store.dispatch('loginWithGoogle')
      expect(firebase.auth().useDeviceLanguage).toBeCalledTimes(1)

      expect(firebase.auth().signInWithPopup).toBeCalledTimes(1)
      expect(firebase.auth().signInWithPopup).toBeCalledWith(mockAuthProvider)

      expect(store.getters.info).toStrictEqual({
        accepted: true,
        bill: 1500,
        locale: "ru-RU",
        name: "James"
      })

    })

    it('login with facebook provider', async () => {
      mockFbOnce.mockImplementationOnce(() => ({
        val: jest.fn(() => ({
          accepted: true,
          bill: 2500,
          locale: "en-US",
          name: "Sam"
        }))
      }))
      firebase.auth().signInWithPopup.mockImplementationOnce(() => ({
        user: {
          email: 'user5@example.com', uid: 234, emailVerified: true,
          displayName: 'John'
        }
      }))


      await store.dispatch('loginWithFacebook')
      expect(firebase.auth().useDeviceLanguage).toBeCalledTimes(1)
      expect(firebase.auth().signInWithPopup).toBeCalledTimes(1)
      expect(firebase.auth().signInWithPopup).toBeCalledWith(mockAuthProvider)

      expect(store.getters.info).toStrictEqual({
        accepted: true,
        bill: 2500,
        locale: "en-US",
        name: "Sam"
      })

    })

    it('login with github provider', async () => {
      mockFbOnce.mockImplementationOnce(() => ({
        val: jest.fn(() => ({
          accepted: true,
          bill: 3500,
          locale: "ru-RU",
          name: "Ted"
        }))
      }))
      firebase.auth().signInWithPopup.mockImplementationOnce(() => ({
        user: {
          email: 'user10@example.com', uid: 234, emailVerified: true,
          displayName: 'Theodore'
        }
      }))


      await store.dispatch('loginWithGithub')
      expect(firebase.auth().useDeviceLanguage).toBeCalledTimes(1)
      expect(firebase.auth().signInWithPopup).toBeCalledTimes(1)
      expect(firebase.auth().signInWithPopup).toBeCalledWith(mockAuthProvider)

      expect(store.getters.info).toStrictEqual({
        accepted: true,
        bill: 3500,
        locale: "ru-RU",
        name: "Ted"
      })

    })

    it('login with google provider throwing account exists exception', async () => {
      await store.commit('clearError')
      const mockLink = jest.fn()

      const errorAccount = new Error('Account exists with a different credential')
      errorAccount.code = 'auth/account-exists-with-different-credential'
      errorAccount.email = 'user15@example.com'
      errorAccount.credential = 'pending-credentials'
      firebase.auth().signInWithPopup
        .mockImplementationOnce(() => {
          throw errorAccount
        })
        .mockImplementationOnce(() => ({
          user: {
            email: 'user10@example.com', uid: 234, emailVerified: true,
            displayName: 'Theodore',
            linkAndRetrieveDataWithCredential: mockLink
          }
        }))
      firebase.auth().fetchSignInMethodsForEmail
        .mockImplementationOnce(() => (['google.com', 'another-provider.com']))

      await store.dispatch('loginWithGoogle')
      expect(firebase.auth().useDeviceLanguage).toBeCalledTimes(1)

      expect(firebase.auth().signInWithPopup).toBeCalledTimes(2)
      expect(firebase.auth().signInWithPopup).toBeCalledWith(mockAuthProvider)
      expect(firebase.auth().signInWithPopup).toBeCalledWith(mockAuthProvider)
      expect(firebase.auth().fetchSignInMethodsForEmail).toBeCalledTimes(1)
      expect(firebase.auth().fetchSignInMethodsForEmail).toBeCalledWith('user15@example.com')

      expect(mockLink).toBeCalledTimes(1)
      expect(mockLink).toBeCalledWith('pending-credentials')
      expect(store.getters.error).toBe(null)

    })

    it('login with github provider throwing account exists exception without fallback', async () => {
      await store.commit('clearError')
      const errorAccount = new Error('Account exists with a different credential')
      errorAccount.code = 'auth/account-exists-with-different-credential'
      errorAccount.email = 'user16@example.com'
      errorAccount.credential = 'pending-credentials'
      firebase.auth().signInWithPopup
        .mockImplementationOnce(() => {
          throw errorAccount
        })
      firebase.auth().fetchSignInMethodsForEmail
        .mockImplementationOnce(() => (['github.com']))

      await store.dispatch('loginWithGithub')
      expect(firebase.auth().useDeviceLanguage).toBeCalledTimes(1)

      expect(firebase.auth().signInWithPopup).toBeCalledTimes(1)
      expect(firebase.auth().signInWithPopup).toBeCalledWith(mockAuthProvider)
      expect(firebase.auth().fetchSignInMethodsForEmail).toBeCalledTimes(1)
      expect(firebase.auth().fetchSignInMethodsForEmail).toBeCalledWith('user16@example.com')

      expect(store.getters.error).toBe(errorAccount)

    })

    it('login with facebook provider throwing exception user disabled', async () => {
      await store.commit('clearError')
      const errorAccount = new Error('Account exists with a different credential')
      errorAccount.code = 'auth/user-not-found'
      errorAccount.email = 'user17@example.com'
      errorAccount.credential = 'credentials'
      firebase.auth().signInWithPopup
        .mockImplementationOnce(() => {
          throw errorAccount
        })
      firebase.auth().fetchSignInMethodsForEmail
        .mockImplementationOnce(() => (['facebook.com']))

      await store.dispatch('loginWithFacebook')
      expect(firebase.auth().useDeviceLanguage).toBeCalledTimes(1)

      expect(firebase.auth().signInWithPopup).toBeCalledTimes(1)
      expect(firebase.auth().signInWithPopup).toBeCalledWith(mockAuthProvider)
      expect(firebase.auth().fetchSignInMethodsForEmail).toBeCalledTimes(0)

      expect(store.getters.error).toBe(errorAccount)

    })

    it('logout', async () => {

      await store.dispatch('logout')
      expect(firebase.auth().signOut).toBeCalledTimes(1)
      expect(store.getters.info).toStrictEqual({})
    })

    it('register with login and password', async () => {
      mockFbOnce.mockImplementationOnce(() => ({
        val: jest.fn(() => undefined)
      }))

      await store.dispatch('register', {
        email: 'email18@exmaple.com',
        password: 'secret',
        name: 'Dave',
        accepted: true
      })
      expect(firebase.auth().createUserWithEmailAndPassword).toBeCalledTimes(1)
      expect(firebase.auth().createUserWithEmailAndPassword).toBeCalledWith('email18@exmaple.com', 'secret')

      expect(store.getters.info).toStrictEqual({
        accepted: true,
        bill: 10000,
        locale: 'ru-RU',
        name: 'Dave'
      })
    })

    it('register with login and password throwing error', async () => {
      await store.commit('clearInfo')
      await store.commit('clearError')
      const createError = new Error('User register error')
      firebase.auth().createUserWithEmailAndPassword
        .mockImplementationOnce(() => {
          throw createError
        })

       await expect(store.dispatch('register', {
        email: 'email19@exmaple.com',
        password: 'secret',
        name: 'Mike',
        accepted: true
      })).rejects.toThrowError(createError)
      expect(firebase.auth().createUserWithEmailAndPassword).toBeCalledTimes(1)
      expect(firebase.auth().createUserWithEmailAndPassword).toBeCalledWith('email19@exmaple.com', 'secret')

      expect(store.getters.info).toStrictEqual({})
      expect(store.getters.error).toBe(createError)
    })

    it('send password reset email (forgot)', async () => {

      await store.dispatch('forgot', 'user20@example.com')

      expect(firebase.auth().sendPasswordResetEmail).toBeCalledTimes(1)
      expect(firebase.auth().sendPasswordResetEmail).toBeCalledWith('user20@example.com')
    })

    it('send password reset email throwing error', async () => {
      const forgotError = new Error('Forgot email recovering error')
      firebase.auth().sendPasswordResetEmail.mockImplementationOnce(() => {
        throw forgotError
      })

      await expect(store.dispatch('forgot', 'user20@example.com'))
        .rejects.toThrowError(forgotError)

      expect(firebase.auth().sendPasswordResetEmail).toBeCalledTimes(1)
      expect(firebase.auth().sendPasswordResetEmail).toBeCalledWith('user20@example.com')
    })

    it('call getUid when used is null', async () => {
      firebase.auth().currentUser = null
      expect(await store.dispatch('getUid')).toBe(null)
    })
  })

  describe('Record module tests', () => {
  })

  describe('Category module tests', () => {
  })

})
