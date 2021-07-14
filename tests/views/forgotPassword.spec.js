import ForgotPassword from "@/views/ForgotPassword";
import {mount} from "@vue/test-utils";
import store from '@/store'
import firebase from "firebase/app";

describe('ForgotPassword.vue view component testsuite', () => {
  let wrapper
  const routerPush = jest.fn()

  beforeEach(() => {
    routerPush.mockClear()
  })

  it('mount component', async () => {
    mockLocalStorageGetItem.mockImplementation()
    wrapper = mount(ForgotPassword, {
      localVue,
      store,
      vuetify,
      stubs: ['router-link'],
      mocks: {
        $router: {
          push: routerPush
        }
      }
    })
  })

  it.each([
    {locale: 'ru-RU', expected: 'en-US'},
    {locale: 'en-US', expected: 'ru-RU'}
  ])('change locale link click',
    async ({locale, expected}) => {
      const changeLocaleLink = wrapper.find('#changeLocale')

      mockLocalStorageSetItem.mockClear()
      expect(wrapper.vm.locale).toBe(locale)
      await changeLocaleLink.trigger('click')
      expect(wrapper.vm.locale).toBe(expected)
      expect(mockLocalStorageSetItem).toBeCalledTimes(1)
      expect(mockLocalStorageSetItem).toBeCalledWith('locale', expected)

    })

  it.each([
    {email: 'test@example.com', valid: true, throwing: false},
    {email: 'test.example.com', valid: false, throwing: false},
    {email: '', valid: false, throwing: false},
    {email: 'test@example.com', valid: true, throwing: true}
  ])('submit form forgot password email=$email',
    async ({email, valid, throwing}) => {
    store.commit('clearError')
      if (throwing) {
        firebase.auth().sendPasswordResetEmail.mockImplementationOnce(() => {
          throw new Error('Test error not expected')
        })
      }
      const emailInput = wrapper.find('#email')
      emailInput.setValue(email)

      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.valid).toBe(valid)
      await wrapper.find('form').trigger('submit.prevent')
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()

      if (valid && !throwing) {
        expect(routerPush).toBeCalledTimes(1)
        expect(routerPush).toBeCalledWith(
          {name: 'login', query: {message: 'recover'}}
        )
      }

      if (throwing) {
        expect(store.getters.error).not.toBe(null)
      } else {
        expect(store.getters.error).toBe(null)
      }

    })


})
