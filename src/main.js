import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import VueMeta from 'vue-meta'

import dateFilter from "@/filters/date.filter"
import currencyFilter from "@/filters/currency.filter"
import numberFilter from "@/filters/number.filter"
import localizeFilter from "@/filters/localize.filter"
import titlePlugin from "@/utils/title.plugin"
import messagePlugin from "@/plugins/message.plugin"
import {fbAuth} from "@/utils/firebase"
import vuetify from './plugins/vuetify';

Vue.use(titlePlugin)
Vue.use(messagePlugin)
Vue.use(VueMeta)
Vue.filter('date', dateFilter)
Vue.filter('currency', currencyFilter)
Vue.filter('number', numberFilter)
Vue.filter('localize', localizeFilter)

Vue.config.productionTip = false

let app

fbAuth.onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      vuetify,
      render: h => h(App)
    }).$mount('#app')
  }
})

