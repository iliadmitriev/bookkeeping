<template>
  <div>
    <canvas ref="paymentsTimeline">
    </canvas>
    <canvas ref="debtTimeline">
    </canvas>
  </div>
</template>

<script>
import numberFilter from "@/filters/number.filter";
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
  }),
  computed: {
    paymentsTimelineOptions() {
      return {
        legend: {
          labels: {}
        },
        scales: {
          yAxes: [{
            ticks: {},
//            stacked: true // combine data
          }],
          xAxes: [{
            type: 'time',
            ticks: {},
          }]
        },
        tooltips: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: (value, data) => {
              return `${data.datasets[value.datasetIndex].label}: ${numberFilter(value.value)}`;
            },
          }
        },
        hover: {
          mode: 'nearest',
          intersect: true
        }
      }
    },
    debtTimelineOptions() {
      return {
        legend: {
          labels: {}
        },
        scales: {
          yAxes: [{
            ticks: {
              callback: v => numberFilter(v)
            },
          }],
          xAxes: [{
            type: 'time',
            ticks: {},
            time: {
              displayFormats: {
                quarter: 'MMM YYYY'
              }
            }
          }]
        },
        tooltips: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: (value, data) => {
              return `${data.datasets[value.datasetIndex].label}: ${numberFilter(value.value)}`;
            },
          }
        },
        hover: {
          mode: 'nearest',
          intersect: true
        }
      }
    },
    paymentsTimelineData() {
      const {backgroundColors, borderColors} = random_rgba(3, 0.2)
      return {
        labels: this.data.map(item => item.datetime),
        legend: {
          hidden: false,
          position: top
        },
        datasets: [

          {
            label: 'Платеж',
            data: this.data.map(item => item.payment),
            backgroundColor: backgroundColors[0],
            borderColor: borderColors[0],
            borderWidth: 1
          },
          {
            label: 'Проценты',
            data: this.data.map(item => item.interest),
            backgroundColor: backgroundColors[1],
            borderColor: borderColors[1],
            borderWidth: 1,
            pointHoverBorderWidth: 2
          },
          {
            label: 'Погашение',
            data: this.data.map(item => item.body),
            backgroundColor: backgroundColors[2],
            borderColor: borderColors[2],
            borderWidth: 1,
            pointHoverBorderWidth: 2
          }
        ]
      }
    },
    debtTimelineData() {
      const {backgroundColors, borderColors} = random_rgba(2, 0.2)
      return {
        labels: this.data.map(item => item.datetime),
        legend: {
          hidden: false,
          position: top
        },
        datasets: [
          {
            label: 'Остаток долга',
            data: this.data.map(item => item.amountLeft),
            backgroundColor: backgroundColors[0],
            borderColor: borderColors[0],
            borderWidth: 1
          },
          {
            label: 'Выплачено',
            data: this.data.map(item => item.amountPayed),
            backgroundColor: backgroundColors[1],
            borderColor: borderColors[1],
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
      options: this.paymentsTimelineOptions
    });

    this.debtTimeline = new Chart(this.$refs.debtTimeline, {
      type: 'line',
      data: this.debtTimelineData,
      options: this.debtTimelineOptions
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
