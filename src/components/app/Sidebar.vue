<template>
  <ul
    class="sidenav app-sidenav"
    :class="{'open': value}"
  >

    <router-link
      v-for="link in links"
      :key="link.url"
      tag="li"
      active-class="active"
      :to="link.url"
      :exact="link.exact"
    >
      <a
        href="#"
        class="waves-effect waves-orange pointer"
      >
        {{ link.title }}
      </a>
    </router-link>

  </ul>
</template>


<script>
import localize from '@/filters/localize.filter'

export default {
  name: "Sidebar",
  props: ['value'],
  data: () => ({
    links: [
      {title: localize('Sidebar_Account'), url: '/', exact: true},
      {title: localize('Sidebar_History'), url: '/history', exact: false},
      {title: localize('Sidebar_Planning'), url: '/planning', exact: false},
      {title: localize('Sidebar_NewRecord'), url: '/record', exact: false},
      {title: localize('Sidebar_Categories'), url: '/categories', exact: false}
    ]
  })
}
</script>

<style scoped>

</style>
