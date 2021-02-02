<template>
  <v-container>

    <Loader
      v-if="loading"
    />

    <v-alert
      type="error"
      v-else-if="!record"
    >{{ 'NotFound' | localize }}
    </v-alert>

    <v-card
      class="mx-auto"
      max-width="600"
      elevation="0"
      v-else
    >
      <v-breadcrumbs
        divider=">"
        large
        :items="pathItems"
      >
      </v-breadcrumbs>

      <v-card
        :color="typeColor(record.type)"
      >
        <v-card-text>
          {{ 'Date' | localize }}: {{ record.datetime | date }}
        </v-card-text>
        <v-card-text>
          {{ 'Amount' | localize }}: {{ record.amount | number }}
        </v-card-text>
        <v-card-text>
          {{ 'Category' | localize }}: {{ record.categoryName }}
        </v-card-text>
        <v-card-text>
          {{ 'Description' | localize }}: {{ record.description }}
        </v-card-text>
      </v-card>

    </v-card>

  </v-container>
</template>

<script>
import localize from "@/filters/localize.filter";
import Loader from "@/components/app/Loader";

export default {
  name: "DetailRecord",
  metaInfo() {
    return {
      title: this.$title('DetailRecord')
    }
  },
  components: {Loader},
  data: () => ({
    record: null,
    loading: true
  }),
  computed: {
    pathItems() {
      if (!this.record) {
        return
      }
      return [
        {text: 'История', to: '/history', link: true, disabled: false},
        {text: this.record.typeName, to: '/history/id', link: true, disabled: true}
      ]
    },
  },
  methods: {
    typeColor(type) {
      return this.$vuetify.theme.dark
        ? type === 'income' ? 'green darken-3' : 'red darken-4'
        : type === 'income' ? 'green lighten-3' : 'red lighten-3'
    }
  },
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
