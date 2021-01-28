<template>
  <div>
    <div class="page-title">
      <h3>{{ 'Account' | localize}}</h3>

      <button class="btn waves-effect waves-light btn-small">
        <i class="material-icons" @click="refresh">refresh</i>
      </button>
    </div>

    <Loader v-if="loading"></Loader>

    <div v-else class="row">

      <HomeAccount
        :rates="currency.Valute"
      />

      <HomeCurrency
        :rates="currency.Valute"
        :date="currency.Timestamp"
      />

    </div>

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
    }},
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
