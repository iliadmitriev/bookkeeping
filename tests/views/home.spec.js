import Home from "@/views/Home";
import HomeCurrency from "@/components/HomeCurrency";
import HomeAccount from "@/components/HomeAccount";

import {mount, createLocalVue} from "@vue/test-utils";

import Vuetify from "vuetify";
import Vue from "vue";

Vue.use(Vuetify)

import Vuex from "vuex";
import VueMeta from "vue-meta";
import titlePlugin from "@/utils/title.plugin"
import store from "@/store"
import localizeFilter from "@/filters/localize.filter";
import currencyFilter from "@/filters/currency.filter";

const vuetify = new Vuetify()
const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueMeta)
localVue.use(titlePlugin)
localVue.filter('localize', localizeFilter)
localVue.filter('currency', currencyFilter)

Storage.prototype.getItem = jest.fn(
  key => key === 'locale' && 'ru-RU'
)


global.fetch = jest.fn()

describe('Home.vue view component testsuite', () => {
  let wrapper

  beforeEach(() => {
    fetch.mockClear()
  })

  it('mount parent component', async () => {
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
    store.commit('setInfo', {
      bill: 10000,
      locale: 'ru-RU'
    })
    wrapper = mount(Home, {
      localVue,
      vuetify,
      store
    })

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    const homeCurrency = wrapper.findComponent(HomeCurrency)
    const homeAccount = wrapper.findComponent(HomeAccount)
    expect(homeCurrency.exists()).toBe(true)
    expect(homeAccount.exists()).toBe(true)
  })

  it('update component', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve({
          "Date": "2021-07-12T11:30:00+03:00",
          "PreviousDate": "2021-07-12T11:30:00+03:00",
          "PreviousURL": "\/\/www.cbr-xml-daily.ru\/archive\/2021\/07\/02\/daily_json.js",
          "Timestamp": "2021-07-12T23:00:00+03:00",
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

    await wrapper.vm.refresh()

    await wrapper.vm.$nextTick()
    const homeCurrency = wrapper.findComponent(HomeCurrency)
    const homeAccount = wrapper.findComponent(HomeAccount)

    expect(homeCurrency.exists()).toBe(true)
    expect(homeAccount.exists()).toBe(true)

  })

  it('update component with reject', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.reject(null)
    );

    await expect(wrapper.vm.refresh()).resolves.toBe(undefined)

    await wrapper.vm.$nextTick()

  })

})
