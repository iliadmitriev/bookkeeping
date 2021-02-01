<template>
  <div>
    <h3>{{ 'Profile' | localize }}</h3>
    <v-form
      @submit.prevent="submitProfile"
      v-model="valid"
      ref="form"
    >
      <v-text-field
        id="name"
        type="text"
        prepend-inner-icon="mdi-account"
        v-model.trim="name"
        :key="info.locale + 'name'"
        :rules="nameRules"
        :label="'Name' | localize"
      >
      </v-text-field>

      <v-select
        v-model="currentLocale"
        :items="locales"
        prepend-icon="mdi-translate"
        item-text="name"
        item-value="code"
        label="Select"
        single-line
      ></v-select>

      <v-btn
        type="submit">
        {{ 'Update' | localize }}
        <v-icon>mdi-send</v-icon>
      </v-btn>
    </v-form>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import {required} from 'vuelidate/lib/validators'
import localize from "@/filters/localize.filter";

export default {
  name: "Profile",
  // made it function to update without restart
  metaInfo() {
    return {
      title: this.$title('Profile')
    }
  },
  data: () => ({
    name: '',
    nameRules: [
      v => !!v || localize('NameRequired')
    ],
    valid: false,
    currentLocale: 'ru-RU',
    locales: [
      {code: 'ru-RU', name: localize('Russian')},
      {code: 'en-US', name: localize('English')}
    ]
  }),
  validations: {
    name: {required}
  },
  computed: {
    ...mapGetters(['info'])
  },
  mounted() {
    this.name = this.info.name
    this.currentLocale = this.info.locale || 'ru-RU'
  },
  methods: {
    ...mapActions(['updateInfo']),
    async submitProfile() {
      if (!this.valid) {
        this.$refs.form.validate()
        return
      }

      try {
        await this.updateInfo({
          name: this.name,
          locale: this.currentLocale
        })
        localStorage.setItem('locale', this.currentLocale)
      } catch (e) {
      }
    }
  },
}
</script>

<style scoped>
.switch {
  margin-bottom: 2rem;
}
</style>
