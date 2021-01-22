<template>
  <table>
    <thead>
    <tr>
      <th>#</th>
      <th class="left-align">{{ 'Amount' | localize }}</th>
      <th class="center-align">{{ 'Date' | localize }}</th>
      <th>{{ 'Category' | localize }}</th>
      <th>{{ 'Type' | localize }}</th>
      <th>{{ 'Open' | localize }}</th>
    </tr>
    </thead>
    <tbody>
    <tr
      v-for="(rec, i) in records"
    >
      <td>{{ i + 1 }}</td>
      <td class="left-align">{{ rec.amount | number }}</td>
      <td class="center-align">{{ rec.datetime | date }}</td>
      <td>{{ rec.categoryName }}</td>
      <td>
        <span class="white-text badge"
              :class="rec.typeClass"
        >
          {{ rec.typeText }}
        </span>
      </td>
      <td>
        <button
          class="btn-small btn"
          v-tooltip="$options.filters.localize('ShowRecord')"
          @click="$router.push('/detail/' + rec.id)"
        >
          <i class="material-icons">open_in_new</i>
        </button>
      </td>
    </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: "HistoryTable",
  props: {
    records: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
.left-align {
  text-align: right;
}

.center-align {
  text-align: center;
}
</style>
