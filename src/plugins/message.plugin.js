import vuetify from '@/plugins/vuetify'
import ToastMessage from "@/components/ToastMessage";

export default {
  install(Vue, options) {
    Vue.prototype.$message = function (text) {
      const ComponentClass = Vue.extend(ToastMessage)
      const instance = new ComponentClass({
        vuetify,
        propsData: {
          message: text
        }
      })
      instance.$mount()

      const el = document.querySelector('#v-app')

      el.appendChild(instance.$el)

    }

  }
}
