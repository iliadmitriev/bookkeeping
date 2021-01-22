export default {
  install(Vue, options) {
    Vue.prototype.$message = function (text) {
      M.toast({html: text})
    }

    Vue.prototype.$error = function (text) {
      M.toast({html: `<div class="red lighten-4 text-darken-4"> ${text}`})
    }

  }
}
