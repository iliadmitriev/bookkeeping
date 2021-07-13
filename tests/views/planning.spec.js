import Planning from "@/views/Planning";
import {mount, createLocalVue} from "@vue/test-utils";

import Vuetify from "vuetify";
import Vue from "vue";

Vue.use(Vuetify)

import Vuex from "vuex";
import VueMeta from "vue-meta";
import titlePlugin from "@/utils/title.plugin"
import store from "@/store"
import localizeFilter from "@/filters/localize.filter";
import numberFilter from "@/filters/number.filter";

const vuetify = new Vuetify()
const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueMeta)
localVue.use(titlePlugin)
localVue.filter('localize', localizeFilter)
localVue.filter('number', numberFilter)

Storage.prototype.getItem = jest.fn(
  key => key === 'locale' && 'ru-RU'
)
const mockOnceVal = jest.fn()
jest.mock('firebase/app', () => ({
    auth: jest.fn().mockReturnThis(),
    currentUser: {
      email: 'user@example.com', uid: 123, emailVerified: true
    },
    initializeApp: jest.fn(),
    database: () => ({
      ref: jest.fn(() => ({
        child: jest.fn().mockReturnThis(),
        once: () => ({
          val: mockOnceVal
        })
      }))
    })
  })
);

describe('Planning.vue view component testsuite', () => {
  let wrapper

  beforeEach(() => {
    mockOnceVal.mockClear()
  })

  it('mount parent component', async () => {
    store.commit('setInfo', {
      bill: 10000,
      locale: 'ru-RU'
    })
    mockOnceVal.mockImplementationOnce(() => ({
      "1000": {
        amount: 3000,
        categoryId: "ID1",
        type: "outcome",
        datetime: "2021-01-30T19:44:00.458Z",
        description: "Рыба"
      },
      "1001": {
        amount: 4000,
        categoryId: "ID1",
        type: "outcome",
        datetime: "2021-01-30T19:44:00.458Z",
        description: "Мясо"
      },
      "1002": {
        amount: 1500,
        categoryId: "ID1",
        type: "outcome",
        datetime: "2021-01-30T19:44:00.458Z",
        description: "Гречка"
      },
      "1003": {
        amount: 3000,
        categoryId: "ID2",
        type: "outcome",
        datetime: "2021-01-30T19:44:00.458Z",
        description: "Такси"
      },
      "1004": {
        amount: 4000,
        categoryId: "ID2",
        type: "outcome",
        datetime: "2021-01-30T19:44:00.458Z",
        description: "Проездной"
      },
      "1005": {
        amount: 2500,
        categoryId: "ID2",
        type: "outcome",
        datetime: "2021-01-30T19:44:00.458Z",
        description: "Такси"
      },
      "1006": {
        amount: 2000,
        categoryId: "ID3",
        type: "outcome",
        datetime: "2021-01-30T19:44:00.458Z",
        description: "Акции"
      },
      "1007": {
        amount: 8000,
        categoryId: "ID3",
        type: "outcome",
        datetime: "2021-01-30T19:44:00.458Z",
        description: "Облигации"
      },
      "1008": {
        amount: 5000,
        categoryId: "ID3",
        type: "outcome",
        datetime: "2021-01-30T19:44:00.458Z",
        description: "Векселя"
      },
    })).mockImplementationOnce(() => ({
      "ID1": {limit: 30000, title: 'Питание'},
      "ID2": {limit: 10000, title: 'Транспорт'},
      "ID3": {limit: 10000, title: 'Инвестиции'},
    }))

    wrapper = mount(Planning, {
      localVue,
      store,
      vuetify
    })

    expect(wrapper.vm.loading).toBe(true)

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()


    expect(wrapper.vm.loading).toBe(false)

  })

})
