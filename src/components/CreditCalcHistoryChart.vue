<template>
  <v-card-text>
    <v-row>
      <v-col
        cols="5"
      >
        <v-checkbox
          v-model="calcInflation"
          :label="`Учитывать инфляцию`"
        ></v-checkbox>
        <v-text-field
          v-if="calcInflation"
          type="number"
          prepend-inner-icon="mdi-percent"
          label="Среднее значение инфляции в год"
          v-model="inflationRate"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <canvas ref="paymentsTimeline"></canvas>

        <canvas ref="debtTimeline"></canvas>
      </v-col>
    </v-row>
  </v-card-text>
</template>

<script>
import numberFilter from "@/filters/number.filter";
import {random_rgba} from "@/utils/helpers";
import Chart from "chart.js";
import moment from "moment/moment"
import "moment/locale/ru"
import "moment/locale/en-gb"


export default {
  name: "CreditCalcHistoryChart",
  props: {
    history: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    paymentsTimeline: null,
    debtTimeline: null,
    calcInflation: false,
    inflationRate: 4.5,
  }),
  watch: {
    paymentsTimelineData() {
      this.paymentsTimeline.data = this.paymentsTimelineData
      this.paymentsTimeline.update()
    },
    debtTimelineData() {
      this.debtTimeline.data = this.debtTimelineData
      this.debtTimeline.update()
    }
  },
  computed: {
    paymentsTimelineOptions() {
      return {
        legend: {
          labels: {}
        },
        scales: {
          yAxes: [{
            ticks: {
              callback: v => numberFilter(v)
            },
//            stacked: true // combine data
          }],
          xAxes: [{
            type: 'time',
            time: {
              tooltipFormat: "MMM YYYY"
            },
            ticks: {},
          }]
        },
        elements: {
          line: {
            tension: 0.1 // disables bezier curves
          }
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
              min: 0,
              callback: v => numberFilter(v)
            }
          }],
          xAxes: [{
            type: 'time',
            ticks: {},
            time: {
              tooltipFormat: "MMM YYYY"
            }
          }]
        },
        elements: {
          line: {
            tension: 0.1 // disables bezier curves
          }
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
        labels: this.history.map(item => item.datetime),
        legend: {
          hidden: false,
          position: top
        },
        datasets: [
          {
            label: 'Платеж',
            data: this.history.map(item => item.payment),
            backgroundColor: backgroundColors[0],
            borderColor: borderColors[0],
            borderWidth: 2,
            pointRadius: 0,
          },
          {
            label: 'Проценты',
            data: this.history.map(item => item.interest),
            backgroundColor: backgroundColors[1],
            borderColor: borderColors[1],
            borderWidth: 2,
            pointRadius: 0,
          },
          {
            label: 'Погашение',
            data: this.history.map(item => item.body),
            backgroundColor: backgroundColors[2],
            borderColor: borderColors[2],
            borderWidth: 2,
            pointRadius: 0,
          }
        ]
      }
    },
    debtTimelineData() {
      const {backgroundColors, borderColors} = random_rgba(2, 0.2)
      return {
        labels: this.history.map(item => item.datetime),
        legend: {
          hidden: false,
          position: top
        },
        datasets: [
          {
            label: 'Остаток долга',
            data: this.history.map(item => item.amountLeft),
            backgroundColor: backgroundColors[0],
            borderColor: borderColors[0],
            borderWidth: 2,
            pointRadius: 0,
          },
          {
            label: 'Выплачено',
            data: this.history.map(item => item.amountPayed),
            backgroundColor: backgroundColors[1],
            borderColor: borderColors[1],
            borderWidth: 2,
            pointRadius: 0,
          }
        ]
      }
    }
  },
  mounted() {

    moment.locale('ru')

    const originalLineDraw = Chart.controllers.line.prototype.draw;
    Chart.helpers.extend(Chart.controllers.line.prototype, {
      draw: function () {
        originalLineDraw.apply(this, arguments);


        if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
          const activePoint = this.chart.tooltip._active[0];
          const ctx = this.chart.ctx;
          const x = activePoint.tooltipPosition().x;
          const topY = this.chart.scales['y-axis-0'].top;
          const bottomY = this.chart.scales['y-axis-0'].bottom;

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(x, topY);
          ctx.lineTo(x, bottomY);
          ctx.lineWidth = 0.5;
          ctx.strokeStyle = '#666';
          ctx.stroke();
          ctx.restore();
        }
      }
    })

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
