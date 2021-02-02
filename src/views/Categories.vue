<template>
  <div>
    <h3>{{ 'Categories' | localize }}</h3>

    <v-data-table
      :headers="categoryHeaders"
      :items="categories"
      :mobile-breakpoint="520"
      :no-data-text="'NoCategories' | localize"
      class="elevation-1"
    >

      <template v-slot:top>
        <v-toolbar
          flat
        >
          <v-spacer></v-spacer>
          <v-dialog
            v-model="dialog"
            max-width="500px"
            @click:outside="close"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
              >
                {{ 'Create' | localize }}
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-form
                v-model="valid"
                ref="editForm"
                @submit.prevent="save"
              >
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="editedItem.title"
                        :rules="titleRules"
                        :label="'Title' | localize"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="editedItem.limit"
                        :rules="limitRules"
                        :label="'Limit' | localize"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >

                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="close"
                >
                  {{ 'Cancel' | localize }}
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="save"
                >
                  {{ 'Save' | localize }}
                </v-btn>
              </v-card-actions>
              </v-form>
            </v-card>
          </v-dialog>

        </v-toolbar>
      </template>

      <template v-slot:item.limit="{ item }">
        {{ item.limit | number }}
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon
          small
          class="mr-2"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
      </template>

    </v-data-table>

  </div>
</template>

<script>
import localize from "@/filters/localize.filter";

export default {
  name: "Categories",
  metaInfo() {
    return {
      title: this.$title('Categories')
    }
  },
  data: () => ({
    dialog: false,
    valid: false,
    categories: [],
    categoryHeaders: [
      {text: localize('Title'), value: 'title'},
      {text: localize('Limit'), value: 'limit', align: 'right'},
      {text: localize('Actions'), value: 'actions', sortable: false}
    ],
    titleRules: [
      v => !!v || localize('EnterTitle')
    ],
    limitRules: [
      v => !!v || localize('Required'),
      v => v >= 100 || localize('MinValue') + ' 100'
    ],
    editedItem: {
      id: null,
      title: '',
      limit: 100
    },
    defaultItem: {
      id: null,
      title: '',
      limit: 100
    },
    loading: true,
    updateCount: 0
  }),
  computed: {
    formTitle() {
      return !this.editedItem.id ? localize('Create') : localize('Edit')
    }
  },
  async mounted() {
    try {
      this.categories = await this.$store.dispatch('fetchCategories')
    } catch (e) {

    } finally {
      this.loading = false
    }
  },
  methods: {

    async createCategory(newCategory) {
      try {
        const category = await this.$store.dispatch('createCategory', newCategory)
        this.$message(localize('CategoryCreated'))
        return category
      } catch (e) {}
    },

    async updateCategory(categoryData) {
      try {
        const category = await this.$store.dispatch('updateCategory', categoryData)
        this.$message(localize('CategoryUpdated'))
        return category
      } catch (e) {}
    },

    editItem(item) {
      this.editedIndex = this.categories.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.$refs.editForm.reset()
        this.editedItem = Object.assign({}, this.defaultItem)
      })
    },

    async save() {
      if (!this.valid) {
        this.$refs.editForm.validate()
        return
      }

      if (!!this.editedItem.id) {
        await this.updateCategory(this.editedItem)
        Object.assign(this.categories[this.editedIndex], this.editedItem)
      } else {
        const newCategory = await this.createCategory(this.editedItem)
        this.categories.push(newCategory)
      }
      this.close()
    },
  },
}
</script>

<style scoped>

</style>
