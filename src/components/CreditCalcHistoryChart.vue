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
import {
  ArcElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PieController,
  PointElement,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Title,
  Tooltip
} from 'chart.js';
import 'chartjs-adapter-moment';
import moment from "moment/moment"

Chart.register(
  ArcElement,
  LineElement,
  PointElement,
  LineController,
  PieController,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Legend,
  Title,
  Tooltip
);

// import "moment/locale/ru"
// import "moment/locale/en-gb"


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
        responsive: true,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          yAxes: [{
            ticks: {
              callback: v => numberFilter(v),
            },
//            stacked: true // combine data
          }],
          x: {
            type: 'time',
            time: {
              unit: "month",
              displayFormats: {
                month: 'MMM YYYY',
                tooltipFormat: "MMM YYYY"
              }
            },
            ticks: {
              major: {
                enabled: true
              },
            },
          }
        },
        plugins: {
          tooltip: {
            enabled: true,
            mode: 'index',
            position: 'average'
          }
        },
        elements: {
          line: {
            tension: 0.1 // disables bezier curves
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
        interaction: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          yAxes: [{
            ticks: {
              min: 0,
              callback: v => numberFilter(v)
            }
          }],
          x: {
            type: 'time',
            time: {
              unit: "month",
              displayFormats: {
                month: 'MMM YYYY',
                tooltipFormat: "MMM YYYY"
              }
            },
            ticks: {
              source: 'auto'
            },
          }
        },
        elements: {
          line: {
            tension: 0.1 // disables bezier curves
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
            fill: true,
            data: this.history.map(item => item.payment),
            backgroundColor: backgroundColors[0],
            borderColor: borderColors[0],
            borderWidth: 2,
            pointRadius: 0,
          },
          {
            label: 'Проценты',
            fill: true,
            data: this.history.map(item => item.interest),
            backgroundColor: backgroundColors[1],
            borderColor: borderColors[1],
            borderWidth: 2,
            pointRadius: 0,
          },
          {
            label: 'Погашение',
            fill: true,
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
            fill: true,
            data: this.history.map(item => item.amountLeft),
            backgroundColor: backgroundColors[0],
            borderColor: borderColors[0],
            borderWidth: 2,
            pointRadius: 0,
          },
          {
            label: 'Выплачено',
            fill: true,
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

    // console.log(Chart)
    // const originalLineDraw = Chart.controllers.line.prototype.draw;
    // Chart.helpers.extend(Chart.controllers.line.prototype, {
    //   draw: function () {
    //     originalLineDraw.apply(this, arguments);
    //
    //
    //     if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
    //       const activePoint = this.chart.tooltip._active[0];
    //       const ctx = this.chart.ctx;
    //       const x = activePoint.tooltipPosition().x;
    //       const topY = this.chart.scales['y-axis-0'].top;
    //       const bottomY = this.chart.scales['y-axis-0'].bottom;
    //
    //       ctx.save();
    //       ctx.beginPath();
    //       ctx.moveTo(x, topY);
    //       ctx.lineTo(x, bottomY);
    //       ctx.lineWidth = 0.5;
    //       ctx.strokeStyle = '#666';
    //       ctx.stroke();
    //       ctx.restore();
    //     }
    //   }
    // })

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
