<template>
  <v-container bg fill-height grid-list-md text-xs-center>
    <v-layout row wrap align-center>
      <v-flex>
        <v-card color="white" width="500px" class="mx-auto">
          <v-list-item style="background-color: #3642b4" color="white">
            <i class="material-icons white--text">person</i>
            <v-list-item-content>
              <v-list-item-title class="headline white--text pl-2">Register</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <form class="pa-4" @submit.prevent="signInWithEmail">
            <v-text-field v-model="email" label="E-mail" required></v-text-field>
            <v-text-field v-model="password" label="Password" :type="'password'" required></v-text-field>
            <v-text-field v-model="passwordRep" label="Repeat Password" :type="'password'" required></v-text-field>
            <div class="text-center">
              <input
                class="v-btn v-btn--contained theme--light v-size--default normal mr-12"
                type="submit"
                value="Register"
              />
              <v-btn color="primary" @click="signInWithGoogle">SignIn with Google</v-btn>
            </div>
          </form>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import firebase from "../../plugins/firebase.js";
import userController from "../../plugins/userController.js";
import { mapMutations, mapGetters } from "vuex";

export default {
  data() {
    return {
      email: "",
      password: "",
      passwordRep: ""
    };
  },
  methods: {
    signInWithGoogle() {
      userController.signInWithGoogle();
    },
    signInWithEmail() {
      var _this = this;
      if (this.password === this.passwordRep) {
        userController.signInWithEmail(_this.email, _this.password, this);
      } else {
        this.$toast.show("Passwords do not match", {
          duration: 3000,
          singleton: true,
          position: "top-center"
        });
      }
    }
  },
  beforeCreate() {
    var _this = this;

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