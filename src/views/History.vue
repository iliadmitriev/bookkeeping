<template>
  <div>
    <div class="page-title">
      <h3>{{ 'HistoryTitle' | localize }}</h3>
    </div>
    <div class="history-chart">
      <canvas
        ref="canvas"
      ></canvas>
    </div>
    <section>

      <Loader
        v-if="loading"
      />
      <div
        v-else-if="!records.length"
      >
        <p class="center">
          {{ 'HistoryNoData' | localize }}
        </p>
        <p class="center">
          <router-link tag="button" class="btn" to="/record">
            <i class="material-icons right">open_in_new</i>
            {{ 'Add' | localize }}
          </router-link>
        </p>
      </div>
      <HistoryTable
        v-else
        :records="items"
      />

      <Paginate
        v-model="page"
        :page-count="pageCount"
        :click-handler="pageChangeHandler"
        :prev-text="'<i class=material-icons>chevron_left</i>'"
        :next-text="'<i class=material-icons>chevron_right</i>'"
        :container-class="'pagination'"
        :page-class="'waves-effect'"
      >
      </Paginate>

    </section>
  </div>
</template>

<script>
import localize from '@/filters/localize.filter'
import paginationMixin from '@/mixins/pagination.mixin'
import HistoryTable from "@/components/HistoryTable"
import Loader from "@/components/app/Loader"
import {Pie} from 'vue-chartjs'
import { random_rgba } from "@/utils/helpers"

export default {
  name: "History",
  mixins: [paginationMixin, Pie],
  data: () => ({
    loading: true,
    records: [],
  }),
  async mounted() {
    this.records = await this.$store.dispatch('fetchRecords')
    const categories = await this.$store.dispatch('fetchCategories')

    this.setup(categories)

    this.loading = false

  },
  methods: {
    setup(categories) {

      this.setupPagination(this.records.map(rec => {
        return {
          ...rec,
          datetime: new Date(rec.datetime),
          categoryName: categories
            .find(c => c.id === rec.categoryId)
            .title,
          typeClass: rec.type === 'income' ? 'green' : 'red',
          typeText: rec.type === 'income' ? localize('Income')  : localize('Expenses')
        }
      }))

      const {backgroundColors, borderColors} = random_rgba(categories.length, 0.2)

      this.renderChart({
          labels: categories.map(c => c.title),
          datasets: [{
            label: localize('HistoryExpenses'),
            data: categories.map(c => {
              return this.records
                .filter(r => r.type === 'outcome')
                .filter(r => r.categoryId === c.id)
                .reduce((total, r) => total += +r.amount, 0)
            }),
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1
          }]
        })

    }
  },
  components: {Loader, HistoryTable},
}
</script>

<style scoped>

</style>
