<template>
  <div>
    <div class="page-title">
      <h3>Категории</h3>
    </div>
    <section>
      <div class="row">

        <CategoryCreate @created="addNewCategory" />

        <CategoryEdit />

      </div>
    </section>
  </div>
</template>

<script>
import CategoryCreate from "@/components/CategoryCreate";
import CategoryEdit from "@/components/CategoryEdit";

export default {
  name: "Categories",
  data: ()=>({
    categories: []
  }),
  methods: {
    addNewCategory(cat) {
      this.categories.push(cat)
      console.log(this.categories)
    }
  },
  components: {CategoryEdit, CategoryCreate}
}
</script>

<style scoped>

</style>
