import dateFilter from "@/filters/date.filter"
import currencyFilter from "@/filters/currency.filter"
import numberFilter from "@/filters/number.filter"
import localizeFilter from "@/filters/localize.filter"

jest.mock('@/store', () => ({
  getters: {info: {locale: 'ru-RU'}}
}))
const store = require('@/store')

const localStorageMock = jest.fn(() => 'ru-RU')
Storage.prototype.getItem = localStorageMock


describe('Filters Testsuite', () => {
  it('dateFilter function', () => {
    const res = dateFilter(new Date('2004-01-31T07:00:00'))
    expect(res).toBe('31.01.2004, 07:00:00')

    const res2 = dateFilter(new Date('2004-01-31T07:00:00'), false)
    expect(res2).toBe('31.01.2004')

    const res3 = dateFilter('2004-01-31T07:00:00', false)
    expect(res3).toBe('31.01.2004')
  })

  it('currencyFilter function', () => {
    const res = currencyFilter('100')
    expect(res).toBe('100,00 ₽')

    const res2 = currencyFilter('100', 'RUB')
    expect(res2).toBe('100,00 ₽')
  })

  it('numberFilter function', () => {
    const res = numberFilter('100')
    expect(res).toBe('100,00 ₽')

    const res2 = numberFilter('100.123')
    expect(res2).toBe('100,12 ₽')

    const res3 = numberFilter('100.129')
    expect(res3).toBe('100,13 ₽')
  })

  it('localizeFilter function, from profile info', () => {

    store.getters.info.locale = 'en-US'
    localStorageMock.mockClear()
    expect(localizeFilter('Language')).toBe('Language')
    expect(localStorageMock).not.toBeCalled()
  })

  it('localizeFilter function, from local storage', () => {

    store.getters.info.locale = null
    localStorageMock.mockClear()
    localStorageMock.mockImplementationOnce(() => 'en-US')
    expect(localizeFilter('Language')).toBe('Language')
    expect(localStorageMock).toBeCalledTimes(1)
    expect(localStorageMock).toBeCalledWith('locale')

  })

  it('localizeFilter function, no local storage, no profile info', () => {

    store.getters.info.locale = null
    localStorageMock.mockClear()
    localStorageMock.mockImplementationOnce(() => null)
    expect(localizeFilter('Language')).toBe('Язык')
    expect(localStorageMock).toBeCalledTimes(1)
    expect(localStorageMock).toBeCalledWith('locale')

  })

  it('localizeFilter function, key does not exists', () => {

    store.getters.info.locale = 'en-US'
    localStorageMock.mockClear()
    localStorageMock.mockImplementationOnce(() => null)
    expect(localizeFilter('NonExistentRandomKey'))
      .toBe('[localize error]: key NonExistentRandomKey not found')
    expect(localStorageMock).not.toBeCalled()


  })

})
