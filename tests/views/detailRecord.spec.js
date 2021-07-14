import DetailRecord from "@/views/DetailRecord";
import {createLocalVue, mount} from "@vue/test-utils";

import Vuetify from "vuetify";
import Vue from "vue";

Vue.use(Vuetify)

import Vuex from "vuex";
import VueMeta from "vue-meta";
import titlePlugin from "@/utils/title.plugin"
import store from "@/store"
import dateFilter from "@/filters/date.filter";
import localizeFilter from "@/filters/localize.filter";
import numberFilter from "@/filters/number.filter";

const vuetify = new Vuetify()
const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueMeta)
localVue.use(titlePlugin)
localVue.filter('localize', localizeFilter)
localVue.filter('number', numberFilter)
localVue.filter('date', dateFilter)

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

describe('DetailRecord.vue view component testsuite', () => {
  let wrapper

  beforeEach(() => {
    mockOnceVal.mockClear()
  })

  it.each([
    {type: "outcome", typeName: "Расходы", typeClass: "red"},
    {type: "income", typeName: "Доход", typeClass: "green"}

  ])
  ('mount component of type $type',
    async ({type, typeName, typeClass}) => {
      mockOnceVal.mockImplementationOnce(() => ({
        amount: 3000,
        categoryId: "ID1",
        type: type,
        datetime: "2021-01-30T19:44:00.458Z",
        description: "Рыба"
      })).mockImplementationOnce(() => ({
        limit: 30000, title: 'Питание',
      }))
      store.commit('clearError')

      wrapper = mount(DetailRecord, {
        localVue,
        store,
        vuetify,
        stubs: ['router-link'],
        mocks: {
          $route: {
            params: {
              recordId: 1001
            }
          }
        }
      })

      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()

      expect(mockOnceVal).toBeCalledTimes(2)
      expect(store.getters.error).toBe(null)
      expect(wrapper.vm.record).toStrictEqual({
        id: 1001,
        amount: 3000,
        categoryId: "ID1",
        categoryName: "Питание",
        type: type,
        datetime: new Date("2021-01-30T19:44:00.458Z"),
        description: "Рыба",
        typeClass: typeClass,
        typeName: typeName,
      })
      expect(wrapper.vm.loading).toBe(false)
      expect(wrapper.vm.pathItems).toStrictEqual([
        {text: 'История', to: '/history', link: true, disabled: false},
        {text: typeName, to: '/history/id', link: true, disabled: true}
      ])

    })

  it('mount component throw exception', async () => {
    store.commit('clearError')
    const testError = new Error('Test error')
    mockOnceVal.mockImplementationOnce(() => {
      throw testError
    })
      .mockImplementationOnce(() => null)

    const wp = mount(DetailRecord, {
      localVue,
      store,
      vuetify,
      stubs: ['router-link'],
      mocks: {
        $route: {
          params: {
            recordId: 1001
          }
        }
      }
    })

    await wp.vm.$nextTick()
    await wp.vm.$nextTick()
    await wp.vm.$nextTick()
    await wp.vm.$nextTick()
    await wp.vm.$nextTick()
    await wp.vm.$nextTick()
    expect(wp.vm.record).toBe(null)
    expect(store.getters.error).toBe(testError)
    expect(wp.vm.pathItems).toBe(undefined)
  })

})
