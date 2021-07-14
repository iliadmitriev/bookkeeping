import DetailRecord from "@/views/DetailRecord";
import store from "@/store"
import {mount} from "@vue/test-utils";

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
