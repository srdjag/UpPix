<template>
  <v-container>
    <h1>Upload Image</h1>
    <br />
    <label for="upload">5mb max per image</label>
    <input
      name="upload"
      type="file"
      multiple
      accept="image/*"
      @change="convertImage($event)"
      id="file-input"
    />
    <br />
    <br />
    <h2>Uploading {{current}}/{{total}}</h2>
    <h3 v-if="failed">{{failed}} image(s) failed to upload.</h3>
  </v-container>
</template>

<script>
import firebase from "../../plugins/firebase";
const uuidv4 = require("uuid/v4");

export default {
  data() {
    return {
      total: 0,
      current: 0,
      failed: 0
    };
  },
  methods: {
    async convertImage(event) {
      this.total = 0;
      this.current = 0;
      var _this = this;
      var files = event.target.files;
      this.total = files.length;

      console.log(files);
      Array.from(files).forEach(file => {
        var filesize = (file.size / 1024 / 1024).toFixed(4);
        if (filesize > 5) {
          this.failed++;
          return;
        }
        console.log(filesize);
        var reader = new FileReader();

        var converting = new Promise(function(resolve, reject) {
          reader.readAsDataURL(file);
          reader.onload = function() {
            var base64 = reader.result;
            _this.current++;
            resolve(base64);
          };
        });

        converting.then(function(base64) {
          firebase
            .database()
            .ref("images/" + uuidv4())
            .set({
              base64: base64,
              owner: _this.$store.state.currentUser.email
            });
        });
      });
    }
  },
  created() {}
};
</script>

<style>
</style>