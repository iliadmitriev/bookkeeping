import {createLocalVue} from "@vue/test-utils";

import Vuetify from "vuetify";
import Vue from "vue";

Vue.use(Vuetify)

import Vuex from "vuex";
import VueMeta from "vue-meta";
import titlePlugin from "@/utils/title.plugin"
import messagePlugin from "@/plugins/message.plugin"
import dateFilter from "@/filters/date.filter";
import localizeFilter from "@/filters/localize.filter";
import numberFilter from "@/filters/number.filter";
import currencyFilter from "@/filters/currency.filter";

global.fetch = jest.fn()

global.vuetify = new Vuetify()
global.localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueMeta)
localVue.use(titlePlugin)
localVue.use(messagePlugin)
localVue.filter('localize', localizeFilter)
localVue.filter('number', numberFilter)
localVue.filter('date', dateFilter)
localVue.filter('currency', currencyFilter)

global.mockLocalStorageGetItem = jest.fn(
  (key = null) => key === 'locale' ? 'ru-RU' : null
)
global.mockLocalStorageSetItem = jest.fn()
Storage.prototype.getItem = mockLocalStorageGetItem
Storage.prototype.setItem = mockLocalStorageSetItem

global.mockOnceVal = jest.fn()

global.mockFbUpdate = jest.fn(() => ({}))
global.mockFbPush = jest.fn()
global.mockFbOnce = jest.fn(() => ({
  val: mockOnceVal
}))
global.mockFbSet = jest.fn(() => ({}))
global.mockAddScope = jest.fn()
global.mockSetCustomParameters = jest.fn()
global.mockAuthProvider = {
  addScope: mockAddScope,
  setCustomParameters: mockSetCustomParameters
}

jest.mock('firebase/app', () => {
  const auth = jest.fn().mockReturnThis()
  auth.GoogleAuthProvider = jest.fn(() => mockAuthProvider)
  auth.FacebookAuthProvider = jest.fn(() => mockAuthProvider)
  auth.GithubAuthProvider = jest.fn(() => mockAuthProvider)
  return {
    auth,
    currentUser: {
      email: 'user@example.com', uid: 123, emailVerified: true
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
        once: mockFbOnce,
        update: mockFbUpdate,
        push: mockFbPush,
        set: mockFbSet
      }))
    })
  }
});

// for message plugin
// to mount somewhere
// and suppress [Vuetify] Unable to locate target [data-app]
const app = document.createElement('div');
app.setAttribute('id', 'v-app');
app.setAttribute('data-app', null)
document.body.append(app);

// for chartjs to work in tests
global.ResizeObserver = require('resize-observer-polyfill')

// for awaiting finishing all the background tasks
global.flushPromises = () => new Promise(
  typeof setImmediate === 'function' ? setImmediate : setTimeout
);
