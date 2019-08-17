<template>
  <v-container>
    <h1>Home Page</h1>
    <h2>Hello {{this.$store.state.currentUser.email}}</h2>
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
