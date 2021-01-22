import store from '@/store'

export default function dateFilter(value, datetime = true) {

  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }

  if (datetime) {
    options.hour = '2-digit'
    options.minute = '2-digit'
    options.second = '2-digit'
  }

  const locale = store.getters.info.locale

  return new Intl
    .DateTimeFormat(locale, options)
    .format(new Date())
}
