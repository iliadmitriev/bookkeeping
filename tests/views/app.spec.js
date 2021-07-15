import App from "@/App";
import {mount} from "@vue/test-utils";
import router from "@/router";
import store from "@/store"
import 'jest-canvas-mock';
import firebase from "firebase/app";
import MainLayout from "@/layouts/MainLayout";
import Navbar from "@/components/app/Navbar";


describe('App.vue main application testsuite', () => {
  let appWrapper
  it('mount application', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve({
          "Date": "2021-07-03T11:30:00+03:00",
          "PreviousDate": "2021-07-02T11:30:00+03:00",
          "PreviousURL": "\/\/www.cbr-xml-daily.ru\/archive\/2021\/07\/02\/daily_json.js",
          "Timestamp": "2021-07-04T23:00:00+03:00",
          "Valute": {
            "USD": {
              "ID": "R01235",
              "NumCode": "840",
              "CharCode": "USD",
              "Nominal": 1,
              "Name": "Доллар США",
              "Value": 73.6175,
              "Previous": 72.9086
            },
            "EUR": {
              "ID": "R01239",
              "NumCode": "978",
              "CharCode": "EUR",
              "Nominal": 1,
              "Name": "Евро",
              "Value": 87.0748,
              "Previous": 86.4113
            }
          }
        }),
      })
    );

    store.commit('clearError')
    store.commit('setInfo', {
      bill: 10000,
      name: 'John',
      accepted: true,
      locale: 'ru-RU'
    })
    appWrapper = mount(App, {
      localVue,
      vuetify,
      router,
      store
    })
    await flushPromises()
    expect(appWrapper.exists()).toBe(true)
    expect(appWrapper.vm.layout).toBe('main-layout')

  })

  it.each([
    {page: 'login', layout: 'empty-layout', params: null},
    {page: 'forgot', layout: 'empty-layout', params: null},
    {page: 'register', layout: 'empty-layout', params: null},
    {page: 'record', layout: 'main-layout', params: null},
    {page: 'categories', layout: 'main-layout', params: null},
    {page: 'history', layout: 'main-layout', params: null},
    {page: 'profile', layout: 'main-layout', params: null},
    {page: 'planning', layout: 'main-layout', params: null},
    {page: 'credit-calc', layout: 'main-layout', params: null},
    {page: 'detail', layout: 'main-layout', params: {recordId: 1001}}
  ])('navigate to $page page',
    async ({page, params, layout}) => {
      await router.push({name: page, params: params})
      await flushPromises()
      expect(appWrapper.vm.layout).toBe(layout)
    })

  it('navigate to profile and throw message', async () => {
    await router.push({name: 'profile'})

    const testError = new Error('test error message')
    testError.code = 'auth/user-disabled'
    store.commit('setError', testError)
    await flushPromises()

    const testError2 = new Error('test error message')
    testError2.code = 'auth/unknown'
    store.commit('setError', testError2)
    await flushPromises()

  })

  it('navigate to login and throw messages', async () => {
    await router.push({name: 'login'})

    const testError = new Error('test error message')
    testError.code = 'auth/popup-blocked'
    store.commit('setError', testError)
    await flushPromises()

    const testError2 = new Error('test error message')
    testError2.code = 'auth/unknown'
    store.commit('setError', testError2)
    await flushPromises()
  })

  it('Drawer open and close', async () => {
    await router.push({name: 'profile'})
    const mainLayout = appWrapper.findComponent(MainLayout)
    expect(mainLayout.vm.triggerDrawer).toBe(0)
    mainLayout.vm.openDrawer()
    expect(mainLayout.vm.triggerDrawer).toBe(1)

  })

  it('main layout update profile failed on mount', async () => {
    store.commit('clearInfo')
    mockOnceVal.mockImplementationOnce(() => {
      const err = new Error('Test error')
      err.code = 'auth/user-disabled'
      throw err
    })
    const testAppWrapper = mount(App, {
      localVue,
      vuetify,
      router,
      store
    })
    await flushPromises()
    expect(testAppWrapper.exists()).toBe(true)
  })

  it('switch to dark mode and back', async () => {
    mockLocalStorageSetItem.mockClear()
    appWrapper.find('#profileMenu').trigger('click')
    await flushPromises()
    const switchDarkMode = appWrapper.find('#switchDarkMode')
    const navBar = appWrapper.findComponent(Navbar)
    const darkMode = navBar.vm.darkMode
    switchDarkMode.trigger('click')
    await flushPromises()
    expect(navBar.vm.darkMode).toBe(!darkMode)
    expect(mockLocalStorageSetItem).toBeCalledTimes(1)
    expect(mockLocalStorageSetItem).toBeCalledWith('darkMode', (!darkMode).toString())
  })

  it('logout', async () => {
    mockLocalStorageSetItem.mockClear()
    appWrapper.find('#profileMenu').trigger('click')
    await flushPromises()
    const logout = appWrapper.find('#logout')
    logout.trigger('click')
    await flushPromises()

  })

  it('navigate to profile (unauthorized)', async () => {
    await router.push({name: 'register'})

    firebase.auth().currentUser = null
    store.commit('clearInfo')

    await expect(router.push({name: 'profile'})).rejects.toThrow()

  })

})
