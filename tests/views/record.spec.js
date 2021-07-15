import Record from "@/views/Record";
import {mount} from "@vue/test-utils";
import store from '@/store'

describe('Record.vue view component testsuite', () => {
  let wrapper
  beforeEach(() => {
    mockOnceVal.mockClear()
  })

  it('mount component', async () => {
    store.commit('setInfo', {
      bill: 10000,
      locale: 'ru-RU'
    })
    mockOnceVal.mockImplementationOnce(() => ({
      "105": {
        "limit": 100000,
        "title": "Заработная плата"
      },
      "106": {
        "limit": 15000,
        "title": "Развлечения"
      },
      "107": {
        "limit": "5000",
        "title": "Прочее"
      }
    }))
    wrapper = mount(Record, {
      localVue,
      store,
      vuetify,
      stubs: ['router-link'],
      // mocks: {
      //   $message: jest.fn()
      // }
    })

    expect(wrapper.vm.loading).toBe(true)
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.loading).toBe(false)
    expect(wrapper.vm.categories).toBeInstanceOf(Array)
    expect(wrapper.vm.categories.length).toBe(3)

  })

  it('set new record type, check canCreateRecord', async () => {
    wrapper.vm.type = 'income'
    expect(wrapper.vm.canCreateRecord).toBe(true)

    wrapper.vm.type = 'outcome'
    expect(wrapper.vm.canCreateRecord).toBe(true)

  })

  it.each([
    {amount: 5000, expected: 5000, valid: true},
    {amount: 3000, expected: 2000, valid: true},
    {amount: 3000, expected: 2000, valid: true},
    {amount: '', expected: 2000, valid: false},
  ])
  ('submit form with data $amount',
    async ({amount, expected, valid}) => {
      wrapper.find('#category').setValue('106')
      wrapper.find('#amount').setValue(amount.toString())
      wrapper.find('#description').setValue('Потрачено')
      wrapper.vm.type = 'outcome'

      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.valid).toBe(valid)

      await wrapper.find('form').trigger('submit.prevent')
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()

      expect(store.getters.info.bill).toBe(expected)

    })

})
