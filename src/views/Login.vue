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
        <v-card-title>
          {{ 'AppName' | localize }}
          <div class="dark-mode">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  class="mx-2"
                  fab
                  small
                  :dark="darkMode"
                  v-bind="attrs"
                  v-on="on"
                  @click="switchDarkMode"
                >
                  <v-icon dark>
                    mdi-theme-light-dark
                  </v-icon>
                </v-btn>
              </template>
              <span>
              {{ 'DarkMode' | localize }}
            </span>
            </v-tooltip>
          </div>
        </v-card-title>
        <v-card-text>
          <v-text-field
            id="email"
            prepend-inner-icon="mdi-email"
            v-model.trim="email"
            :label="'Email'"
            :rules="emailRules"
            :key="locale"
            required
          ></v-text-field>


          <v-text-field
            id="password"
            :type="showPassword ? 'text' : 'password'"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
            prepend-inner-icon="mdi-lock"
            v-model="password"
            :key="locale + 'password'"
            :rules="passwordRules"
            :label="'Password' | localize"
          >
          </v-text-field>

          <v-btn
            type="submit"
            :loading="loading"
            :disabled="loading"
            block
          >
            {{ 'SignIn' | localize }}
            <v-icon>mdi-send</v-icon>
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
              {{ 'Language' | localize }}
              <a href="#" @click="changeLocale">
                {{ locale === 'ru-RU' ? 'English' : 'Russian' | localize }}
              </a>
            </p>
          </div>
          <v-divider></v-divider>

          <v-btn
            block
            outlined
            @click.prevent="btnGoogleSingIn"
          >
            {{ 'Google' | localize }}
            <svg class="btn-img" viewBox="0 0 20 20" fit="" preserveAspectRatio="xMidYMid meet" focusable="false">
              <path
                d="M19.6 10.23c0-.82-.1-1.42-.25-2.05H10v3.72h5.5c-.15.96-.74 2.31-2.04 3.22v2.45h3.16c1.89-1.73 2.98-4.3 2.98-7.34z"
                fill="#4285F4"></path>
              <path
                d="M13.46 15.13c-.83.59-1.96 1-3.46 1-2.64 0-4.88-1.74-5.68-4.15H1.07v2.52C2.72 17.75 6.09 20 10 20c2.7 0 4.96-.89 6.62-2.42l-3.16-2.45z"
                fill="#34A853"></path>
              <path
                d="M3.99 10c0-.69.12-1.35.32-1.97V5.51H1.07A9.973 9.973 0 000 10c0 1.61.39 3.14 1.07 4.49l3.24-2.52c-.2-.62-.32-1.28-.32-1.97z"
                fill="#FBBC05"></path>
              <path
                d="M10 3.88c1.88 0 3.13.81 3.85 1.48l2.84-2.76C14.96.99 12.7 0 10 0 6.09 0 2.72 2.25 1.07 5.51l3.24 2.52C5.12 5.62 7.36 3.88 10 3.88z"
                fill="#EA4335"></path>
            </svg>
          </v-btn>
          <v-btn
            block
            outlined
            @click.prevent="btnFacebookSingIn"
          >
            {{ 'Facebook' | localize }}
            <svg class="btn-img" viewBox="0 0 20 20" fit="" preserveAspectRatio="xMidYMid meet" focusable="false">
              <path
                d="M18.007 19c.55 0 .993-.444.993-.993V1.993A.992.992 0 0018.007 1H1.993A.992.992 0 001 1.993v16.014c0 .55.444.993.993.993h16.014zm-4.587 0v-6.97h2.34l.35-2.717h-2.69V7.578c0-.786.218-1.322 1.346-1.322h1.438v-2.43a18.915 18.915 0 00-2.096-.108c-2.073 0-3.494 1.267-3.494 3.59v2.005H8.268v2.717h2.346V19h2.806z"
                fill="#3B5998" fill-rule="evenodd"></path>
            </svg>
          </v-btn>
          <v-btn
            outlined
            block
            @click.prevent="btnGithubSingIn"
          >
            {{ 'Github' | localize }}
            <svg class="btn-img" viewBox="0 0 20 20" fit="" preserveAspectRatio="xMidYMid meet" focusable="false">
              <path
                d="M10 0C4.476 0 0 4.477 0 10c0 4.418 2.865 8.166 6.84 9.49.5.09.68-.218.68-.483 0-.237-.007-.866-.012-1.7-2.782.603-3.37-1.34-3.37-1.34-.454-1.157-1.11-1.464-1.11-1.464-.907-.62.07-.608.07-.608 1.003.07 1.53 1.03 1.53 1.03.893 1.53 2.342 1.087 2.912.83.09-.645.35-1.085.634-1.335-2.22-.253-4.555-1.11-4.555-4.943 0-1.09.39-1.984 1.03-2.683-.105-.253-.448-1.27.096-2.647 0 0 .84-.268 2.75 1.026A9.555 9.555 0 0110 4.836a9.59 9.59 0 012.504.337c1.91-1.294 2.747-1.026 2.747-1.026.548 1.377.204 2.394.1 2.647.64.7 1.03 1.592 1.03 2.683 0 3.842-2.34 4.687-4.566 4.935.36.308.678.92.678 1.852 0 1.336-.01 2.415-.01 2.743 0 .267.18.578.687.48A10 10 0 0020 10c0-5.522-4.478-10-10-10"
                fill="#191717" fill-rule="evenodd"></path>
            </svg>
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

import {minPassLen} from '@/utils/constants'

export default {
  name: "Login",
  metaInfo() {
    return {
      title: this.$title('SignIn')
    }
  },
  data: () => ({
    valid: false,
    loading: false,
    showPassword: false,
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
    console.log(this.$route.query)
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
      this.loading = true
      const loginFormData = {
        email: this.email,
        password: this.password
      }
      try {
        await this.$store.dispatch('login', loginFormData)
        console.log(this.$route.query.path)
        await this.$router.push(this.$route.query.path ? this.$route.query.path : {name: 'home'})
      } catch (err) {
      } finally {
        this.loading = false
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
        await this.$router.push(this.$route.query.path ? this.$route.query.path : {name: 'home'})
      } catch (e) {
      }
    },
    async btnFacebookSingIn() {
      try {
        await this.$store.dispatch('loginWithFacebook')
        await this.$router.push(this.$route.query.path ? this.$route.query.path : {name: 'home'})
      } catch (e) {
      }
    },
    async btnGithubSingIn() {
      try {
        await this.$store.dispatch('loginWithGithub')
        await this.$router.push(this.$route.query.path ? this.$route.query.path : {name: 'home'})
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

.btn-img {
  width: 24px;
  height: 24px;
  position: absolute;
  right: 0;
}

.dark-mode {
  position: absolute;
  right: 0;
}

</style>
