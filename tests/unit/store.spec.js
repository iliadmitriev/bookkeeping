import {createLocalVue} from "@vue/test-utils";
import Vuex from 'vuex';
import store from '@/store'

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

jest.mock('firebase/app', () => ({
  auth: jest.fn(() => ({
    currentUser: {
      email: 'user@example.com', uid: 123, emailVerified: true
    }
  })),
  initializeApp: jest.fn(),
  database: jest.fn(() => ({
    ref: jest.fn(() => ({
      once: mockFbOnce,
      update: mockFbUpdate,
      set: mockFbSet
    }))
  }))
}));


describe('Vuex Store modules testsuite', () => {
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
        val: () => {
          throw testError
        }
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
        val: () => null
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
        val: () => null
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
        val: () => ({
          accepted: true,
          bill: 20000,
          locale: "en-US",
          name: "John"
        })
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
        val: () => {
          throw testError
        }
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

})
