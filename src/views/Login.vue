<template>
  <form class="card" @submit.prevent="submitLogin">
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
      <div class="input-field">
        <input
          id="password"
          type="password"
          class="validate"
          v-model="password"
          :class="{'invalid': ($v.password.$dirty && !$v.password.required) || ($v.password.$dirty && !$v.password.minLength)}"
        >
        <label for="password">{{ 'Password' | localize }}</label>
        <small
          class="helper-text invalid"
          v-if="($v.password.$dirty && !$v.password.required)"
        >{{ 'PasswordRequired' | localize }}</small>
        <small class="helper-text invalid"
               v-else-if="($v.password.$dirty && !$v.password.minLength)"
        >{{ 'PasswordMinLen' | localize }} {{ $v.password.$params.minLength.min }}</small>
      </div>
    </div>
    <div class="card-action">
      <div>
        <button
          class="btn waves-effect waves-light auth-submit"
          type="submit"
        >
          {{ 'SignIn' | localize }}
          <i class="material-icons right">send</i>
        </button>
      </div>

      <p class="center">
        {{ 'NotRegistered' | localize }}
        <router-link to="/register">{{ 'Register' | localize }}</router-link>
      </p>
      <p class="center">
        <a href="#" @click="changeLocale">
          {{ locale==='ru-RU' ? 'English' : 'Russian' | localize }}
        </a>
      </p>
    </div>
  </form>
</template>

<script>
import {email, required, minLength} from 'vuelidate/lib/validators'
import messages from '@/utils/messages'

export default {
  name: "Login",
  metaInfo() {
    return {
      title: this.$title('SignIn')
    }},
  data: () => ({
    email: '',
    password: '',
    locale: 'ru-RU'
  }),
  validations: {
    email: {email, required},
    password: {required, minLength: minLength(6)}
  },
  mounted() {
    if (messages[this.$route.query.message]) {
      this.$message(messages[this.$route.query.message])
    }
    this.locale = localStorage.getItem('locale')
  },
  methods: {
    async submitLogin() {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }
      const loginFormData = {
        email: this.email,
        password: this.password
      }
      try {
        await this.$store.dispatch('login', loginFormData)
        this.$router.push('/')
      } catch (err) {
      }
    },
    changeLocale() {
      this.locale = this.locale === 'ru-RU' ? 'en-US' : 'ru-RU'
      localStorage.setItem('locale', this.locale)
    }
  }
}
</script>

<style scoped>

</style>
