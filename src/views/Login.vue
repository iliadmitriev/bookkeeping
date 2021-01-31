<template>
  <v-form
    @submit.prevent="submitLogin"
    v-model="valid"
    ref="form"
  >
    <v-container>
      <v-card
        class="mx-auto"
        max-width="450"
      >
        <v-card-title>{{ 'AppName' | localize }}</v-card-title>
        <v-card-text>
          <v-text-field
            id="email"
            v-model.trim="email"
            :label="'Email'"
            :rules="emailRules"
            :key="locale"
            required
          ></v-text-field>


          <v-text-field
            id="password"
            type="password"
            v-model="password"
            :key="locale + 'password'"
            :rules="passwordRules"
            :label="'Password' | localize"
          >
          </v-text-field>

          <v-btn
            type="submit"
            block
          >
            {{ 'SignIn' | localize }}
            <i class="material-icons right">send</i>
          </v-btn>
          <br>

          <div align="center">
            <p class="center">
              {{ 'NotRegistered' | localize }}
              <router-link to="/register">{{ 'Register' | localize }}</router-link>
            </p>
            <p class="center">
              {{ 'ForgotPassword' | localize }}
              <router-link to="/forgot">{{ 'Recover' | localize }}</router-link>
            </p>
            <p class="center">
              <a href="#" @click="changeLocale">
                {{ locale === 'ru-RU' ? 'English' : 'Russian' | localize }}
              </a>
            </p>
            <p><a href="#" @click="switchDarkMode">Dark Mode</a></p>
          </div>
          <v-divider></v-divider>

          <v-btn
            block
            @click.prevent="btnGoogleSingIn"
          >
            {{ 'Google' | localize }}
            <i class="material-icons right">lock</i>
          </v-btn>
          <v-btn
            block
            color="indigo accent-2"
            @click.prevent="btnFacebookSingIn"
          >
            {{ 'Facebook' | localize }}
            <i class="material-icons right">lock</i>
          </v-btn>
          <v-btn
            color="grey accent-2"
            block
            @click.prevent="btnGithubSingIn"
          >
            {{ 'Github' | localize }}
            <i class="material-icons right">lock</i>
          </v-btn>
        </v-card-text>
      </v-card>

    </v-container>
  </v-form>
</template>

<script>
import messages from '@/utils/messages'
import localize from "@/filters/localize.filter"
import {validateEmail} from '@/utils/helpers'

const minPassLen = 6

export default {
  name: "Login",
  metaInfo() {
    return {
      title: this.$title('SignIn')
    }
  },
  data: () => ({
    valid: false,
    email: '',
    emailRules: [
      v => !!v || localize('EmailRequired'),
      v => validateEmail(v) || localize('EnterEmail')
    ],
    password: '',
    passwordRules: [
      v => !!v || localize('PasswordRequired'),
      v => v.length >= minPassLen
        || localize('PasswordMinLen') + ' ' + minPassLen
    ],
    locale: localStorage.getItem('locale') || 'ru-RU',
    darkMode: false
  }),
  mounted() {
    this.locale = localStorage.getItem('locale')
    this.darkMode = localStorage.getItem('darkMode') === 'true' || false
    this.$vuetify.theme.dark = this.darkMode
    if (messages[this.$route.query.message]) {
      this.$message(messages[this.$route.query.message])
    }
  },
  methods: {
    async submitLogin() {
      if (!this.valid) {
        this.$refs.form.validate()
        return
      }
      const loginFormData = {
        email: this.email,
        password: this.password
      }
      try {
        await this.$store.dispatch('login', loginFormData)
        await this.$router.push(this.$route.query.path ? this.$route.query.path : '/')
      } catch (err) {
      }
    },
    changeLocale() {
      this.locale = this.locale === 'ru-RU' ? 'en-US' : 'ru-RU'
      localStorage.setItem('locale', this.locale)
    },
    switchDarkMode() {
      this.darkMode = !this.darkMode
      this.$vuetify.theme.dark = this.darkMode
      localStorage.setItem('darkMode', this.darkMode.toString())
    },
    async btnGoogleSingIn() {
      try {
        await this.$store.dispatch('loginWithGoogle')
        await this.$router.push(this.$route.query.path ? this.$route.query.path : '/')
      } catch (e) {
      }
    },
    async btnFacebookSingIn() {
      try {
        await this.$store.dispatch('loginWithFacebook')
        await this.$router.push(this.$route.query.path ? this.$route.query.path : '/')
      } catch (e) {
      }
    },
    async btnGithubSingIn() {
      try {
        await this.$store.dispatch('loginWithGithub')
        await this.$router.push(this.$route.query.path ? this.$route.query.path : '/')
      } catch (e) {
      }
    }
  }
}
</script>

<style scoped>
button {
  margin: 5px 5px 5px 5px;
}

</style>
