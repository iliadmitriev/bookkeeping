import Register from "@/views/Register";
import {mount} from "@vue/test-utils";
import store from '@/store'
import firebase from "firebase/app";

describe('Register.vue view component testsuite', () => {
  let wrapper
  const routerPush = jest.fn()

  beforeEach(() => {
    routerPush.mockClear()
    firebase.auth().createUserWithEmailAndPassword.mockClear()
    store.commit('clearError')
  })

  it('mount component', async () => {
    mockLocalStorageGetItem.mockImplementation()

    wrapper = mount(Register, {
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
  ])('change locale to $expected',
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
    {email: '', password: '', name: '', accepted: false, valid: false, throwing: false},
    {email: 'john1@example.com', password: 'secret', name: 'John', accepted: true, valid: true, throwing: false},
    {email: 'john2@example.com', password: 'secret', name: 'John', accepted: true, valid: true, throwing: true}
  ])('submit form forgot password email=$email',
    async ({email, password, name, accepted, valid, throwing}) => {

      if (throwing) {
        firebase.auth().createUserWithEmailAndPassword.mockImplementationOnce(() => {
          throw new Error('Test error')
        })
      }
      wrapper.find('#email').setValue(email)
      wrapper.find('#password').setValue(password)
      wrapper.find('#name').setValue(name)
      wrapper.find('#accepted').setChecked(accepted)

      await flushPromises()

      expect(wrapper.vm.valid).toBe(valid)

      await wrapper.find('form').trigger('submit.prevent')
      await flushPromises()

      if (valid && !throwing) {
        expect(routerPush).toBeCalledTimes(1)
        expect(routerPush).toBeCalledWith({name: 'home'})
      } else {
        expect(routerPush).toBeCalledTimes(0)
      }

      if (throwing) {
        expect(store.getters.error).not.toBe(null)
        expect(store.getters.error).toBeInstanceOf(Error)
      } else {
        expect(store.getters.error).toBe(null)
      }

    })
})
