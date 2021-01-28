<template>
  <div>
    <div class="page-title">
      <h3>{{ 'Profile' | localize }}</h3>
    </div>
    <form class="form" @submit.prevent="submitProfile">
      <div class="input-field">
        <input
          id="name"
          type="text"
          v-model.trim="name"
          :class="{'invalid': $v.name.$dirty && !$v.name.required}"
        >
        <label for="name">{{ 'ProfileName' | localize }}</label>
        <small
          class="helper-text invalid"
          v-if="$v.name.$dirty && !$v.name.required"
        >
          {{ 'ProfileEnterName' | localize }}
        </small>
      </div>

      <div class="switch">
        <label>
          {{ 'English' | localize }}
          <input type="checkbox"
                 v-model="isRuLocale"
          >
          <span class="lever"></span>
          {{ 'Russian' | localize }}
        </label>
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        {{ 'Update' | localize }}
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import {required} from 'vuelidate/lib/validators'
import localizeFilter from "@/filters/localize.filter";

export default {
  name: "Profile",
  // made it function to update without restart
  metaInfo() {
    return {
    title: this.$title('Profile')
  }},
  data: () => ({
    name: '',
    isRuLocale: true
  }),
  validations: {
    name: {required}
  },
  computed: {
    ...mapGetters(['info'])
  },
  mounted() {
    this.name = this.info.name
    this.isRuLocale = this.info.locale === 'ru-RU'
    setTimeout(() => {
      M.updateTextFields()
    })
  },
  methods: {
    ...mapActions(['updateInfo']),
    async submitProfile() {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }

      try {
        await this.updateInfo({
          name: this.name,
          locale: this.isRuLocale ? 'ru-RU' : 'en-US'
        })
        localStorage.setItem('locale', this.isRuLocale ? 'ru-RU' : 'en-US')
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
