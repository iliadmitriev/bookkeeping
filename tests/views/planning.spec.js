import Planning from "@/views/Planning";
import {mount} from "@vue/test-utils";

import store from "@/store"

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

    await flushPromises()

    expect(wrapper.vm.loading).toBe(false)

  })

})
