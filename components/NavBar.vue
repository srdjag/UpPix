<template>
  <v-card color="grey lighten-4">
    <v-toolbar color="#37A1CA" dense v-if="isLoggedIn !== null" dark>
      <i class="material-icons mr-4">file_upload</i>

      <nuxt-link to="/">
        <v-toolbar-title>UpPix</v-toolbar-title>
      </nuxt-link>

      <v-spacer></v-spacer>
      <!-- LoggedOut menu -->
      <v-toolbar-items v-if="!isLoggedIn">
        <nuxt-link to="/register">
          <v-btn style="height: 100%" text>Sign Up</v-btn>
        </nuxt-link>
        <nuxt-link to="/login">
          <v-btn style="height: 100%" text>Login</v-btn>
        </nuxt-link>
      </v-toolbar-items>
      <!-- Admin menu -->
      <v-toolbar-items v-if="role == 'Admin'">
        <nuxt-link to="/admin">
          <v-btn style="height: 100%" text>[Admin Panel]</v-btn>
        </nuxt-link>
      </v-toolbar-items>
      <!-- LoggedIn menu -->
      <v-toolbar-items v-if="isLoggedIn">
        <nuxt-link to="/upload">
          <v-btn style="height: 100%" text>Upload Images</v-btn>
        </nuxt-link>
        <nuxt-link to="/my-images">
          <v-btn style="height: 100%" text>My Images</v-btn>
        </nuxt-link>
      </v-toolbar-items>

      <i v-if="isLoggedIn" @click="logOut" class="material-icons pl-4">exit_to_app</i>
    </v-toolbar>
  </v-card>
</template>

<script>
import firebase from "../plugins/firebase.js";
import userController from "../plugins/userController.js";

export default {
  name: "NavBar",
  props: ["isLoggedIn", "role"],
  methods: {
    //LogOut function
    logOut() {
      userController.logOut();
    }
  }
};
</script>

<style>
.v-application--wrap {
  background-attachment: fixed;
  background-image: linear-gradient(
      52deg,
      rgba(163, 163, 163, 0.09) 0%,
      rgba(163, 163, 163, 0.09) 33.3%,
      rgba(100, 100, 100, 0.09) 33.3%,
      rgba(100, 100, 100, 0.09) 66.6%,
      rgba(162, 162, 162, 0.09) 66.6%,
      rgba(162, 162, 162, 0.09) 99%
    ),
    linear-gradient(
      258deg,
      rgba(193, 193, 193, 0.06) 0%,
      rgba(193, 193, 193, 0.06) 33.3%,
      rgba(169, 169, 169, 0.06) 33.3%,
      rgba(169, 169, 169, 0.06) 66.6%,
      rgba(92, 92, 92, 0.06) 66.6%,
      rgba(92, 92, 92, 0.06) 99%
    ),
    linear-gradient(
      129deg,
      rgba(45, 45, 45, 0.03) 0%,
      rgba(45, 45, 45, 0.03) 33.3%,
      rgba(223, 223, 223, 0.03) 33.3%,
      rgba(223, 223, 223, 0.03) 66.6%,
      rgba(173, 173, 173, 0.03) 66.6%,
      rgba(173, 173, 173, 0.03) 99%
    ),
    linear-gradient(
      280deg,
      rgba(226, 226, 226, 0.06) 0%,
      rgba(226, 226, 226, 0.06) 33.3%,
      rgba(81, 81, 81, 0.06) 33.3%,
      rgba(81, 81, 81, 0.06) 66.6%,
      rgba(186, 186, 186, 0.06) 66.6%,
      rgba(186, 186, 186, 0.06) 99%
    ),
    linear-gradient(
      85deg,
      rgba(225, 225, 225, 0.04) 0%,
      rgba(225, 225, 225, 0.04) 33.3%,
      rgba(95, 95, 95, 0.04) 33.3%,
      rgba(95, 95, 95, 0.04) 66.6%,
      rgba(39, 39, 39, 0.04) 66.6%,
      rgba(39, 39, 39, 0.04) 99%
    ),
    linear-gradient(
      128deg,
      rgba(184, 184, 184, 0.06) 0%,
      rgba(184, 184, 184, 0.06) 33.3%,
      rgba(0, 0, 0, 0.06) 33.3%,
      rgba(0, 0, 0, 0.06) 66.6%,
      rgba(140, 140, 140, 0.06) 66.6%,
      rgba(140, 140, 140, 0.06) 99.89999999999999%
    ),
    linear-gradient(
      323deg,
      rgba(40, 40, 40, 0.07) 0%,
      rgba(40, 40, 40, 0.07) 33.3%,
      rgba(214, 214, 214, 0.07) 33.3%,
      rgba(214, 214, 214, 0.07) 66.6%,
      rgba(190, 190, 190, 0.07) 66.6%,
      rgba(190, 190, 190, 0.07) 99.89999999999999%
    ),
    linear-gradient(
      61deg,
      rgba(230, 230, 230, 0) 0%,
      rgba(230, 230, 230, 0) 33.3%,
      rgba(241, 241, 241, 0) 33.3%,
      rgba(241, 241, 241, 0) 66.6%,
      rgba(55, 55, 55, 0) 66.6%,
      rgba(55, 55, 55, 0) 99%
    ),
    linear-gradient(0deg, #2625e3, #0bbaef);
}
i {
  cursor: pointer;
}
</style>