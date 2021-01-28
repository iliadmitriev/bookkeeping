<template>
  <form class="card" @submit.prevent="submitRegister">
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
        >{{ 'EmailRequired' | localize }}</small>
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
      <div class="input-field">
        <input
          id="name"
          type="text"
          class="validate"
          v-model.trim="name"
          :class="{'invalid': ($v.name.$dirty && !$v.name.required)}"
        >
        <label for="name" v-model="name">{{ 'Name' | localize }}</label>
        <small
          class="helper-text invalid"
          v-if="($v.name.$dirty && !$v.name.required)"
        >{{ 'NameRequired' | localize }}</small>
      </div>
      <p>
        <label>
          <input type="checkbox" v-model="accepted"/>
          <span>{{ 'Agreement' | localize }}</span>
        </label>
      </p>
      <small
        class="helper-text invalid"
        v-if="($v.accepted.$dirty && !$v.accepted.checked)"
      >{{ 'AgreementRequired' | localize }}</small>
    </div>
    <div class="card-action">
      <div>
        <button
          class="btn waves-effect waves-light auth-submit"
          type="submit"
        >
          {{ 'Register' | localize }}
          <i class="material-icons right">send</i>
        </button>
      </div>

      <p class="center">
        {{ 'AlreadyRegistered' | localize }}
        <router-link to="/login">{{ 'SignIn' | localize }}</router-link>
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

export default {
  name: "Register",
  metaInfo() {
    return {
      title: this.$title('Register')
    }},
  data: () => ({
    email: '',
    password: '',
    name: '',
    accepted: false,
    locale: 'ru-RU'
  }),
  validations: {
    email: {email, required},
    password: {required, minLength: minLength(6)},
    name: {required},
    accepted: {checked: v => v}
  },
  mounted() {
    this.locale = localStorage.getItem('locale')
  },
  methods: {
    async submitRegister() {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }
      const registerFormData = {
        email: this.email,
        password: this.password,
        name: this.name,
        accepted: this.accepted
      }

      try {
        await this.$store.dispatch('register', registerFormData)
        this.$router.push('/')
      } catch (e) {}
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
