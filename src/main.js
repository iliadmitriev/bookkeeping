import Vue from 'vue'
import Vuelidate from 'vuelidate'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import Paginate from 'vuejs-paginate'
import 'materialize-css/dist/js/materialize.min'
import VueMeta from 'vue-meta'

import dateFilter from "@/filters/date.filter"
import currencyFilter from "@/filters/currency.filter"
import numberFilter from "@/filters/number.filter"
import localizeFilter from "@/filters/localize.filter"
import titlePlugin from "@/utils/title.plugin"
import messagePlugin from "@/utils/message.plugin"
import tooltipDirective from "@/directives/tooltip.directive"
import {fbAuth} from "@/utils/firebase"

Vue.use(titlePlugin)
Vue.use(messagePlugin)
Vue.use(Vuelidate)
Vue.use(VueMeta)
Vue.directive('tooltip', tooltipDirective)
Vue.filter('date', dateFilter)
Vue.filter('currency', currencyFilter)
Vue.filter('number', numberFilter)
Vue.filter('localize', localizeFilter)
Vue.component('Paginate', Paginate)

Vue.config.productionTip = false

let app

fbAuth.onAuthStateChanged(() => {
  if (!app) {
    let app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})

