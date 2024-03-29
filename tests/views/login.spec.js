import Login from "@/views/Login";
import {mount} from "@vue/test-utils"
import store from "@/store"

import firebase from "firebase/app";

const mockRouterPush = jest.fn()

describe('Login.vue component testsuite', () => {
  let wrapper

  beforeEach(() => {
    firebase.signInWithEmailAndPassword.mockClear()
    firebase.signInWithPopup.mockClear()
    mockRouterPush.mockClear()
    mockOnceVal.mockClear()
    mockFbSet.mockClear()
  })


  it('mount component', () => {
    mockLocalStorageGetItem.mockClear()
    wrapper = mount(Login, {
      localVue,
      store,
      vuetify,
      stubs: ['router-link'],
      mocks: {
        $route: {
          path: '/login?message=login',
          query: {
            message: 'login'
          }
        },
        $router: {
          push: mockRouterPush
        }
      }
    })

    expect(wrapper.find('#email').exists()).toBe(true)
    expect(wrapper.find('#password').exists()).toBe(true)
  })

  it('mount component without $route.query.message', () => {
    mockLocalStorageGetItem.mockImplementationOnce(() => null)
    wrapper = mount(Login, {
      localVue,
      store,
      vuetify,
      stubs: ['router-link'],
      mocks: {
        $route: {
          path: '/login',
          query: {}
        },
        $router: {
          push: mockRouterPush
        }
      }
    })

    expect(wrapper.find('#email').exists()).toBe(true)
    expect(wrapper.find('#password').exists()).toBe(true)
  })

  it('change locale link click', async () => {
    mockLocalStorageSetItem.mockClear()
    expect(wrapper.vm.locale).toBe('ru-RU')
    const changeLocaleLink = wrapper.find('#changeLocale')
    await changeLocaleLink.trigger('click')

    expect(wrapper.vm.locale).toBe('en-US')
    expect(mockLocalStorageSetItem).toBeCalledTimes(1)
    expect(mockLocalStorageSetItem).toBeCalledWith('locale', 'en-US')

    mockLocalStorageSetItem.mockClear()
    await changeLocaleLink.trigger('click')
    expect(wrapper.vm.locale).toBe('ru-RU')
    expect(mockLocalStorageSetItem).toBeCalledTimes(1)
    expect(mockLocalStorageSetItem).toBeCalledWith('locale', 'ru-RU')

  })

  it('switch between bright and dark mode', async () => {
    mockLocalStorageSetItem.mockClear()
    const switchDarkMode = wrapper.find('#switchDarkMode')
    expect(wrapper.vm.darkMode).toBe(false)
    expect(wrapper.vm.$vuetify.theme.dark).toBe(false)
    await switchDarkMode.trigger('click')
    expect(mockLocalStorageSetItem).toBeCalledTimes(1)
    expect(wrapper.vm.darkMode).toBe(true)
    expect(wrapper.vm.$vuetify.theme.dark).toBe(true)
  })

  it.each([
    {num: 1, email: '', password: '', expected: false},
    {num: 2, email: 'invalid.email.com', password: '1', expected: false},
  ])
  ('submit invalid form with email and password $num',
    async ({email, password, expected}) => {
      wrapper.find('#email').setValue(email)
      wrapper.find('#password').setValue(password)
      await wrapper.find('form').trigger('submit')
      await flushPromises()

      expect(wrapper.vm.valid).toBe(expected)
    })

  it('submit valid form with email and password', async () => {
    store.commit('clearError')

    firebase.signInWithEmailAndPassword.mockImplementationOnce(() => ({
      user: {
        email: 'sign.user123@example.com', uid: 123, emailVerified: true
      }
    }))

    mockOnceVal.mockImplementationOnce(() => ({
      email: 'sign.user123@example.com', uid: 123, emailVerified: true
    }))
    mockFbSet.mockImplementationOnce(() => ({
      email: 'sign.user123@example.com', uid: 123, emailVerified: true
    }))

    wrapper.find('#email').setValue('sign.user123@example.com')
    wrapper.find('#password').setValue('secret123')

    await flushPromises()

    expect(wrapper.vm.$data.email).toBe('sign.user123@example.com')
    expect(wrapper.vm.$data.password).toBe('secret123')

    const loginForm = wrapper.find('form')
    await loginForm.trigger('submit.prevent')

    expect(wrapper.vm.loading).toBe(true)

    await flushPromises()

    expect(store.getters.error).toBe(null)
    expect(mockRouterPush).toBeCalledTimes(1)

    expect(wrapper.vm.loading).toBe(false)
    expect(await store.dispatch('getUid')).toBe(123)


  })

  it('submit valid form with email and password throw error', async () => {
    store.commit('clearError')
    firebase.signInWithEmailAndPassword.mockImplementationOnce(() => {
      throw new Error('signInWithEmailAndPassword error')
    })

    await wrapper.setData({
      email: 'signed.user123@example.com',
      password: 'holster123'
    })

    await wrapper.vm.submitLogin()
    await flushPromises()
    expect(store.getters.error).toBeInstanceOf(Error)

  })


    it('submit with google auth', async () => {
    store.commit('clearError')
    mockRouterPush.mockClear()

    firebase.signInWithPopup.mockImplementationOnce(() => ({
      user: {
        email: 'sign.user123@example.com', uid: 123, emailVerified: true
      }
    }))
    mockOnceVal.mockImplementationOnce(() => ({
      email: 'sign.user123@example.com', uid: 123, emailVerified: true
    }))
    mockFbSet.mockImplementationOnce(() => ({
      email: 'sign.user123@example.com', uid: 123, emailVerified: true
    }))

    await wrapper.find('#loginWithGoogle').trigger('click.prevent')
    await flushPromises()

    expect(store.getters.error).toBe(null)
    expect(mockRouterPush).toBeCalledTimes(1)
  })

  it('submit with google auth throw exception', async () => {
    store.commit('clearError')

    firebase.signInWithPopup.mockImplementationOnce(() => {
      throw new Error('Test auth exception')
    })

    await wrapper.find('#loginWithGoogle').trigger('click.prevent')
    await flushPromises()
  })

})
