import History from "@/views/History";
import {mount} from "@vue/test-utils";
import store from '@/store'
import 'jest-canvas-mock';
import vuetify from "@/plugins/vuetify";

describe('History.vue view testsuite', () => {
  let wrapper
  const routerPush = jest.fn()
  const records = {
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
      categoryId: "ID4",
      type: "income",
      datetime: "2021-01-30T19:44:00.458Z",
      description: "Векселя"
    },
  }
  const categories = {
    "ID1": {limit: 30000, title: 'Питание'},
    "ID2": {limit: 10000, title: 'Транспорт'},
    "ID3": {limit: 10000, title: 'Инвестиции'},
  }

  beforeEach(() => {
    routerPush.mockClear()
    mockOnceVal.mockClear()
  })

  it('mount component', async () => {
    mockOnceVal
      .mockImplementationOnce(() => records)
      .mockImplementationOnce(() => categories)

    wrapper = mount(History, {
      localVue,
      store,
      vuetify,
      stubs: ['router-link'],
      mocks: {
        $route: {
          query: {
            page: 1,
            itemsPerPage: 5
          }
        },
        $router: {
          push: routerPush
        }
      }
    })

    expect(wrapper.vm.loading).toBe(true)

    await flushPromises()

    expect(wrapper.vm.loading).toBe(false)
    expect(wrapper.vm.categories).toBeTruthy()
    expect(wrapper.vm.categories.length).toBe(3)
    expect(wrapper.vm.recordsItems).toBeTruthy()
    expect(wrapper.vm.recordsItems.length).toBe(9)
    expect(wrapper.vm.options.page).toBe(1)
    expect(wrapper.vm.options.itemsPerPage).toBe(5)

  })

  it('mount component with dark theme and without page', async () => {
    mockOnceVal
      .mockImplementationOnce(() => records)
      .mockImplementationOnce(() => categories)

    const myWrapper = mount(History, {
      localVue,
      store,
      vuetify,
      stubs: ['router-link'],
      mocks: {
        $route: {
          query: {}
        },
        $router: {
          push: routerPush
        }
      }
    })
    expect(myWrapper.vm.loading).toBe(true)

    myWrapper.vm.$vuetify.theme.dark = true

    await flushPromises()

    expect(myWrapper.vm.loading).toBe(false)

    expect(myWrapper.vm.categories).toBeTruthy()
    expect(myWrapper.vm.categories.length).toBe(3)
    expect(myWrapper.vm.recordsItems).toBeTruthy()
    expect(myWrapper.vm.recordsItems.length).toBe(9)
    expect(myWrapper.vm.options.page).toBe(1)
    expect(myWrapper.vm.options.itemsPerPage).toBe(5)

    myWrapper.vm.Chart = null
    myWrapper.destroy()

  })

  it('paginate data table', async () => {
    wrapper.vm.paginate({
      pageCount: 2,
      page: 2,
      itemsPerPage: 5
    })
    expect(routerPush).toBeCalledTimes(1)
    expect(routerPush).toBeCalledWith({
      query: {
        page: 2,
        itemsPerPage: 5
      }
    })
  })

  it('destroy component', async () => {
    wrapper.vm.Chart = {
      destroy: jest.fn()
    }
    wrapper.destroy()
    expect(wrapper.vm.Chart.destroy).toBeCalledTimes(1)
  })
})
