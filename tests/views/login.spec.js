import Login from "@/views/Login";
import {createLocalVue, mount} from "@vue/test-utils"
import localizeFilter from "@/filters/localize.filter";
import numberFilter from "@/filters/number.filter";
import Vue from "vue";
import VueRouter from "vue-router";
import Vuetify from "vuetify";
import titlePlugin from "@/utils/title.plugin"
import VueMeta from 'vue-meta'
import router from "@/router";

const vuetify = new Vuetify()
Vue.use(Vuetify)
const localVue = createLocalVue()
localVue.filter('localize', localizeFilter)
localVue.filter('number', numberFilter)
localVue.use(VueMeta)
localVue.use(titlePlugin)
localVue.use(VueRouter)

const mockOnceVal = jest.fn()
const mockFbUpdate = jest.fn()
const mockFbPush = jest.fn()
const mockFbSet = jest.fn()

jest.mock('firebase/app', () => ({
    auth: jest.fn().mockReturnThis(),
    currentUser: {
      email: 'user123@example.com', uid: 123, emailVerified: true
    },
    useDeviceLanguage: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    signInWithPopup: jest.fn(),
    fetchSignInMethodsForEmail: jest.fn(),
    signOut: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
    initializeApp: jest.fn(),
    database: () => ({
      ref: jest.fn(() => ({
        child: jest.fn().mockReturnThis(),
        once: jest.fn(() => ({
          val: mockOnceVal
        })),
        update: mockFbUpdate,
        push: mockFbPush,
        set: mockFbSet
      }))
    })
  })
)

describe('Login.vue component testsuite', () => {
  let wrapper

  it('mount component', () => {
    wrapper = mount(Login, {
      localVue,
      vuetify,
      router
    })

    expect(wrapper.find('#email').exists()).toBe(true)
    expect(wrapper.find('#password').exists()).toBe(true)
  })

  it('router push path with query params', async () => {
    await wrapper.vm.$router.push({name: 'login', query: {message: 'recover'}})
    await wrapper.vm.$nextTick()
  })

})
