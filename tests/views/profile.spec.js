import {mount} from "@vue/test-utils";
import Profile from "@/views/Profile";
import store from '@/store'

describe('Profile.vue view component testsuite', () => {
  let wrapper

  beforeEach(() => {
    mockLocalStorageSetItem.mockClear()
    mockFbUpdate.mockClear()
  })

  it('mount component', async () => {
    store.commit('setInfo', {
      locale: 'ru-RU',
      name: 'John'
    })
    wrapper = mount(Profile, {
      localVue,
      store,
      vuetify
    })
  })

  it('mount component without locale', async () => {
    store.commit('clearInfo')
    const myWrapper = mount(Profile, {
      localVue,
      store,
      vuetify
    })
    expect(myWrapper.exists()).toBe(true)
  })

  it.each([
    {name: 'James', locale: 'en-US', valid: true, throwing: false, expected: true},
    {name: 'David', locale: 'en-US', valid: true, throwing: true, expected: false},
    {name: '', locale: 'en-US', valid: false, throwing: false, expected: false}
  ])('submit info $name',
    async ({name, locale, valid, throwing, expected}) => {
      store.commit('clearError')
      if (throwing) {
        mockFbUpdate.mockImplementationOnce(() => {
          throw new Error('Test error')
        })
      }
      wrapper.find('#name').setValue(name)
      wrapper.find('#locale').setValue(locale)
      await flushPromises()
      expect(wrapper.vm.valid).toBe(valid)

      wrapper.find('form').trigger('submit.prevent')

      await flushPromises()

      if (expected && !throwing) {
        expect(mockLocalStorageSetItem).toBeCalledTimes(1)
        expect(store.getters.info).toStrictEqual({
          name, locale
        })
      }

      if (throwing) {
        expect(store.getters.error).toBeInstanceOf(Error)
      } else {
        expect(store.getters.error).toBeNull()
      }

    })
})
