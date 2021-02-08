<template>
  <canvas ref="canvas">
  </canvas>
</template>

<script>
import {random_rgba} from "@/utils/helpers";
import Chart from "chart.js";
import numberFilter from "@/filters/number.filter";

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
        type: 'doughnut',
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
          },
          tooltips: {
            callbacks: {
              label: (value, data) => {
                return `${data.labels[value.index]}: ${numberFilter(data.datasets[value.datasetIndex].data[value.index])}`;
              },
            }
          },
          responsive : true,
          onClick: (ev, el) => {

/*
            const config = this.interestChart.config

            const ang1 = el[0]._view.startAngle - config.options.rotation
            const ang2 = el[0]._view.endAngle - config.options.rotation

            config.options.rotation = ((ang2 - ang1) / 2) * (-1) + config.options.rotation

            this.interestChart.update(config)
*/
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
