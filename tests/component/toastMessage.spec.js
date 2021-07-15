import ToastMessage from "@/components/ToastMessage";
import {mount} from "@vue/test-utils";

describe('ToastMessage.vue component testsuite', () => {
  let toastWrapper

  it.each([
    {name: 'hide'},
    {name: 'close'}
  ])('mount component and $name',
    async ({name}) => {
      //parent element
      const div = document.createElement('div')
      document.body.appendChild(div)

      toastWrapper = mount(ToastMessage, {
        attachTo: div,
        localVue,
        vuetify,
        propsData: {
          timeout: 2000,
          message: "Test message for show"
        }
      })
      await flushPromises()
      expect(toastWrapper.exists()).toBe(true)
      expect(toastWrapper.html()).toContain('Test message for show')
      expect(toastWrapper.vm.show).toBe(true)

      if (name === 'hide') {
        toastWrapper.vm.show = false
      } else {
        await toastWrapper.find('button').trigger('click')
      }
      await flushPromises()
      expect(toastWrapper.exists()).toBe(false)
    })

})
