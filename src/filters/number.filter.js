export default function numberFilter(value) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency', currency: 'RUB'
  }).format(value)
}
