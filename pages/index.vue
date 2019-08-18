<template>
  <v-container bg fill-height grid-list-md>
    <v-layout row wrap align-center>
      <v-flex v-if="!$store.state.currentUser.isLoggedIn">
        <v-card class="mx-auto" max-width="40%">
          <v-img
            class="white--text"
            height="100%"
            src="https://images.unsplash.com/flagged/photo-1551592398-c320012bc1c6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80"
          >
            <v-card-title class="align-end fill-height"></v-card-title>
          </v-img>
          <v-card-text class="pb-0">
            <span class="text--primary text-center">
              <p
                class="text-center mb-0 display-1"
              >Welcome to UpPix! Join us and upload your photos for free!</p>
            </span>
          </v-card-text>

          <v-card-actions class="justify-center">
            <nuxt-link to="/register">
              <v-btn color="light-blue darken-3" large class="ma-2 white--text">
                UPLOAD NOW
                <v-icon right dark>cloud_upload</v-icon>
              </v-btn>
            </nuxt-link>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex v-else>
        <v-card class="mx-auto" max-width="40%">
          <v-img
            class="white--text"
            height="100%"
            src="https://images.unsplash.com/flagged/photo-1551592398-c320012bc1c6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80"
          >
            <v-card-title class="align-end fill-height"></v-card-title>
          </v-img>
          <v-card-text class="pb-0">
            <span class="text--primary text-center">
              <p class="text-center mb-0 display-1">Welcome back to UpPix!</p>
            </span>
          </v-card-text>

          <v-card-actions class="justify-center">
            <nuxt-link to="/upload">
              <v-btn color="light-blue darken-3" large class="ma-2 white--text">
                UPLOAD NOW
                <v-icon right dark>cloud_upload</v-icon>
              </v-btn>
            </nuxt-link>
            <nuxt-link to="/my-images">
              <v-btn color="indigo darken-3" outlined large class="ma-2 white--text">
                MY IMAGES
                <v-icon right dark>image</v-icon>
              </v-btn>
            </nuxt-link>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import firebase from "../plugins/firebase";
export default {
  data() {
    return {};
  },
  methods: {},
  components: {}
};
</script>
