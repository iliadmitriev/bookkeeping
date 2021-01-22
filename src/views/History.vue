<template>
  <div>
    <div class="page-title">
      <h3>История записей</h3>
    </div>
    <div class="history-chart">
      <canvas></canvas>
    </div>
    <section>

      <Loader
        v-if="loading"
      />
      <div
        v-else-if="!records.length"
      >
        <p class="center">Еще нет записей в базе данных. Возможно вы еще их не добавли</p>
        <p class="center"><router-link tag="button" class="btn" to="/record">
          <i class="material-icons right">open_in_new</i>
          Добавить
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
import paginationMixin from '@/mixins/pagination.mixin'
import HistoryTable from "@/components/HistoryTable"
import Loader from "@/components/app/Loader"

export default {
  name: "History",
  mixins: [paginationMixin],
  data: ()=>({
    loading: true,
    records: [],
  }),
  async mounted() {
    this.records = await this.$store.dispatch('fetchRecords')
    const categories = await this.$store.dispatch('fetchCategories')

    this.setupPagination(this.records.map( rec => {
      return {
        ...rec,
        datetime: new Date(rec.datetime),
        categoryName: categories
          .find(c => c.id === rec.categoryId)
          .title,
        typeClass: rec.type === 'income' ? 'green' : 'red',
        typeText: rec.type === 'income' ? 'Доход' : 'Расход'
      }
    }))

    this.loading = false

  },
  components: {Loader, HistoryTable},
}
</script>

<style scoped>

</style>
