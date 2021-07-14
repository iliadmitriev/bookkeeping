import dateFilter from "@/filters/date.filter"
import currencyFilter from "@/filters/currency.filter"
import numberFilter from "@/filters/number.filter"
import localizeFilter from "@/filters/localize.filter"

import store from '@/store'


describe('Filters Testsuite', () => {
  it('dateFilter function', () => {
    store.commit('setInfo', {locale: 'ru-RU'})
    const res = dateFilter(new Date('2004-01-31T07:00:00'))
    expect(res).toBe('31.01.2004, 07:00:00')

    const res2 = dateFilter(new Date('2004-01-31T07:00:00'), false)
    expect(res2).toBe('31.01.2004')

    const res3 = dateFilter('2004-01-31T07:00:00', false)
    expect(res3).toBe('31.01.2004')
    store.commit('clearInfo')

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

    store.commit('setInfo', {locale: 'en-US'})
    mockLocalStorageGetItem.mockClear()
    expect(localizeFilter('Language')).toBe('Language')
    expect(mockLocalStorageGetItem).not.toBeCalled()
    store.commit('clearInfo')
  })

  it('localizeFilter function, from local storage', () => {

    store.commit('clearInfo')
    mockLocalStorageGetItem.mockClear()
    mockLocalStorageGetItem.mockImplementationOnce(() => 'en-US')
    expect(localizeFilter('Language')).toBe('Language')
    expect(mockLocalStorageGetItem).toBeCalledTimes(1)
    expect(mockLocalStorageGetItem).toBeCalledWith('locale')

  })

  it('localizeFilter function, no local storage, no profile info', () => {

    store.commit('clearInfo')

    mockLocalStorageGetItem.mockClear()
    mockLocalStorageGetItem.mockImplementationOnce(() => null)
    expect(localizeFilter('Language')).toBe('Язык')
    expect(mockLocalStorageGetItem).toBeCalledTimes(1)
    expect(mockLocalStorageGetItem).toBeCalledWith('locale')

  })

  it('localizeFilter function, key does not exists', () => {

    store.commit('setInfo', {locale: 'en-US'})
    mockLocalStorageGetItem.mockClear()
    mockLocalStorageGetItem.mockImplementationOnce(() => null)
    expect(localizeFilter('NonExistentRandomKey'))
      .toBe('[localize error]: key NonExistentRandomKey not found')
    expect(mockLocalStorageGetItem).not.toBeCalled()
    store.commit('clearInfo')


  })

})
