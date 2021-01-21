export default function numberFilter(value) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'decimal',
    useGrouping: true
  }).format(value)
}
