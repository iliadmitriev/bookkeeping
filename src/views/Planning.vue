<template>
  <div>
    <v-row>
      <v-col>
        <h3>{{ 'Planning' | localize }}</h3>
      </v-col>
      <v-spacer></v-spacer>
      <v-col class="text-right">
        <h4>{{ info.bill | number }}</h4>
      </v-col>
    </v-row>

    <v-divider></v-divider>
    <br>

    <Loader v-if="loading"/>

    <div
      v-else-if="!categories.length"
      class="center">
      <p>{{ 'PlanningNoCategories' | localize }}</p>
      <v-btn link to="/categories">
        {{ 'Add' | localize }}
      </v-btn>
    </div>


    <section
      v-else
    >
      <div v-for="cat of categories" :key="cat.id">
        <p>
          <strong>{{ cat.title }}:</strong>
          {{ cat.totalSpend | number }} {{ 'of' | localize }} {{ cat.limit | number }}
        </p>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-progress-linear
              v-bind="attrs"
              v-on="on"
              :value="cat.progressPercent"
              :color="cat.progressColor"
              height="15"
            ></v-progress-linear>
          </template>
          <span>{{ cat.tooltip }}</span>
        </v-tooltip>
        <br>


      </div>
    </section>

  </div>
</template>

<script>
import localize from '@/filters/localize.filter'
import Loader from "@/components/app/Loader";
import {mapGetters} from 'vuex'
import numberFilter from "@/filters/number.filter";

export default {
  name: "Planning",
  metaInfo() {
    return {
      title: this.$title('Planning')
    }
  },
  components: {Loader},
  data: () => ({
    loading: true,
    categories: []
  }),
  async mounted() {
    const records = await this.$store.dispatch('fetchRecords')
    const categories = await this.$store.dispatch('fetchCategories')

    this.categories = categories.map(cat => {
      const totalSpend = records
        .filter(r => r.categoryId === cat.id)
        .filter(r => r.type === 'outcome')
        .reduce((total, rec) => {
          return total += +rec.amount
        }, 0)

      const percent = 100 * totalSpend / cat.limit
      const progressPercent = percent > 100 ? 100 : percent

      // < 60% - green
      // < 100% - yellow
      // > 100% - red

      const progressColor = percent < 60
        ? 'green'
        : percent < 100
          ? 'yellow'
          : 'red'


      const tooltipValue = cat.limit - totalSpend
      const tooltip = `${tooltipValue < 0
        ? localize('Exceeding')
        : localize('Remaining')} ${numberFilter(Math.abs(tooltipValue))}`

      return {
        ...cat,
        totalSpend,
        tooltip,
        progressPercent,
        progressColor
      }

    })

    this.loading = false
  },
  computed: {
    ...mapGetters(['info'])
  }
}
</script>

<style scoped>

</style>
