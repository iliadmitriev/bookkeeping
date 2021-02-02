<template>
  <v-form
    @submit.prevent="submitRegister"
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

          <v-text-field
            id="name"
            type="text"
            prepend-inner-icon="mdi-account"
            v-model="name"
            :key="locale + 'name'"
            :rules="nameRules"
            :label="'Name' | localize"
          >
          </v-text-field>

          <v-checkbox
            v-model="accepted"
            :key="locale + 'accepted'"
            :rules="ruleAccepted"
          >
            <template v-slot:label>
              <div>
                    {{ 'IAgree' | localize }}
                    <a
                      target="_blank"
                      href="/terms.html"
                      @click.stop
                      v-on="on"
                    >
                      {{ 'Terms' | localize }}
                    </a>
              </div>
            </template>
          </v-checkbox>

          <v-btn
            type="submit"
            :loading="loading"
            :disabled="loading"
            block
          >
            {{ 'Register' | localize }}
            <v-icon>mdi-send</v-icon>
          </v-btn>
          <br>


          <div align="center">
          <p class="center">
              {{ 'AlreadyRegistered' | localize }}
              <router-link to="/login">{{ 'SignIn' | localize }}</router-link>
            </p>
            <p class="center">
              <a href="#" @click="changeLocale">
                {{ locale === 'ru-RU' ? 'English' : 'Russian' | localize }}
              </a>
            </p>
          </div>

        </v-card-text>
      </v-card>
    </v-container>
  </v-form>
</template>

<script>
import localize from "@/filters/localize.filter";
import {validateEmail} from "@/utils/helpers";
import {minPassLen} from '@/utils/constants'

export default {
  name: "Register",
  metaInfo() {
    return {
      title: this.$title('Register')
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
    name: '',
    nameRules: [
      v => !!v || localize('NameRequired')
    ],
    accepted: false,
    ruleAccepted: [
      v => v || localize('AgreementRequired')
    ],
    locale: localStorage.getItem('locale') || 'ru-RU'
  }),
  mounted() {
    this.locale = localStorage.getItem('locale')
  },
  methods: {
    async submitRegister() {
      if (!this.valid) {
        this.$refs.form.validate()
        return
      }
      this.loading = true

      const registerFormData = {
        email: this.email,
        password: this.password,
        name: this.name,
        accepted: this.accepted
      }

      try {
        await this.$store.dispatch('register', registerFormData)
        await this.$router.push('/')
      } catch (e) {
      } finally {
        this.loading = false
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
