<template>
  <div>
    <h3>{{ 'HistoryTitle' | localize }}</h3>
    <div
      v-show="categories.length"
    >
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
          <v-btn link to="/record">
            {{ 'Add' | localize }}
          </v-btn>
        </p>
      </div>
      <br>

      <v-text-field
        v-model="search"
        :label="'Search' | localize"
        prepend-icon="mdi-magnify"
      ></v-text-field>

      <v-data-table
        :items="recordsItems"
        :headers="recordsHeadings"
        :search="search"
        :no-data-text="'HistoryNoData' | localize"
        :options.sync="options"
        @pagination="paginate"
      >

        <template v-slot:item.amount="{ item }">
          {{ item.amount | number }}
        </template>

        <template v-slot:item.typeText="{ item }">
          <span
            class="badge"
            :class="typeColor(item.type)"
          >
            {{ item.typeText }}
          </span>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-icon
            small
            class="mr-2"
            @click="$router.push('/detail/' + item.id)"
          >
            mdi-open-in-new
          </v-icon>
        </template>

      </v-data-table>

    </section>
  </div>
</template>

<script>
import localize from '@/filters/localize.filter'
import date from "@/filters/date.filter";
import Loader from "@/components/app/Loader"

import {random_rgba} from "@/utils/helpers"

import Chart from "chart.js/auto";

export default {
  name: "History",
  metaInfo() {
    return {
      title: this.$title('History')
    }
  },

  data() {
    return {
      loading: true,
      records: [],
      categories: [],
      search: '',
      recordsItems: [],
      recordsHeadings: [
        {value: 'amount', text: localize('Amount'), align: 'right'},
        {value: 'datetime', text: localize('Date'), align: 'center'},
        {value: 'categoryName', text: localize('Category'), align: 'center'},
        {value: 'typeText', text: localize('Type'), align: 'center'},
        {value: 'actions', text: localize('Actions'), sortable: false, align: 'right'}
      ],
      options: {
        descending: [],
        sortBy: [],
        itemsPerPage: 5,
        page: 1,
        mustSort: false,
        multiSort: false,
        groupBy: [],
        groupDesc: []
      },
      Chart: null
    }
  },
  async mounted() {

    this.records = await this.$store.dispatch('fetchRecords')
    this.categories = await this.$store.dispatch('fetchCategories')

    this.recordsItems = this.records.map(
      r => {
        const category = this.categories.find(c => c.id === r.categoryId)
        return {
          ...r,
          datetime: date(r.datetime),
          categoryName: category
            ? category.title
            : '',
          typeText: r.type === 'income'
            ? localize('Income')
            : localize('Expenses')
        }
      }
    )

    this.setup(this.categories)

    this.options.page = +this.$route.query.page || 1
    this.options.itemsPerPage = +this.$route.query.itemsPerPage || 5

    this.loading = false

  },
  methods: {
    typeColor(type) {
      return this.$vuetify.theme.dark
        ? type === 'income' ? 'green darken-3' : 'red darken-4'
        : type === 'income' ? 'green lighten-3' : 'red lighten-3'
    },

    setup(categories) {

      const {backgroundColors, borderColors} = random_rgba(categories.length, 0.2)


      this.Chart = new Chart(this.$refs.canvas, {
        type: 'pie',
        data: {
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
        },
        options: {
          responsive: true,
        }
      });

    },

    paginate(pagination) {
      if (
        pagination.pageCount // if data loaded and rendered
        && (
          pagination.page !== +this.$route.query.page
          || pagination.itemsPerPage !== +this.$route.query.itemsPerPage
        )
      )
        this.$router.push({
          query: {
            page: pagination.page,
            itemsPerPage: pagination.itemsPerPage
          }
        })
    }
  },
  destroyed() {
    if (this.Chart && this.Chart.destroy) {
      this.Chart.destroy()
    }
  },
  components: {Loader},
}
</script>

<style scoped>
.badge {
  padding: 4px;
}

</style>
