import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import ru from 'vuetify/lib/locale/ru';

Vue.use(Vuetify);

import en from "vuetify/es5/locale/en";

export default new Vuetify({
    lang: {
      locales: { ru, en },
      current: 'ru',
    },
});
