<template>
  <div>
    <div class="page-title">
      <h3>Новая запись</h3>
    </div>

    <Loader
      v-if="loading"
    />
    <div
      v-else-if="!categories.length"
      class="center">
      <p>Категорий пока нет, возможно вы еще их не добавили</p>
      <router-link tag="a" class="btn" to="/categories">
        Добавить новую категорию
      </router-link>
    </div>
    <form
      v-else
      class="form" @submit.prevent="submitRecord">
      <div class="input-field">
        <select
          ref="selectCategory"
        >
          <option
            v-for="cat in categories"
            :key="cat.id"
            :value="cat.id"
          >{{ cat.title }}
          </option>
        </select>
        <label>Выберите категорию</label>
      </div>

      <p>
        <label>
          <input
            class="with-gap"
            name="type"
            type="radio"
            value="income"
            v-model="type"
          />
          <span>Доход</span>
        </label>
      </p>

      <p>
        <label>
          <input
            class="with-gap"
            name="type"
            type="radio"
            value="outcome"
            v-model="type"
          />
          <span>Расход</span>
        </label>
      </p>
      <span
        class="helper-text invalid"
        v-if="$v.type.$dirty && !$v.type.required"
      >
        Выберите тип
      </span>

      <div class="input-field">
        <input
          id="amount"
          type="number"
          v-model.number="amount"
          :class="{'invalid': ($v.amount.$dirty && !$v.amount.minValue) || ($v.amount.$dirty && !$v.amount.required)}"
        >
        <label for="amount">Сумма</label>
        <span
          class="helper-text invalid"
          v-if="$v.amount.$dirty && !$v.amount.minValue"
        >
            Минимальное значение суммы {{ $v.amount.$params.minValue.min }}</span>
        <span
          class="helper-text invalid"
          v-else-if="$v.amount.$dirty && !$v.amount.required"
        >
            Укажите сумму
          </span>
      </div>

      <div class="input-field">
        <input
          id="description"
          type="text"
          v-model="description"
          :class="{'invalid': $v.description.$dirty && !$v.description.required}"
        >
        <label for="description">Описание</label>
        <span
          class="helper-text invalid"
          v-if="$v.description.$dirty && !$v.description.required"
        >
          Введите описание
        </span>
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        Создать
        <i class="material-icons right">send</i>
      </button>
    </form>

  </div>
</template>

<script>
import Loader from "@/components/app/Loader";
import {minValue, required} from "vuelidate/lib/validators";
import {mapGetters} from 'vuex'

export default {
  name: "Record",
  components: {Loader},
  data: () => ({
    categories: [],
    loading: true,
    select: null,
    category: null,
    type: '',
    amount: 100,
    description: ''
  }),
  validations: {
    type: {required},
    amount: {required, minValue: minValue(100)},
    description: {required}
  },
  async mounted() {
    try {
      this.categories = await this.$store.dispatch('fetchCategories')
    } catch (e) {
    } finally {
      this.loading = false
    }

    if (this.categories.length) {
      this.category = this.categories[0].id
    }

    setTimeout(() => {
      this.select = M.FormSelect.init(this.$refs.selectCategory, {})
      M.updateTextFields()
    }, 0)
  },
  computed: {
    ...mapGetters(['info']),
    canCreateRecord() {
      if (this.type === 'income') {
        return true
      }

      return this.info.bill >= this.amount

    }
  },
  methods: {
    async submitRecord() {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }

      if (this.canCreateRecord) {
        try {
          const record = {
            amount: this.amount,
            description: this.description,
            categoryId: this.category,
            type: this.type,
            datetime: new Date().toJSON()
          }
          await this.$store.dispatch('createRecord', record)
          const bill = this.type === 'income'
            ? this.info.bill + this.amount
            : this.info.bill - this.amount

          await this.$store.dispatch('updateInfo', {bill})

          this.$message('Запись успешно добавлена')
          this.type = ''
          this.amount = 100
          this.description = ''
          this.$v.$reset()

        } catch (e) {
          this.$error(e)
        }
      } else {
        this.$message(`Недостаточно средст на счете, не хватает ${this.amount - this.info.bill}`)
      }

    }
  },
  beforeDestroy() {
    if (this.select && this.select.destroy) {
      this.select.destroy()
    }
  }
}
</script>

<style scoped>

</style>
