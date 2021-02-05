<template>
  <div>
    <canvas ref="paymentsTimeline">
    </canvas>
    <canvas ref="debtTimeline">
    </canvas>
  </div>
</template>

<script>
import {random_rgba} from "@/utils/helpers";
import Chart from "chart.js";

export default {
  name: "CreditCalcHistoryChart",
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    paymentsTimeline: null,
    debtTimeline: null,
    options: {}
  }),
  computed: {
    paymentsTimelineData() {
      const {backgroundColors, borderColors} = random_rgba(3, 0.2)
      return {
        labels: this.data.map(item => item.date),
        legend: {
          hidden: false,
          position: top
        },
        datasets: [
          {
            label: 'Платежи',
            data: this.data.map(item => item.payment),
            fillColor: backgroundColors[0],
            strokeColor: borderColors[0],
            borderWidth: 1
          },
          {
            label: 'Проценты',
            data: this.data.map(item => item.interest),
            fillColor: backgroundColors[1],
            strokeColor: borderColors[1],
            borderWidth: 1
          },
          {
            label: 'Погашение',
            data: this.data.map(item => item.body),
            fillColor: backgroundColors[2],
            strokeColor: borderColors[2],
            borderWidth: 1
          }
        ]
      }
    },
    debtTimelineData() {
      const {backgroundColors, borderColors} = random_rgba(2, 0.2)
      return {
        labels: this.data.map(item => item.date),
        legend: {
          hidden: false,
          position: top
        },
        datasets: [
          {
            label: 'Остаток долга',
            data: this.data.map(item => item.amountLeft),
            fillColor: backgroundColors[0],
            strokeColor: borderColors[0],
            borderWidth: 1
          },
          {
            label: 'Выплачено',
            data: this.data.map(item => item.amountPayed),
            fillColor: backgroundColors[1],
            strokeColor: borderColors[1],
            borderWidth: 1
          }
        ]
      }
    }
  },
  mounted() {
    this.paymentsTimeline = new Chart(this.$refs.paymentsTimeline, {
      type: 'line',
      data: this.paymentsTimelineData,
      options: this.options
    });

    this.paymentsTimeline = new Chart(this.$refs.debtTimeline, {
      type: 'line',
      data: this.debtTimelineData,
      options: this.options
    });

  },
  beforeDestroy() {
    if (this.paymentsTimeline) {
      this.paymentsTimeline.destroy()
    }
    if (this.debtTimeline) {
      this.debtTimeline.destroy()
    }

  }

}
</script>

<style scoped>

</style>
