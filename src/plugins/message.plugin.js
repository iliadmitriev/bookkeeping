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



      document.body.appendChild(instance.$el)
      //options.$el.appendChild(instance.$el)

      //this.$refs.test.appendChild(instance.$el)
    }

  }
}
