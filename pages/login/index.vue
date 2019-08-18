<template>
  <v-container bg fill-height grid-list-md text-xs-center>
    <v-layout row wrap align-center>
      <v-flex>
        <v-card color="white" width="500px" class="mx-auto">
          <v-list-item style="background-color: #512DA8" color="white">
            <i class="material-icons white--text">person</i>
            <v-list-item-content>
              <v-list-item-title class="headline white--text pl-2">Login</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <form class="pa-4" @submit.prevent="loginWithEmail">
            <v-text-field v-model="email" label="E-mail" required></v-text-field>
            <v-text-field v-model="password" label="Password" :type="'password'" required></v-text-field>
            <div class="text-center">
              <input
                class="v-btn v-btn--contained theme--light v-size--default normal mr-12"
                type="submit"
                value="Login"
              />
              <v-btn color="primary" @click="loginWithGoogle">Login with Google</v-btn>
            </div>
          </form>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import firebase from "../../plugins/firebase";
import userController from "../../plugins/userController.js";

export default {
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    loginWithGoogle() {
      userController.loginWithGoogle();
    },
    loginWithEmail() {
      userController.loginWithEmail(this.email, this.password, this);
    }
  },
  beforeCreate() {
    firebase.auth().onAuthStateChanged(async function(user) {
      if (user) {
        document.location.href = "/";
      } else {
      }
    });
  }
};
</script>

<style>
</style>