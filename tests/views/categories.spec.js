import Categories from "@/views/Categories";
import {mount, shallowMount} from "@vue/test-utils"
import store from '@/store'
import numberFilter from "@/filters/number.filter";


describe('Categories.vue view testsuite', () => {

  describe('component render', () => {

    beforeEach(() => {
      mockFbPush.mockClear()
      mockOnceVal.mockClear()
    })

    let wrapper


    // to suppress vuetify warning
    // about div with data-app attribute
    const app = document.createElement('div');
    app.setAttribute('data-app', null);
    document.body.append(app);

    it('successful mount', async () => {
      const categories = {
        "105": {
          "limit": 100000,
          "title": "Заработная плата"
        },
        "106": {
          "limit": 15000,
          "title": "Развлечения"
        },
        "107": {
          "limit": "5000",
          "title": "Прочее"
        }
      }
      mockOnceVal.mockImplementationOnce(() => categories)

      wrapper = mount(Categories, {
        localVue,
        vuetify,
        store,
        mocks: {
          $message: jest.fn()
        }
      })

      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()

      const tableWrapper = wrapper.find('#dataTable')
      const table = tableWrapper.find('table')
      expect(mockOnceVal).toBeCalledTimes(1)
      expect(wrapper.vm.$data.categories)
        .toStrictEqual(Object.entries(categories).map(el => ({id: el[0], ...el[1]})))
      expect(table.text()).toMatch("Заработная плата")
      expect(table.text()).toMatch("Развлечения")
      expect(table.text()).toMatch("Прочее")
      expect(tableWrapper.find('#btnNewCategory').exists())
        .toBe(true)
      expect(table.find('tbody').element.childElementCount)
        .toBe(3)
    })

    it('check vue-meta plugin metaInfo', () => {
      expect(wrapper.vm.$meta().getOptions().keyName).toBe('metaInfo')
      expect(wrapper.vm.$meta().inject().title.text())
        .toBe(`<title>Категории | </title>`)

    })

    it('mount does not resolve', async () => {
      const mountError = new Error('Test mount error')
      mockOnceVal.mockImplementationOnce(() => {
        throw mountError
      })

      shallowMount(Categories, {
        localVue: localVue,
        store,
      })
    })

    it('fill create dialog window and submit', async () => {
      const response = {
        key: '1333',
        id: '1333',
        limit: 1000,
        title: "Связь"
      }
      mockFbPush.mockImplementationOnce(() => response)
      await wrapper.find('#btnNewCategory').trigger('click')
      const inputTitle = wrapper.find('#inputTitle')
      const inputLimit = wrapper.find('#inputLimit')
      inputTitle.setValue('Связь')
      inputLimit.setValue('1000')


      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.$data.editedItem.title).toBe('Связь')
      expect(wrapper.vm.$data.editedItem.limit).toBe(1000)

      await wrapper.find('#dialogSave').trigger('click')
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()

      expect(mockFbPush).toBeCalledTimes(1)
      const tableWrapper = wrapper.find('#dataTable')
      const table = tableWrapper.find('table')
      expect(table.find('tbody').element.childElementCount)
        .toBe(4)

      expect(table.find('tbody').element.children.item(3).innerHTML)
        .toMatch('Связь')

    })

    it('fill create dialog window and submit throwing error', async () => {
      const testError = new Error('Test create exception')
      mockFbPush.mockImplementationOnce(() => {
        throw testError
      })
      await wrapper.find('#btnNewCategory').trigger('click')
      const inputTitle = wrapper.find('#inputTitle')
      const inputLimit = wrapper.find('#inputLimit')
      inputTitle.setValue('Помощь нуждающимся')
      inputLimit.setValue('2000')

      expect(wrapper.vm.$data.editedItem.title).toBe('Помощь нуждающимся')
      expect(wrapper.vm.$data.editedItem.limit).toBe(2000)

      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()

      await expect(wrapper.vm.save()).resolves.not.toThrowError(testError)
      for (let j = 0; j < 6; j++) {
        await wrapper.vm.$nextTick()
      }

      expect(mockFbPush).toBeCalledTimes(1)
      const tableWrapper = wrapper.find('#dataTable')
      const table = tableWrapper.find('table')
      expect(table.find('tbody').element.childElementCount)
        .toBe(4)

      expect(store.getters.error).toBe(testError)

      store.commit('clearError')

    })

    it('fill create dialog with invalid data and submit', async () => {
      await wrapper.find('#btnNewCategory').trigger('click')
      const inputTitle = wrapper.find('#inputTitle')
      const inputLimit = wrapper.find('#inputLimit')
      wrapper.vm.$refs.editForm.validate = jest.fn()

      inputTitle.setValue('На подарки')
      inputLimit.setValue('50')
      expect(wrapper.vm.$data.editedItem.title).toBe('На подарки')
      expect(wrapper.vm.$data.editedItem.limit).toBe(50)
      await wrapper.find('#dialogSave').trigger('click')

      inputTitle.setValue('')
      inputLimit.setValue('')
      expect(wrapper.vm.$data.editedItem.title).toBe('')
      expect(wrapper.vm.$data.editedItem.limit).toBe('')
      await wrapper.find('#dialogSave').trigger('click')

      expect(wrapper.vm.$refs.editForm.validate).toBeCalledTimes(2)
      wrapper.vm.close()
      await wrapper.vm.$nextTick()

    })

    const testError = new Error('Test error')
    it.each([
      {
        title: 'without error', input: {title: 'Одежда', limit: 10000},
        response: () => ({title: 'Одежда', limit: 10000, id: 166}),
        expected: true
      },
      {
        title: 'with error', input: {title: 'Автомобиль', limit: 20000},
        response: () => {
          throw testError
        },
        expected: false
      }
    ])
    ('select edit first category and submit ($title)',
      async ({title, input, response, expected}) => {

        store.commit('clearError')
        mockFbUpdate.mockImplementationOnce(response)
        const tableWrapper = wrapper.find('#dataTable')
        const table = tableWrapper.find('table')
        expect(table.find('tbody').element.childElementCount)
          .toBe(4)

        //get 3rd line edit button
        expect(table.find('tbody').findAll('[data-edit]').length)
          .toBe(4)
        await table.find('tbody').findAll('[data-edit]')
          .at(2)
          .trigger('click')

        const inputTitle = wrapper.find('#inputTitle')
        const inputLimit = wrapper.find('#inputLimit')
        inputTitle.setValue(input.title)
        inputLimit.setValue(input.limit)

        await wrapper.vm.$nextTick()
        await wrapper.vm.$nextTick()

        expect(wrapper.vm.$data.editedItem.title).toBe(input.title)
        expect(wrapper.vm.$data.editedItem.limit).toBe(input.limit)

        await wrapper.find('#dialogSave').trigger('click')

        for (let j = 0; j < 7; j++) {
          await wrapper.vm.$nextTick()
        }

        if (expected) {
          expect(store.getters.error).toBe(null)
          expect(
            table.find('tbody').findAll('tr')
              .at(2).findAll('td')
              .at(0).text()
          ).toBe(input.title)

          expect(
            table.find('tbody').findAll('tr')
              .at(2).findAll('td')
              .at(1).text()
          ).toBe(numberFilter(input.limit))
        } else {
          expect(store.getters.error).toBe(testError)
          expect(
            table.find('tbody').findAll('tr')
              .at(2).findAll('td')
              .at(0).text()
          ).not.toBe(input.title)

          expect(
            table.find('tbody').findAll('tr')
              .at(2).findAll('td')
              .at(1).text()
          ).not.toBe(numberFilter(input.limit))
        }
      })


    it('updateCategory resolves with await', async () => {
      const response = {title: 'Одежда', limit: 10000, id: 166}
      mockFbUpdate.mockImplementationOnce(() => response)

      expect(await wrapper.vm.updateCategory(
        {title: 'Одежда', limit: 10000, id: 166})
      ).toBe(response)
    })

  })

})
