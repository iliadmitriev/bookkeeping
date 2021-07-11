import CreditCalc from "@/views/CreditCalc";
import {createLocalVue, mount} from "@vue/test-utils"
import localizeFilter from "@/filters/localize.filter";
import numberFilter from "@/filters/number.filter";
import Vue from "vue";
import Vuetify from "vuetify";
import 'jest-canvas-mock';


global.ResizeObserver = require('resize-observer-polyfill')

const vuetify = new Vuetify()
Vue.use(Vuetify)
const localVue = createLocalVue()
localVue.filter('localize', localizeFilter)
localVue.filter('number', numberFilter)

describe('CreditCalc view component testsuite', () => {
  let wrapper

  it('mount component', () => {
    wrapper = mount(CreditCalc, {
      localVue,
      vuetify
    })

  })

  it('set props data', () => {
    wrapper.find('#inputObjectCost').setValue('6000000')
    wrapper.find('#inputCreditAmount').setValue('5000000')
    wrapper.find('#inputIsAnnuity').setChecked(false)
    //console.log(wrapper.vm.$data.creditAmountText)

    expect(wrapper.vm.objectCostText).toBe('6000000')
    expect(wrapper.vm.creditAmountText).toBe('5000000')

    wrapper.vm.$nextTick()

    // expect(wrapper.vm.objectCost).toEqual(6000000)
    // expect(wrapper.vm.$data.creditAmount).toBe(5000000)

  })
})