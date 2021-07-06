import {createLocalVue} from "@vue/test-utils";
import Vuex from 'vuex';
import store from '@/store'

const localVue = createLocalVue()
localVue.use(Vuex)

global.fetch = jest.fn()
const mockFbInfoUpdate = jest.fn(() => ({}))
const mockFbInfoGet = jest.fn(() => ({
  accepted: true,
  bill: 10000,
  locale: "en-US",
  name: "Ivan"
}))

jest.mock('firebase/app', () => ({
  auth: jest.fn(() => ({
    currentUser: {
      email: 'user@example.com', uid: 123, emailVerified: true
    }
  })),
  initializeApp: jest.fn(),
  database: jest.fn(() => ({
    ref: jest.fn(() => ({
      once: jest.fn(() => ({
        val: mockFbInfoGet
      })),
      update: mockFbInfoUpdate
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

      expect(mockFbInfoGet).toBeCalledTimes(1)

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

  })

})
