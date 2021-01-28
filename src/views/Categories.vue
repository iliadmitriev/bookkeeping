<template>
  <div>
    <div class="page-title">
      <h3>{{ 'Categories' | localize }}</h3>
    </div>
    <section>
      <div class="row">

        <CategoryCreate @created="addNewCategory"/>

        <loader
          v-if="loading"
        />
        <div
          class="row"
          v-else
        >
          <CategoryEdit
            v-if="categories.length"
            :categories="categories"
            :key="categories.length + updateCount"
            @updated="updateCategories"
          />
          <p v-else class="center">{{ 'NoCategories' | localize }}</p>
        </div>

      </div>
    </section>
  </div>
</template>

<script>
import CategoryCreate from "@/components/CategoryCreate";
import CategoryEdit from "@/components/CategoryEdit";
import Loader from "@/components/app/Loader";
import localizeFilter from "@/filters/localize.filter";

export default {
  name: "Categories",
  metaInfo() {
    return {
      title: this.$title('Categories')
    }},
  data: () => ({
    categories: [],
    loading: true,
    updateCount: 0
  }),
  async mounted() {
    try {
      this.categories = await this.$store.dispatch('fetchCategories')
    } catch (e) {

    } finally {
      this.loading = false
    }
  },
  methods: {
    addNewCategory(cat) {
      this.categories.push(cat)
    },
    updateCategories(category) {
      const idx = this.categories.findIndex(c => c.id === category.id)
      this.categories[idx].title = category.title
      this.categories[idx].limit = category.limit
      this.updateCount++
    }
  },
  components: {Loader, CategoryEdit, CategoryCreate}
}
</script>

<style scoped>

</style>
