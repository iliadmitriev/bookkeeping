<template>
  <v-card elevation="0">
    <v-card-title>График платежей</v-card-title>

    <v-card-text>

      <v-data-table
        :items="history"
        :item-key="history.num"
        :headers="historyHeaders"
        :items-per-page="12"
        :group-by="'year'"
        :footer-props="{
          showFirstLastPage: true,
          itemsPerPageOptions: [12,24,36,-1],
          firstIcon: 'mdi-arrow-collapse-left',
          lastIcon: 'mdi-arrow-collapse-right',
          prevIcon: 'mdi-chevron-left',
          nextIcon: 'mdi-chevron-right'
        }"
      >

        <template v-slot:body.prepend="{isMobile}">
          <tr v-if="!isMobile">
            <th>
              <v-icon @click="toggleCollapse">
                {{ collapseAll ? 'mdi-chevron-down' : 'mdi-chevron-up' }}
              </v-icon>
            </th>
            <th class="th-text-right">{{ '' }}</th>
            <th class="th-text-right">{{ '' }}</th>
            <th class="th-text-right">{{ '' }}</th>
            <th></th>
          </tr>
        </template>
        <template v-slot:group.header="{items, isOpen, toggle, isMobile}">
          <th v-if="!isMobile">
            <v-icon
              @click="toggle"
              :data-open="isOpen"
              :ref="'group' + items[0].year"
            >{{ isOpen ? 'mdi-minus' : 'mdi-plus' }}
            </v-icon>
            {{ items[0].year }}
          </th>
          <th class="th-text-right" v-if="!isMobile">{{ sum(items, 'payment') | number }}</th>
          <th class="th-text-right" v-if="!isMobile">{{ sum(items, 'interest') | number }}</th>
          <th class="th-text-right" v-if="!isMobile">{{ sum(items, 'body') | number }}</th>
          <th class="th-text-right" v-if="!isMobile">{{ items[items.length - 1].amountLeft | number }}</th>
        </template>

        <template v-slot:item.payment="{item}">
          {{ item.payment | number }}
        </template>
        <template v-slot:item.interest="{item}">
          {{ item.interest | number }}
        </template>
        <template v-slot:item.body="{item}">
          {{ item.body | number }}
        </template>
        <template v-slot:item.amountLeft="{item}">
          {{ item.amountLeft | number }}
        </template>

      </v-data-table>

    </v-card-text>


  </v-card>
</template>

<script>
export default {
  name: "CreditCalcHistory",
  props: {
    history: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    collapseAll: false,
    dateStartMenu: false,
    historyHeaders: [
      {value: 'year', text: 'Год', groupable: true},
      {value: 'date', text: 'Дата платежа', align: 'center'},
      {value: 'payment', text: 'Платеж', align: 'right'},
      {value: 'interest', text: 'Проценты', align: 'right'},
      {value: 'body', text: 'Основной долг', align: 'right'},
      {value: 'amountLeft', text: 'Остаток долга', align: 'right'}
    ]
  }),
  methods: {
    sum(arr, field) {
      return arr.reduce((s, i) => s += i[field], 0)
    },
    toggleCollapse() {
      this.collapseAll = !this.collapseAll
      Object.keys(this.$refs).forEach(k => {
        console.log(this.$refs[k])
        if (this.$refs[k]) {
          this.$refs[k].$el.click()
        }
      })
    }
  },
  computed: {},

}
</script>

<style scoped>
.th-text-right {
  text-align: right !important;
}

.th-text-center {
  text-align: center !important;
}

</style>
