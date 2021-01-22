<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>{{ 'Edit' | localize }}</h4>
      </div>

      <form @submit.prevent="submitCategoryEdit">
        <div class="input-field">
          <select
            ref="selectCategory"
            v-model="current"
          >
            <option
              v-for="cat in categories"
              :value="cat.id"
              :key="cat.id"
            >
              {{ cat.title }}
            </option>
          </select>
          <label>{{ 'SelectCategory' | localize }}</label>
        </div>

        <div class="input-field">
          <input
            id="name"
            type="text"
            v-model.trim="title"
            :class="{'invalid': $v.title.$dirty && !$v.title.required}"
          >
          <label for="name">{{ 'Title' | localize }}</label>
          <span
            class="helper-text invalid"
            v-if="$v.title.$dirty && !$v.title.required"
          >
            {{ 'EnterTitle' | localize }}</span>
        </div>

        <div class="input-field">
          <input
            id="limit"
            type="number"
            v-model.number="limit"
            :class="{'invalid': ($v.limit.$dirty && !$v.limit.minValue) || ($v.limit.$dirty && !$v.limit.required)}"
          >
          <label for="limit">{{ 'Limit' | localize}}</label>
          <span
            class="helper-text invalid"
            v-if="$v.limit.$dirty && !$v.limit.minValue"
          >
            {{ 'MinValue' | localize }} {{ $v.limit.$params.minValue.min }}</span>
          <span
            class="helper-text invalid"
            v-else-if="$v.limit.$dirty && !$v.limit.required"
          >
            {{ 'Required' | localize }}
          </span>
        </div>

        <button class="btn waves-effect waves-light" type="submit">
          {{ 'Update' | localize }}
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
  </div>

</template>

<script>
import localize from "@/filters/localize.filter";
import {minValue, required} from "vuelidate/lib/validators";

export default {
  name: "CategoryEdit",
  props: {
    categories: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    select: null,
    title: '',
    limit: 100,
    current: null
  }),
  validations: {
    title: {required},
    limit: {required, minValue: minValue(100)}
  },
  watch: {
    current(categoryId) {
      const {title, limit} = this.categories.find(c => c.id === categoryId)
      this.title = title
      this.limit = limit
      setTimeout(() => M.updateTextFields(), 0)
    }
  },
  created() {
    const {id, title, limit} = this.categories[0]
    this.current = id
    this.title = title
    this.limit = limit
  },
  mounted() {
    M.updateTextFields();
    this.select = M.FormSelect.init(this.$refs.selectCategory, {});
  },
  beforeDestroy() {
    if (this.select && this.select.destroy) {
      this.select.destroy()
    }
  },
  methods: {
    async submitCategoryEdit() {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }
      try {
        const categoryData = {
          id: this.current,
          title: this.title,
          limit: this.limit
        }
        await this.$store.dispatch('updateCategory', categoryData)
        this.$emit('updated', categoryData)
        this.$message(localize('CategoryUpdated'))
      } catch (e) {

      }
    }
  }
}
</script>

<style scoped>

</style>
