import App from "@/App";
import {mount} from "@vue/test-utils";
import router from "@/router";
import store from "@/store"
import 'jest-canvas-mock';
import firebase from "firebase/app";


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

  it('navigate to profile (unauthorized)', async () => {
    await router.push({name: 'register'})

    firebase.auth().currentUser = null
    store.commit('clearInfo')

    await expect(router.push({name: 'profile'})).rejects.toThrow()

  })

})
