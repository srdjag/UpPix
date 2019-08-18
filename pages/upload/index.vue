<template>
  <v-container>
    <div class="page-title">
      <span style="font-family: 'Indie Flower', cursive;">Upload Images</span>
    </div>
    <div class="upload-wrap">
      <span class="input" v-bind:style="uploading || suspended ? 'opacity: 0.6;' : 'opacity: 1;' ">
        <input
          :disabled="uploading || suspended"
          name="upload"
          type="file"
          multiple
          accept="image/*"
          @change="uploadImage($event)"
          id="file-input"
        />
      </span>

      <br />
      <v-switch
        dark
        v-model="enableOptimization"
        label="Image Optimization"
        color="success"
        :disabled="uploading || suspended"
        :value="enableOptimization"
      ></v-switch>

      <v-progress-linear
        class="mt-10"
        v-if="uploading && current !== total"
        color="light-green darken-2"
        height="30"
        :value="progress"
        striped
      ></v-progress-linear>

      <h3 v-if="failed">{{failed}} image(s) failed to upload.</h3>
      <br />
      <v-alert
        v-if="current == total && progress !== 0"
        dismissible
        type="success"
      >Images successfully uploaded!</v-alert>

      <v-alert v-if="quota >= limit && quota !== null" type="error">
        Image upload quota exceeded! Upgrade your account
        <b>here</b>.
      </v-alert>

      <v-alert v-if="storageUsed >= storageCap && storageUsed !== null" type="error">
        Image storage size exceeded! Upgrade your account
        <b>here</b>.
      </v-alert>

      <v-alert v-if="suspended" type="error">
        Your account is suspended! Contact administrator
        <b>here</b>.
      </v-alert>
    </div>
  </v-container>
</template>

<script>
import firebase from "../../plugins/firebase";

var short = require("short-uuid");

export default {
  head() {
    return {
      script: [
        {
          src:
            "https://cdn.jsdelivr.net/npm/browser-image-compression@1.0.5/dist/browser-image-compression.js"
        }
      ]
    };
  },
  data() {
    return {
      total: 0,
      current: 0,
      failed: 0,
      enableOptimization: true,
      uploading: false,
      progress: 0,
      quota: null,
      limit: null,
      storageCap: null,
      storageUsed: null,
      suspended: null
    };
  },
  watch: {
    current: function(val) {
      this.progress = (this.current * 100) / this.total;
      if (this.current == this.total) {
        this.uploading = false;
      }
    }
  },
  methods: {
    // Function that runs once the images for upload are chosen
    uploadImage(event) {
      if (this.suspended) {
        return;
      }
      this.$store.commit("removeImages");
      // Connecting to firebase
      var storage = firebase.storage();
      var storageRef = storage.ref("/images/");
      // Setting up variables
      this.total = 0;
      this.current = 0;
      var _this = this;
      var files = event.target.files;
      this.total = files.length;
      this.uploading = true;

      // Formates bytes to kb
      function formatBytes(a, b) {
        if (0 == a) return "0 Bytes";
        var c = 1024,
          d = b || 2,
          e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
          f = Math.floor(Math.log(a) / Math.log(c));
        return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f];
      }

      // Going through each image and uploading it
      Array.from(files).forEach(file => {
        var filesize = (file.size / 1024 / 1024).toFixed(4);

        // If image size is more than 10mb, it will be skipped and error shown
        if (filesize > 10) {
          this.failed++;
          this.total--;
          _this.$toast.show(
            `Image ${file.name} failed to upload due to file size.`,
            {
              duration: null,
              position: "top-right",
              theme: "bubble",
              type: "error"
            }
          );
          return;
        }

        // This part duplicated file[i] to another variable "fileUpdated"
        // This is needed so getDownloadURL() will give correct url
        // Without this, image URL will just open in new tab, without download initiated
        var fileUpdated = new File([file], file.name, {
          lastModified: file.lastModified,
          lastModifiedDate: file.lastModifiedDate,
          webkitRelativePath: file.webkitRelativePath
        });

        // Setting up options for image compression
        var options = {
          maxSizeMB: 2, //1mb max file size
          useWebWorker: true
        };

        // Compressing the image
        imageCompression(file, options)
          .then(function(compressedFile) {
            // Converting BLOB to FILE
            if (_this.enableOptimization == true) {
              fileUpdated = new File([compressedFile], compressedFile.name, {
                lastModified: file.lastModified,
                lastModifiedDate: file.lastModifiedDate,
                webkitRelativePath: file.webkitRelativePath
              });
            }

            // Setting up Firebase related variables
            var dateNow = Date.now();
            var day = new Date().getDate();
            var month = new Date().getMonth();
            var year = new Date().getFullYear();
            var currentImgID = short.generate();
            var email = _this.$store.state.currentUser.email;
            var userID = _this.$store.state.currentUser.id;
            var pathReference = storage.ref(
              "/images/" + "/" + userID + "/" + dateNow + "-" + file.name
            );

            if (
              _this.quota >= _this.limit ||
              _this.storageUsed >= _this.storageCap
            ) {
              return;
            }

            _this.quota++;
            _this.storageUsed = _this.storageUsed + fileUpdated.size;
            _this.updateQuotaAndStorage(userID);

            pathReference.put(fileUpdated).then(function(snapshot) {
              _this.current++;

              // Then creating a reference to that image in the database

              storageRef
                .child(userID)
                .child(dateNow + "-" + file.name)
                .getDownloadURL()
                .then(function(url) {
                  firebase
                    .database()
                    .ref("images/" + currentImgID)
                    .set({
                      URL: url,
                      fileName: file.name,
                      dateOfUpload: dateNow,
                      dayOfUpload: day,
                      monthOfUpload: month,
                      yearOfUpload: year,
                      fullFileName: dateNow + "-" + file.name,
                      ID: currentImgID,
                      fileSize: fileUpdated.size,
                      ownerID: userID,
                      ownerEmail: email,
                      fileSizeInKB: formatBytes(fileUpdated.size)
                    });
                });
            });

            // Using path reference and uploading compressed file there
          })
          .catch(function(error) {});
      });
    },
    updateQuotaAndStorage(userID) {
      var ref = firebase.database().ref("/users");
      var _this = this;

      ref.child(userID).once("value", userSnapshot => {
        firebase
          .database()
          .ref("/users/" + userID)
          .update({ quota: _this.quota, storageUsed: _this.storageUsed });
      });
    }
  },
  beforeCreate() {
    var userID = this.$store.state.currentUser.id;
    var ref = firebase.database().ref("/users");
    var _this = this;

    //Get user's quota, limit, storage info
    ref.child(userID).once("value", userSnapshot => {
      _this.quota = userSnapshot.val().quota;
      _this.limit = userSnapshot.val().limit;
      _this.storageUsed = userSnapshot.val().storageUsed;
      _this.storageCap = userSnapshot.val().storageCap;
      _this.suspended = userSnapshot.val().suspended;

      if (_this.quota >= _this.limit || _this.storageUsed >= _this.storageCap) {
        _this.uploading = true;
      }
    });
  }
};
</script>

<style >
.upload-wrap {
  width: 1000px;
  height: auto;
  background-color: rgba(0, 0, 0, 0.12);
  margin: 0 auto;
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
  border-radius: 0px 0px 8px 8px;
  margin-top: 20px;
  padding: 40px 40px 20px 40px;
  text-align: center;
}
input[name="upload"] {
  width: 300px;
  height: 184px;
  opacity: 0;
  cursor: pointer;
}

span.input {
  position: relative;
  width: 300px;
  height: 184px;
  display: inline-block;
  background-image: linear-gradient(
      292deg,
      rgba(150, 150, 150, 0.03) 0%,
      rgba(150, 150, 150, 0.03) 20%,
      rgba(151, 151, 151, 0.03) 20%,
      rgba(151, 151, 151, 0.03) 40%,
      rgba(215, 215, 215, 0.03) 40%,
      rgba(215, 215, 215, 0.03) 60%,
      rgba(254, 254, 254, 0.03) 60%,
      rgba(254, 254, 254, 0.03) 80%,
      rgba(112, 112, 112, 0.03) 80%,
      rgba(112, 112, 112, 0.03) 100%
    ),
    linear-gradient(
      62deg,
      rgba(34, 34, 34, 0.03) 0%,
      rgba(34, 34, 34, 0.03) 20%,
      rgba(171, 171, 171, 0.03) 20%,
      rgba(171, 171, 171, 0.03) 40%,
      rgba(206, 206, 206, 0.03) 40%,
      rgba(206, 206, 206, 0.03) 60%,
      rgba(210, 210, 210, 0.03) 60%,
      rgba(210, 210, 210, 0.03) 80%,
      rgba(69, 69, 69, 0.03) 80%,
      rgba(69, 69, 69, 0.03) 100%
    ),
    linear-gradient(
      314deg,
      rgba(235, 235, 235, 0.03) 0%,
      rgba(235, 235, 235, 0.03) 20%,
      rgba(254, 254, 254, 0.03) 20%,
      rgba(254, 254, 254, 0.03) 40%,
      rgba(178, 178, 178, 0.03) 40%,
      rgba(178, 178, 178, 0.03) 60%,
      rgba(211, 211, 211, 0.03) 60%,
      rgba(211, 211, 211, 0.03) 80%,
      rgba(73, 73, 73, 0.03) 80%,
      rgba(73, 73, 73, 0.03) 100%
    ),
    linear-gradient(
      32deg,
      rgba(182, 182, 182, 0.01) 0%,
      rgba(182, 182, 182, 0.01) 12.5%,
      rgba(208, 208, 208, 0.01) 12.5%,
      rgba(208, 208, 208, 0.01) 25%,
      rgba(178, 178, 178, 0.01) 25%,
      rgba(178, 178, 178, 0.01) 37.5%,
      rgba(143, 143, 143, 0.01) 37.5%,
      rgba(143, 143, 143, 0.01) 50%,
      rgba(211, 211, 211, 0.01) 50%,
      rgba(211, 211, 211, 0.01) 62.5%,
      rgba(92, 92, 92, 0.01) 62.5%,
      rgba(92, 92, 92, 0.01) 75%,
      rgba(56, 56, 56, 0.01) 75%,
      rgba(56, 56, 56, 0.01) 87.5%,
      rgba(253, 253, 253, 0.01) 87.5%,
      rgba(253, 253, 253, 0.01) 100%
    ),
    linear-gradient(
      247deg,
      rgba(103, 103, 103, 0.02) 0%,
      rgba(103, 103, 103, 0.02) 12.5%,
      rgba(240, 240, 240, 0.02) 12.5%,
      rgba(240, 240, 240, 0.02) 25%,
      rgba(18, 18, 18, 0.02) 25%,
      rgba(18, 18, 18, 0.02) 37.5%,
      rgba(38, 38, 38, 0.02) 37.5%,
      rgba(38, 38, 38, 0.02) 50%,
      rgba(246, 246, 246, 0.02) 50%,
      rgba(246, 246, 246, 0.02) 62.5%,
      rgba(9, 9, 9, 0.02) 62.5%,
      rgba(9, 9, 9, 0.02) 75%,
      rgba(167, 167, 167, 0.02) 75%,
      rgba(167, 167, 167, 0.02) 87.5%,
      rgba(86, 86, 86, 0.02) 87.5%,
      rgba(86, 86, 86, 0.02) 100%
    ),
    linear-gradient(90deg, hsl(194, 0%, 10%), hsl(194, 0%, 10%));
  cursor: pointer;
  border-radius: 20px 20px 0px 0px;
  margin-left: 5px;
}
span.input::before {
  content: "Choose or drop files \a 10mb max each";
  white-space: pre;
  width: 240px;
  height: 124px;
  border: 7px solid rgba(255, 255, 255, 0.5);
  margin: 30px;
  border-radius: 20px;
  border-style: dashed;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.75);
  font-size: 1rem;
}

.v-input.v-input--switch {
  width: 300px;
  margin: 6px auto;
  background-image: linear-gradient(
      292deg,
      rgba(150, 150, 150, 0.03) 0%,
      rgba(150, 150, 150, 0.03) 20%,
      rgba(151, 151, 151, 0.03) 20%,
      rgba(151, 151, 151, 0.03) 40%,
      rgba(215, 215, 215, 0.03) 40%,
      rgba(215, 215, 215, 0.03) 60%,
      rgba(254, 254, 254, 0.03) 60%,
      rgba(254, 254, 254, 0.03) 80%,
      rgba(112, 112, 112, 0.03) 80%,
      rgba(112, 112, 112, 0.03) 100%
    ),
    linear-gradient(
      62deg,
      rgba(34, 34, 34, 0.03) 0%,
      rgba(34, 34, 34, 0.03) 20%,
      rgba(171, 171, 171, 0.03) 20%,
      rgba(171, 171, 171, 0.03) 40%,
      rgba(206, 206, 206, 0.03) 40%,
      rgba(206, 206, 206, 0.03) 60%,
      rgba(210, 210, 210, 0.03) 60%,
      rgba(210, 210, 210, 0.03) 80%,
      rgba(69, 69, 69, 0.03) 80%,
      rgba(69, 69, 69, 0.03) 100%
    ),
    linear-gradient(
      314deg,
      rgba(235, 235, 235, 0.03) 0%,
      rgba(235, 235, 235, 0.03) 20%,
      rgba(254, 254, 254, 0.03) 20%,
      rgba(254, 254, 254, 0.03) 40%,
      rgba(178, 178, 178, 0.03) 40%,
      rgba(178, 178, 178, 0.03) 60%,
      rgba(211, 211, 211, 0.03) 60%,
      rgba(211, 211, 211, 0.03) 80%,
      rgba(73, 73, 73, 0.03) 80%,
      rgba(73, 73, 73, 0.03) 100%
    ),
    linear-gradient(
      32deg,
      rgba(182, 182, 182, 0.01) 0%,
      rgba(182, 182, 182, 0.01) 12.5%,
      rgba(208, 208, 208, 0.01) 12.5%,
      rgba(208, 208, 208, 0.01) 25%,
      rgba(178, 178, 178, 0.01) 25%,
      rgba(178, 178, 178, 0.01) 37.5%,
      rgba(143, 143, 143, 0.01) 37.5%,
      rgba(143, 143, 143, 0.01) 50%,
      rgba(211, 211, 211, 0.01) 50%,
      rgba(211, 211, 211, 0.01) 62.5%,
      rgba(92, 92, 92, 0.01) 62.5%,
      rgba(92, 92, 92, 0.01) 75%,
      rgba(56, 56, 56, 0.01) 75%,
      rgba(56, 56, 56, 0.01) 87.5%,
      rgba(253, 253, 253, 0.01) 87.5%,
      rgba(253, 253, 253, 0.01) 100%
    ),
    linear-gradient(
      247deg,
      rgba(103, 103, 103, 0.02) 0%,
      rgba(103, 103, 103, 0.02) 12.5%,
      rgba(240, 240, 240, 0.02) 12.5%,
      rgba(240, 240, 240, 0.02) 25%,
      rgba(18, 18, 18, 0.02) 25%,
      rgba(18, 18, 18, 0.02) 37.5%,
      rgba(38, 38, 38, 0.02) 37.5%,
      rgba(38, 38, 38, 0.02) 50%,
      rgba(246, 246, 246, 0.02) 50%,
      rgba(246, 246, 246, 0.02) 62.5%,
      rgba(9, 9, 9, 0.02) 62.5%,
      rgba(9, 9, 9, 0.02) 75%,
      rgba(167, 167, 167, 0.02) 75%,
      rgba(167, 167, 167, 0.02) 87.5%,
      rgba(86, 86, 86, 0.02) 87.5%,
      rgba(86, 86, 86, 0.02) 100%
    ),
    linear-gradient(90deg, hsl(194, 0%, 10%), hsl(194, 0%, 10%));
  border-radius: 0px 0px 20px 20px;
  display: flex;
  justify-content: center;
  padding-top: 10px;
}
.v-input__slot {
  margin-bottom: 0 !important;
}
</style>