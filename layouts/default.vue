<template>
  <v-app fullscreen full-width>
    <LoadingScreen v-if="loading" />
    <NavBar :isLoggedIn="isLoggedIn" :role="role" />
    <nuxt />
  </v-app>
</template>

<script>
import NavBar from "../components/NavBar";
import LoadingScreen from "../components/LoadingScreen";

import firebase from "../plugins/firebase.js";

export default {
  components: {
    NavBar,
    LoadingScreen
  },
  data() {
    return {
      isLoggedIn: null,
      loading: true,
      role: ""
    };
  },
  methods: {
    // Getting user role
    async getRole(user) {
      try {
        const role = await firebase
          .database()
          .ref("users/" + user.uid)
          .once("value");
        const userRole = await role.val();
        return userRole.role;
      } catch (error) {
        // User is new and is being written to the databaes
        firebase
          .database()
          .ref("users/" + user.uid)
          .set({
            email: user.email,
            limit: 50,
            quota: 0,
            storageUsed: 0,
            storageCap: 52428800,
            role: "NewUser"
          })
          .then(e => {
            return "NewUser";
          });
      }
    }
  },
  beforeCreate() {
    //Check if user is signed in
    var _this = this;

    firebase.auth().onAuthStateChanged(async function(user) {
      if (user) {
        _this.getRole(user).then(data => {
          _this.$store.commit("setCurrentUser", {
            id: user.uid,
            name: user.displayName,
            email: user.email,
            emailVerified: user.emailVerified,
            role: data,
            isLoggedIn: true,
            images: []
          });
          _this.role = data;
          _this.isLoggedIn = true;
          setTimeout(() => {
            _this.loading = false;
          }, 500);
        });
      } else {
        _this.isLoggedIn = false;
        setTimeout(() => {
          _this.loading = false;
        }, 500);
      }
    });
  }
};
</script>

<style>
</style>
