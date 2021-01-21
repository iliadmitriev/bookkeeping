<template>
  <div>
    <Loader
      v-if="loading"
    />
    <div
      class="row"
      v-else-if="!record"
    >
      <p class="center">Не найдено</p>
    </div>
    <div
      v-else
    >
      <div class="breadcrumb-wrap">
        <router-link to="/history" class="breadcrumb">История</router-link>
        <a @click.prevent class="breadcrumb">
          {{ record.typeName }}
        </a>
      </div>
      <div class="row">
        <div class="col s12 m6">
          <div class="card"
               :class="record.typeClass"
          >
            <div class="card-content white-text">
              <p>Описание: {{ record.description }}</p>
              <p>Сумма: {{ record.amount | number }}</p>
              <p>Категория: {{ record.categoryName }}</p>

              <small>{{ record.datetime | date }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from "@/components/app/Loader";
export default {
  name: "DetailRecord",
  components: {Loader},
  data: ()=>({
    record: null,
    loading: true
  }),
  async mounted() {
    try {
    const recordId = this.$route.params.recordId
    const record = await this.$store.dispatch('fetchRecordById', recordId)
    const category = await this.$store.dispatch('fetchCategoryById', record.categoryId)

    this.record = {
      ...record,
      categoryName: category.title,
      datetime: new Date(record.datetime),
      typeClass: record.type === 'income' ? 'green' : 'red',
      typeName: record.type === 'income' ? 'Приход' : 'Расход'
    }
    } catch (e) {

    } finally {
      this.loading = false

    }

  }
}
</script>

<style scoped>

</style>
