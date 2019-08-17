<template>
  <v-container bg fill-height grid-list-md text-xs-center>
    <v-layout row wrap align-center>
      <v-flex>
        <v-card color="white" width="500px" class="mx-auto">
          <v-list-item style="background-color: #BF360C" color="white">
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
      var _this = this;
      var provider = new firebase.auth.GoogleAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(function(result) {
          var token = result.credential.accessToken;
          var user = result.user;
        })
        .catch(function(error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          var email = error.email;
          var credential = error.credential;
        });
    },
    signInWithEmail() {
      var _this = this;
      if (this.password === this.passwordRep) {
        firebase
          .auth()
          .createUserWithEmailAndPassword(this.email, this.password)
          .then(user => {
            document.location.href = "/";
          })
          .catch(function(error) {
            _this.$toast.show(error.message, {
              duration: 3000,
              singleton: true,
              position: "top-center"
            });
          });
      } else {
        this.$toast.show("Password do not match", {
          duration: 3000,
          singleton: true,
          position: "top-center"
        });
      }
    }
  }
};
</script>

<style>
</style>