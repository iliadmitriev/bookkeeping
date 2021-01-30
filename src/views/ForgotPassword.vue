<template>
  <form class="card" @submit.prevent="submitForgotPassword">
    <div class="card-content">
      <span class="card-title">{{ 'AppName' | localize }}</span>
      <div class="input-field">
        <input
          id="email"
          type="text"
          class="validate"
          v-model.trim="email"
          :class="{'invalid': ($v.email.$dirty && !$v.email.required) || ($v.email.$dirty && !$v.email.email)}"
        >
        <label for="email">Email</label>
        <small
          class="helper-text invalid"
          v-if="($v.email.$dirty && !$v.email.required)"
        >{{ 'EnterEmail' | localize }}</small>
        <small class="helper-text invalid"
               v-else-if="($v.email.$dirty && !$v.email.email)"
        >{{ 'EnterEmail' | localize }}</small>
      </div>
    </div>
    <div class="card-action">
      <div>
        <button
          class="btn waves-effect waves-light auth-submit"
          type="submit"
        >
          {{ 'Recover' | localize }}
          <i class="material-icons right">send</i>
        </button>
      </div>

      <p class="center">
        {{ 'NotRegistered' | localize }}
        <router-link to="/register">{{ 'Register' | localize }}</router-link>
      </p>
      <p class="center">
        <a href="#" @click="changeLocale">
          {{ locale === 'ru-RU' ? 'English' : 'Russian' | localize }}
        </a>
      </p>

    </div>
  </form>
</template>

<script>
import {email, required, minLength} from 'vuelidate/lib/validators'
import messages from '@/utils/messages'
import store from 'vuex'

export default {
  name: "ForgotPassword",
  metaInfo() {
    return {
      title: this.$title('RecoverPassword')
    }
  },
  data: () => ({
    email: '',
    locale: localStorage.getItem('locale') || 'ru-RU'
  }),
  validations: {
    email: {email, required}
  },
  methods: {
    changeLocale() {
      this.locale = this.locale === 'ru-RU' ? 'en-US' : 'ru-RU'
      localStorage.setItem('locale', this.locale)
    },
    async submitForgotPassword() {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }

      try {
        await this.$store.dispatch('forgot', this.email)
        this.email=''
        await this.$router.push('/login?message=recover')
      } catch (e) {}

    }
  }
}
</script>

<style scoped>

</style>
