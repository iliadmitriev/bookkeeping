<template>
  <div>
    <h3>{{ 'RecordAdd' | localize }}</h3>

    <Loader
      v-if="loading"
    />
    <div
      v-else-if="!categories.length"
      class="center">
      <p>{{ 'RecordNoCategories' | localize }}</p>
      <v-btn link to="/categories">
        {{ 'Add' | localize }}
      </v-btn>
    </div>

    <v-form
      v-model="valid"
      ref="form"
      v-else
      @submit.prevent="submitRecord"
    >
      <v-select
        :items="categories"
        item-text="title"
        item-value="id"
        v-model="category"
        :rules="categoryRules"
        :label="'Category' | localize"
        :placeholder="'SelectCategory' | localize"
      >
      </v-select>

      <v-radio-group
        v-model="type"
        :rules="typeRules"
        :label="'ChoseType' | localize"
      >
        <v-radio
          :value="'income'"
          :key="'income'"
          :label="'Income' | localize"
        ></v-radio>
        <v-radio
          :value="'outcome'"
          :key="'outcome'"
          :label="'Expenses' | localize"
        ></v-radio>
      </v-radio-group>


      <v-text-field
        id="amount"
        type="number"
        v-model.number="amount"
        :label="'Amount' | localize"
        :rules="rulesAmount"
      ></v-text-field>

      <v-text-field
        id="description"
        type="text"
        v-model="description"
        :label="'Description' | localize"
        :rules="rulesDescription"
      ></v-text-field>

      <v-btn type="submit"
             :loading="loading"
             :disabled="loading"
      >
        {{ 'Add' | localize }}
        <v-icon>mdi-send</v-icon>
      </v-btn>
    </v-form>

  </div>
</template>

<script>
import localize from '@/filters/localize.filter'
import number from "@/filters/number.filter";
import Loader from "@/components/app/Loader";
import {mapGetters} from 'vuex'

export default {
  name: "Record",
  metaInfo() {
    return {
      title: this.$title('RecordAdd')
    }
  },
  components: {Loader},
  data: () => ({
    loading: true,
    valid: false,
    categories: [],
    submitting: true,
    select: null,
    category: null,
    categoryRules: [
      v => !!v || localize('SelectCategory')
    ],
    type: '',
    typeRules: [
      v => !!v || localize('ChoseType')
    ],
    amount: 100,
    rulesAmount: [
      v => !!v || localize('Required'),
      v => v >= 100 || `${localize('MinValue')} 100`
    ],
    description: '',
    rulesDescription: [
      v => !!v || localize('Required')
    ]
  }),
  async mounted() {
    try {
      this.categories = await this.$store.dispatch('fetchCategories')
    } catch (e) {
    } finally {
      this.loading = false
    }
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
      if (!this.valid) {
        this.$refs.form.validate()
        return
      }

      if (this.canCreateRecord) {
        this.submitting = true
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

          this.$message(localize('RecordAdded'))

          this.type = ''
          this.amount = 100
          this.description = ''

        } catch (e) {
          this.$error(e)
        } finally {
          this.submitting = false
        }
      } else {
        this.$message(`${localize('InsufficientFunds')} ${number(this.amount - this.info.bill)}`)

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
