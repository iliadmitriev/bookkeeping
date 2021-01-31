import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import ru from 'vuetify/lib/locale/ru';
import en from "vuetify/es5/locale/en";

Vue.use(Vuetify)

export default new Vuetify({
  lang: {
    locales: {ru, en},
    current: 'ru',
  },
  theme: {
    themes: {
      light: {},
      dark: {}
    }
  }
});

