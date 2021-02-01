<template>
  <div>
    <v-row
      justify="space-between"
    >
      <v-col
      >
        <h3>{{ 'Account' | localize }}</h3>
      </v-col>
      <v-col
      >
        <v-tooltip
          bottom
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              top
              absolute
              right
              dark
              color="cyan"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon @click="refresh">mdi-refresh</v-icon>
            </v-btn>
          </template>
          <span>
        {{ 'Update' | localize }}
      </span>
        </v-tooltip>
      </v-col>
    </v-row>

    <Loader v-if="loading"></Loader>

    <v-row v-else>

      <HomeAccount
        :rates="currency.Valute"
      />

      <HomeCurrency
        :rates="currency.Valute"
        :date="currency.Timestamp"
      />

    </v-row>

  </div>
</template>

<script>
import HomeAccount from "@/components/HomeAccount";
import HomeCurrency from "@/components/HomeCurrency";
import Loader from "@/components/app/Loader";

export default {
  name: 'Home',
  metaInfo() {
    return {
      title: this.$title('Account')
    }
  },
  data: () => ({
    loading: true,
    currency: null
  }),
  async mounted() {
    this.currency = await this.$store.dispatch('fetchCurrency')
    this.loading = false
  },
  components: {
    Loader,
    HomeCurrency, HomeAccount
  },
  methods: {
    async refresh() {
      this.loading = true
      try {
        this.currency = await this.$store.dispatch('fetchCurrency')
      } catch (e) {
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
