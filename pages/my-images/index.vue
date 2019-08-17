<template>
  <v-container>
    <h1>My Images</h1>

    <v-row>
      <v-col cols="12" sm="6" offset-sm="3">
        <v-card>
          <v-container fluid>
            <v-row>
              <h1 v-if="loading">Loading...</h1>
              <v-col v-for="image in images" :key="image" class="d-flex child-flex" cols="4">
                <v-card flat tile class="d-flex">
                  <a :href="image" download>
                    <i class="material-icons">file_download</i>
                  </a>
                  <v-img :src="image" :lazy-src="image" aspect-ratio="1" class="grey lighten-2"></v-img>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import firebase from "../../plugins/firebase";
//import VueQr from "vue-qr";

export default {
  data() {
    return {
      images: [],
      loading: true
    };
  },
  methods: {},
  mounted() {
    var database = firebase.database();
    var _this = this;

    firebase
      .database()
      .ref("/images/")
      .orderByChild("owner")
      .equalTo(_this.$store.state.currentUser.email)
      .once("value")
      .then(function(snapshot) {
        const imgArray = Object.keys(snapshot.val()).map(
          i => snapshot.val()[i]
        );
        imgArray.forEach(element => {
          _this.images.push(element.base64);
        });
        _this.loading = false;
      });
  }
};
</script>

<style>
</style>