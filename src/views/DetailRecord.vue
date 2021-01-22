<template>
  <div>
    <Loader
      v-if="loading"
    />
    <div
      class="row"
      v-else-if="!record"
    >
      <p class="center">{{ 'NotFound' | localize }}</p>
    </div>
    <div
      v-else
    >
      <div class="breadcrumb-wrap">
        <router-link to="/history" class="breadcrumb">{{ 'History' | localize }}</router-link>
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
              <p>{{ 'Description' | localize }}: {{ record.description }}</p>
              <p>{{ 'Amount' | localize }}: {{ record.amount | number }}</p>
              <p>{{ 'Category' | localize }}: {{ record.categoryName }}</p>

              <small>{{ record.datetime | date }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import localize from "@/filters/localize.filter";
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
      typeName: record.type === 'income'
        ? localize('Income')
        : localize('Expenses')
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
