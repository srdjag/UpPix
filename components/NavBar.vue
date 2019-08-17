<template>
  <v-card color="grey lighten-4" flat tile>
    <v-toolbar dense>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <nuxt-link to="/">
        <v-toolbar-title>Host Your Images</v-toolbar-title>
      </nuxt-link>

      <v-spacer></v-spacer>

      <v-toolbar-items>
        <nuxt-link v-if="!isLoggedIn" to="/register">
          <v-btn style="height: 100%" text>Sign Up</v-btn>
        </nuxt-link>
        <nuxt-link v-if="!isLoggedIn" to="/login">
          <v-btn style="height: 100%" text>Login</v-btn>
        </nuxt-link>
         <nuxt-link v-if="isLoggedIn" to="/upload">
          <v-btn style="height: 100%" text>Upload Images</v-btn>
        </nuxt-link>
         <nuxt-link v-if="isLoggedIn" to="/my-images">
          <v-btn style="height: 100%" text>My Images</v-btn>
        </nuxt-link>
        <v-btn v-if="isLoggedIn" style="height: 100%" text @click="logOut">Logout</v-btn>
      </v-toolbar-items>

      <v-btn icon>
        <v-icon>search</v-icon>
      </v-btn>
    </v-toolbar>
  </v-card>
</template>

<script>
import firebase from "../plugins/firebase.js";

export default {
  name: "NavBar",
  data() {
    return {
      isLoggedIn: false
    };
  },
  methods: {
    logOut() {
      var _this = this;
      firebase
        .auth()
        .signOut()
        .then(
          function() {
            document.location.href = "/";
          },
          function(error) {}
        );
    }
  },
  created() {
    //Check if user is signed in
    var _this = this;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        _this.$store.commit("setCurrentUser", {
          id: user.uid,
          name: user.displayName,
          email: user.email,
          isLoggedIn: true
        });
        _this.isLoggedIn = _this.$store.state.currentUser.isLoggedIn;
      } else {
        // No user is signed in.
      }
    });
  }
};
</script>

<style>
</style>