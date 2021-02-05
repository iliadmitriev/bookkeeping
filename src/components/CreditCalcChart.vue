<template>
  <canvas ref="canvas">
  </canvas>
</template>

<script>
import {random_rgba} from "@/utils/helpers";
import Chart from "chart.js";

export default {
  name: "CreditCalcChart",
  data: () => ({
    interestChart: null
  }),
  props: {
    creditAmount: {
      type: Number,
      required: true
    },
    totalInterest: {
      type: Number,
      required: true
    }
  },
  mounted() {
    const {backgroundColors, borderColors} = random_rgba(2, 0.2)

    this.renderChart(this.$refs.canvas.getContext('2d'),
      {
        type: 'pie',
        data: {
          labels: ['Основной долг', 'Переплата'],
          legend: {
            hidden: true
          },
          datasets: [{
            label: '',
            data: [this.creditAmount, this.totalInterest],
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1
          }]
        },
        options: {
          legend: {
            display: false
          }
        }
      }
    )
  },
  methods: {
    renderChart($el, {type, data, options}) {
      this.interestChart = new Chart($el, {
        type: type,
        data: data,
        options: options
      });
    }
  },
  beforeDestroy() {
    if (this.interestChart) {
      this.interestChart.destroy()
    }
  }
}
</script>

<style scoped>

</style>
