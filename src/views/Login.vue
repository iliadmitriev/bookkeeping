<template>
  <form class="card auth-card" @submit.prevent="submitLogin">
    <div class="card-content">
      <span class="card-title">Домашняя бухгалтерия</span>
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
        >Поле email обязательно</small>
        <small class="helper-text invalid"
               v-else-if="($v.email.$dirty && !$v.email.email)"
        >Введите корректный email</small>
      </div>
      <div class="input-field">
        <input
          id="password"
          type="password"
          class="validate"
          v-model="password"
          :class="{'invalid': ($v.password.$dirty && !$v.password.required) || ($v.password.$dirty && !$v.password.minLength)}"
        >
        <label for="password">Пароль</label>
        <small
          class="helper-text invalid"
          v-if="($v.password.$dirty && !$v.password.required)"
        >Пароль не может быть пустым</small>
        <small class="helper-text invalid"
               v-else-if="($v.password.$dirty && !$v.password.minLength)"
        >Минимальная длина пароля {{ $v.password.$params.minLength.min }} символов</small>
      </div>
    </div>
    <div class="card-action">
      <div>
        <button
          class="btn waves-effect waves-light auth-submit"
          type="submit"
        >
          Войти
          <i class="material-icons right">send</i>
        </button>
      </div>

      <p class="center">
        Нет аккаунта?
        <router-link to="/register">Зарегистрироваться</router-link>
      </p>
    </div>
  </form>
</template>

<script>
import {email, required, minLength} from 'vuelidate/lib/validators'

export default {
  name: "Login",
  data: () => ({
    email: '',
    password: ''
  }),
  validations: {
    email: {email, required},
    password: {required, minLength: minLength(6)}
  },
  methods: {
    submitLogin() {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }
      const loginFormData = {
        email: this.email,
        password: this.password
      }
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>

</style>
