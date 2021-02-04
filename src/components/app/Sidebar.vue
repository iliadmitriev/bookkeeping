<template>
  <v-navigation-drawer
    v-model="drawer"
    absolute
    temporary
  >

    <v-list>
      <v-list-item
        v-for="link in links"
        :key="link.url"
        active-class="active"
        :to="link.url"
        :exact="link.exact"
        link
        nav
      >
        {{ link.title }}
      </v-list-item>
    </v-list>

  </v-navigation-drawer>
</template>


<script>
import localize from '@/filters/localize.filter'

export default {
  name: "Sidebar",
  props: ['value'],
  data: () => ({
    drawer: false,
    links: [
      {title: localize('Sidebar_Account'), url: '/', exact: true},
      {title: localize('Sidebar_CreditCalc'), url: '/credit-calc', exact: false},
      {title: localize('Sidebar_History'), url: '/history', exact: false},
      {title: localize('Sidebar_Planning'), url: '/planning', exact: false},
      {title: localize('Sidebar_NewRecord'), url: '/record', exact: false},
      {title: localize('Sidebar_Categories'), url: '/categories', exact: false}
    ]
  }),
  watch: {
    value() {
      this.drawer = !this.drawer
    }
  }

}
</script>

<style scoped>

</style>
