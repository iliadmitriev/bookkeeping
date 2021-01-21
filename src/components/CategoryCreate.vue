<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>Создать</h4>
      </div>

      <form @submit.prevent="submitCreateCategory">

        <div class="input-field">
          <input
            id="name"
            type="text"
            v-model.trim="title"
            :class="{'invalid': $v.title.$dirty && !$v.title.required}"
          >
          <label for="name">Название</label>
          <span
            class="helper-text invalid"
            v-if="$v.title.$dirty && !$v.title.required"
          >
            Введите название категории</span>
        </div>

        <div class="input-field">
          <input
            id="limit"
            type="number"
            v-model.number="limit"
            :class="{'invalid': ($v.limit.$dirty && !$v.limit.minValue) || ($v.limit.$dirty && !$v.limit.required)}"
          >
          <label for="limit">Лимит</label>
          <span
            class="helper-text invalid"
            v-if="$v.limit.$dirty && !$v.limit.minValue"
          >
            Минимальное значение {{ $v.limit.$params.minValue.min }}</span>
          <span
            class="helper-text invalid"
            v-else-if="$v.limit.$dirty && !$v.limit.required"
          >
            Укажите лимит
          </span>
        </div>

        <button class="btn waves-effect waves-light" type="submit">
          Создать
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
  </div>

</template>

<script>
import {required, minValue} from 'vuelidate/lib/validators'

export default {
  name: "CategoryCreate",
  data: () => ({
    title: '',
    limit: 100
  }),
  validations: {
    title: {required},
    limit: {required, minValue: minValue(100)}
  },
  mounted() {
    M.updateTextFields();
  },
  methods: {
    async submitCreateCategory() {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }
      try {
        const category = await this.$store.dispatch('createCategory', {
          title: this.title,
          limit: this.limit
        })
        this.$emit('created', category)
        this.$message('Категория создана')
        this.title = ''
        this.limit = 100
        this.$v.reset()
      } catch (e) {}
    }
  }
}
</script>

<style scoped>
form {
  margin-bottom: 20px;
}
</style>
