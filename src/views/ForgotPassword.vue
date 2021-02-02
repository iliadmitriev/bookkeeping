<template>
  <v-form
    @submit.prevent="submitForgotPassword"
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

          <v-btn
            type="submit"
            :loading="loading"
            :disabled="loading"
            block
          >
            {{ 'Recover' | localize }}
            <v-icon>mdi-send</v-icon>
          </v-btn>
          <br>

          <div align="center">
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
        </v-card-text>
      </v-card>
    </v-container>
  </v-form>
</template>

<script>
import {validateEmail} from '@/utils/helpers'
import localize from "@/filters/localize.filter";

export default {
  name: "ForgotPassword",
  metaInfo() {
    return {
      title: this.$title('RecoverPassword')
    }
  },
  data: () => ({
    valid: false,
    loading: false,
    email: '',
    emailRules: [
      v => !!v || localize('EmailRequired'),
      v => validateEmail(v) || localize('EnterEmail')
    ],
    locale: localStorage.getItem('locale') || 'ru-RU'
  }),
  methods: {
    changeLocale() {
      this.locale = this.locale === 'ru-RU' ? 'en-US' : 'ru-RU'
      localStorage.setItem('locale', this.locale)
    },
    async submitForgotPassword() {
      if (!this.valid) {
        this.$refs.form.validate()
        return
      }

      this.loading = true

      try {
        await this.$store.dispatch('forgot', this.email)
        this.email = ''
        await this.$router.push('/login?message=recover')
      } catch (e) {
      } finally {
        this.loading = false
      }

    }
  }
}
</script>

<style scoped>

</style>
