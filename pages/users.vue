<template>
  <v-row>
    <v-col cols="12">
      <p v-if="$fetchState.error">An error occurred :(</p>
      <div v-else>
        <v-data-table
          v-bind="tableProps"
          @update:items-per-page="updatePagination($event, 'limit')"
          @update:page="updatePagination($event, 'page')"
        >
          <template #top>
            <v-toolbar flat>
              <v-toolbar-title>Users</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <!-- Dialog Form -->
              <v-dialog
                v-model="dialog"
                max-width="500px"
                @click:outside="close"
              >
                <template #activator="{ on, attrs }">
                  <v-btn color="primary" dark v-bind="attrs" v-on="on">
                    New Item
                  </v-btn>
                  <v-btn
                    color="primary"
                    dark
                    class="mr-2"
                    v-bind="attrs"
                    @click="downloadFile"
                  >
                    Download
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="text-h5">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="6" md="4">
                          <v-select
                            v-model="editedItem.title"
                            :items="['mr', 'ms', 'mrs', 'miss', 'dr']"
                            label="Title"
                          ></v-select>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.firstName"
                            label="First Name"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.lastName"
                            label="Last Name"
                          ></v-text-field>
                        </v-col>
                        <v-col v-if="!editedItem.id" cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.email"
                            label="Email"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close">
                      Cancel
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="save">
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>

              <!-- Dialog Delete -->
              <v-dialog
                v-model="dialogDelete"
                max-width="500px"
                @click:outside="close"
              >
                <v-card>
                  <v-card-title class="text-h5">
                    Are you sure you want to delete this item?
                  </v-card-title>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close">
                      Cancel
                    </v-btn>
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="deleteItemConfirm"
                    >
                      OK
                    </v-btn>
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>

          <!-- Table Row -->
          <template #[`item.picture`]="{ item }">
            <v-avatar>
              <img :src="item.picture" alt="John" />
            </v-avatar>
          </template>
          <template #[`item.action`]="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)">
              mdi-pencil
            </v-icon>
            <v-icon small color="error" @click="deleteItem(item)">
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import exportFromJSON from 'export-from-json'
import {
  deleteUse,
  getUserList,
  createUser,
  updateUser,
} from '~/services/api/user'
import { INITIAL_PAGINATION } from '~/utils/pagination'

const INITIAL_EDITED_ITEM = {
  id: null,
  title: null,
  firstName: null,
  lastName: null,
  picture: null,
}

export default {
  name: 'UserIndexPage',
  data() {
    return {
      users: {},
      dialog: false,
      dialogDelete: false,
      editedItem: INITIAL_EDITED_ITEM,
      investorsList: [
        {
          id: 0,
          name: 'Gautam',
          email: 'gautam@example.com',
          investment: 'Stocks',
        },
        {
          id: 1,
          name: 'Sam',
          email: 'sam@example.com',
          investment: 'Bonds',
        },
        {
          id: 2,
          name: 'Tim',
          email: 'tim@example.com',
          investment: 'Options',
        },
        {
          id: 3,
          name: 'Kim',
          email: 'kim@example.com',
          investment: 'Stocks',
        },
        {
          id: 4,
          name: 'John',
          email: 'john@example.com',
          investment: 'Options',
        },
        {
          id: 5,
          name: 'Lee',
          email: 'lee@example.com',
          investment: 'Stocks',
        },
        {
          id: 6,
          name: 'Charlotte',
          email: 'charlotte@example.com',
          investment: 'Options',
        },
        {
          id: 7,
          name: 'Amy',
          email: 'amy@example.com',
          investment: 'Stocks',
        },
        {
          id: 8,
          name: 'Mark',
          email: 'mark@example.com',
          investment: 'Bonds',
        },
        {
          id: 9,
          name: 'Rose',
          email: 'rose@example.com',
          investment: 'Stocks',
        },
      ],
    }
  },
  async fetch() {
    this.users = await getUserList({
      page: (+this.$route.query.page || INITIAL_PAGINATION.page) - 1,
      limit: +this.$route.query.limit || INITIAL_PAGINATION.limit,
    })
  },
  fetchOnServer: false,
  computed: {
    formTitle() {
      return this.editedItem.id ? 'Edit Item' : 'New Item'
    },
    tableProps() {
      return {
        headers: [
          {
            text: 'Picture',
            value: 'picture',
            sortable: false,
            align: 'center',
            width: 100,
          },
          { text: 'Title', value: 'title' },
          { text: 'First Name', value: 'firstName' },
          { text: 'Last Name', value: 'lastName' },
          { text: 'Action', value: 'action', sortable: false },
        ],
        items: this.users.data,
        loading: this.$fetchState.pending,
        page: +this.$route.query.page || INITIAL_PAGINATION.page,
        itemsPerPage: +this.$route.query.limit || INITIAL_PAGINATION.limit,
        serverItemsLength: this.users.total,
        footerProps: {
          itemsPerPageOptions: INITIAL_PAGINATION.itemsPerPageOptions,
        },
      }
    },
  },
  watch: {
    '$route.query': '$fetch',
  },
  methods: {
    editItem(item) {
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      deleteUse(this.editedItem.id)
        .then((res) => {
          this.$store.dispatch('alert/setAlert', {
            text: `Successfully delete user. ${res.id}`,
            type: 'success',
          })
          this.$fetch()
        })
        .catch((err) => {
          this.$store.dispatch('alert/setAlert', {
            text: `Failed to delete user. ${err}`,
            type: 'error',
          })
        })
        .finally(() => {
          this.close()
        })
    },

    close() {
      this.dialog = false
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, INITIAL_EDITED_ITEM)
      })
    },

    save() {
      if (this.editedItem.id) {
        updateUser(this.editedItem)
          .then((res) => {
            this.$store.dispatch('alert/setAlert', {
              text: `Successfully update user. ${res.id}`,
              type: 'success',
            })
            this.$fetch()
          })
          .catch((err) => {
            this.$store.dispatch('alert/setAlert', {
              text: `Failed to update user. ${err}`,
              type: 'error',
            })
          })
          .finally(() => {
            this.close()
          })
      } else {
        createUser(this.editedItem)
          .then((res) => {
            this.$store.dispatch('alert/setAlert', {
              text: `Successfully create user. ${res.id}`,
              type: 'success',
            })
            this.$fetch()
          })
          .catch((err) => {
            this.$store.dispatch('alert/setAlert', {
              text: `Failed to create user. ${err}`,
              type: 'error',
            })
          })
          .finally(() => {
            this.close()
          })
      }
    },

    updatePagination(event, name) {
      const query = {
        ...this.$route.query,
        [name]: event,
      }

      switch (name) {
        case 'limit':
          delete query.page
          break
      }

      this.$router
        .replace({
          query,
        })
        .then(() => {})
        .catch(() => {})
    },

    downloadFile() {
      const data = this.users.data
      const fileName = 'users'
      const exportType = exportFromJSON.types.csv

      if (data) exportFromJSON({ data, fileName, exportType })
    },
  },
}
</script>
