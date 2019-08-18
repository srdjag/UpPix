<template>
  <v-container fill-height>
    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="headline">Delete all images?</v-card-title>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="green darken-1" text @click="removeAllImages">Yes</v-btn>

          <v-btn color="red darken-1" text @click="dialog = false">No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div class="page-title">
      <i
        @click="infoModal"
        style="padding: 33px 0px 0px 40px; float: left"
        class="material-icons"
      >info_outline</i>
      <span style="font-family: 'Indie Flower', cursive; margin-left: -70px;">My Images</span>
      <v-select v-if="!noImages" @change="changeSort" dark :items="items" label="Sory by"></v-select>
    </div>
    <div
      class="image-grid"
      v-bind:style=" loading || noImages ? 'justify-content: center;' : 'justify-content: flex-start;' "
    >
      <div v-if="loading && !noImages">
        <div class="lds-grid">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <div v-if="noImages " class="mb-2" style="color: white; text-align: center;">
        <div class="headline">
          No Images.
          <br />Upload some!
        </div>
      </div>
      <transition-group name="flip-list" tag="ul">
        <div v-for="image in images" :key="image.ID" class="image-single">
          <img class="image-single-src" v-bind:src="image.URL" />
          <div class="image-single-overlay">
            <div class="overlay-info">
              <p>
                <b>Image size:</b>
                {{image.fileSizeInKB}}
              </p>
              <p>
                <b>Image name:</b>
                {{image.fileName.substring(image.fileName.length-22,image.fileName.length)}}
              </p>
              <p>
                <b>Date of upload:</b>
                {{image.dayOfUpload}}.{{image.monthOfUpload}}.{{image.yearOfUpload}}
              </p>
              <p></p>
            </div>
            <div
              style="display: flex; flex-direction: row; justify-content: space-around; width: 100%; padding-bottom: 9px;"
            >
              <a :href="image.URL" target="_blank">
                <v-btn fab small color="normal">
                  <i class="material-icons">cloud_download</i>
                </v-btn>
              </a>
              <a v-bind:href="/i/+image.fullFileName" target="_blank">
                <v-btn fab small color="primary">
                  <i class="material-icons">open_in_new</i>
                </v-btn>
              </a>
              <v-btn
                fab
                @click="removeImage(image.URL, image.ID, image.fileName, image.fileSize)"
                small
                color="error"
              >
                <i class="material-icons">delete</i>
              </v-btn>
            </div>
          </div>
        </div>
      </transition-group>

      <div class="my-2 ma-auto" v-if="!loading && !noImages">
        <v-btn small color="error" @click.stop="dialog = true">
          Delete all images
          <i class="material-icons">delete_forever</i>
        </v-btn>
      </div>
    </div>

    <v-dialog v-model="infoModalWindow" max-width="290">
      <v-card>
        <v-card-title class="headline">Info</v-card-title>

        <v-card-text>
          Total space:
          <b>
            <span v-html="formatBytes(storageCap)"></span>
          </b>
          <br />Total used space:
          <b>
            <span v-html="formatBytes(storageUsed)"></span>
          </b>
          <br />Number of images:
          <b>{{quota}}</b>
          <br />Images number limit:
          <b>{{limit}}</b>
          <br />
        </v-card-text>

        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="green darken-1" text @click="infoModalWindow = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import firebase from "../../plugins/firebase";

export default {
  head: {
    script: [{ src: "/browser-image-compression.js" }]
  },
  data() {
    return {
      images: [],
      dialog: false,
      infoModalWindow: false,
      loading: true,
      noImages: false,
      items: ["Size ▲", "Size ▼", "Name ▲", "Name ▼", "Date ▲", "Date ▼"],
      limit: "",
      quota: "",
      storageUsed: null,
      storageCap: null
    };
  },
  methods: {
    formatBytes(a, b) {
      if (0 == a) return "0 Bytes";
      var c = 1024,
        d = b || 2,
        e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
        f = Math.floor(Math.log(a) / Math.log(c));
      return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f];
    },
    infoModal() {
      this.infoModalWindow = true;
    },
    changeSort(selectObj) {
      switch (selectObj) {
        case "Size ▲":
          function compareSize1(a, b) {
            if (a.fileSize < b.fileSize) {
              return -1;
            }
            if (a.fileSize > b.fileSize) {
              return 1;
            }
            return 0;
          }
          this.images.sort(compareSize1);
          break;
        case "Size ▼":
          function compareSize2(a, b) {
            if (a.fileSize < b.fileSize) {
              return 1;
            }
            if (a.fileSize > b.fileSize) {
              return -1;
            }
            return 0;
          }
          this.images.sort(compareSize2);
          break;
        case "Name ▲":
          function compareName1(a, b) {
            if (a.fileName < b.fileName) {
              return -1;
            }
            if (a.fileName > b.fileName) {
              return 1;
            }
            return 0;
          }
          this.images.sort(compareName1);
          break;
        case "Name ▼":
          function compareName2(a, b) {
            if (a.fileName < b.fileName) {
              return 1;
            }
            if (a.fileName > b.fileName) {
              return -1;
            }
            return 0;
          }
          this.images.sort(compareName2);
          break;
        case "Date ▲":
          function compareDate1(a, b) {
            if (a.dateOfUpload < b.dateOfUpload) {
              return -1;
            }
            if (a.dateOfUpload > b.dateOfUpload) {
              return 1;
            }
            return 0;
          }
          this.images.sort(compareDate1);
          break;
        case "Date ▼":
          function compareDate2(a, b) {
            if (a.dateOfUpload < b.dateOfUpload) {
              return 1;
            }
            if (a.dateOfUpload > b.dateOfUpload) {
              return -1;
            }
            return 0;
          }
          this.images.sort(compareDate2);
          break;

        default:
      }
    },
    removeAllImages() {
      this.images.forEach(img => {
        var storage = firebase.storage();
        var db = firebase.firestore();
        var pathReference = storage.ref("/images/" + img.URL);
        var delURL = storage.refFromURL(img.URL);
        var _this = this;

        // Delete the file
        delURL
          .delete()
          .then(function() {})
          .catch(function(error) {});

        // Delete the reference
        firebase
          .database()
          .ref("images/" + img.ID)
          .remove();
      });
      this.resetQuota(this.$store.state.currentUser.id);

      //Delete from UI and from Store
      this.$store.commit("removeImages");
      this.images = [];
      this.noImages = true;
      this.dialog = false;
    },
    removeImage(URL, ID, name, size) {
      var storage = firebase.storage();
      var db = firebase.firestore();
      var pathReference = storage.ref("/images/" + ID);
      var delURL = storage.refFromURL(URL);
      var _this = this;
      var ref = firebase.database().ref("/users");
      var userID = this.$store.state.currentUser.id;
      this.quota = this.quota - 1;
      this.storageUsed = this.storageUsed - size;

      var prompt = confirm("Delete the photo " + name + "?");
      if (prompt == true) {
      } else {
        return;
      }

      // Delete the file
      delURL
        .delete()
        .then(function() {})
        .catch(function(error) {});

      //Delete reference
      firebase
        .database()
        .ref("images/" + ID)
        .remove();

      //Delete from UI and update Store
      this.images.forEach((imgObj, index) => {
        if (imgObj.ID == ID) {
          this.images.splice(index, 1);
        }
      });
      this.$store.commit("removeImage", ID);

      //Reduce quota and used storage

      ref.child(userID).once("value", userSnapshot => {
        firebase
          .database()
          .ref("/users/" + userID)
          .update({ quota: this.quota, storageUsed: this.storageUsed });
      });
    },
    resetQuota(userID) {
      var ref = firebase.database().ref("/users");

      ref.child(userID).once("value", userSnapshot => {
        firebase
          .database()
          .ref("/users/" + userID)
          .update({ quota: 0, storageUsed: 0 });
      });
    }
  },
  watch: {
    images: function(val) {
      if (val.length == 0 && this.loading == false) {
        this.dialog = false;
        this.noImages = true;
      }
    }
  },
  created() {
    var userID = this.$store.state.currentUser.id;
    var ref = firebase.database().ref("/users");
    this.images = [];
    var _this = this;
    var userImages = this.$store.getters.getImages;

    // If Store has no images, get list from database
    if (userImages.length == 0) {
      firebase
        .database()
        .ref("images")
        .orderByChild("ownerID")
        .equalTo(userID)
        .once("value")
        .then(function(snapshot) {
          if (snapshot.exists()) {
            _this.noImages = false;
            const imgArray = Object.keys(snapshot.val()).map(
              i => snapshot.val()[i]
            );
            setTimeout(() => {
              imgArray.forEach(element => {
                _this.images.push(element);
                _this.$store.commit("addImage", element);
              });
              _this.loading = false;
            }, 1000);
          } else {
            _this.noImages = true;
          }
        });
    } else {
      userImages.forEach(element => {
        this.images.push(element);
      });

      _this.loading = false;
    }
    // Get quota and limit
    ref.child(userID).once("value", userSnapshot => {
      var quota = userSnapshot.val().quota;
      var limit = userSnapshot.val().limit;
      var storageUsed = userSnapshot.val().storageUsed;
      var storageCap = userSnapshot.val().storageCap;

      _this.limit = limit;
      _this.quota = quota;
      _this.storageUsed = storageUsed;
      _this.storageCap = storageCap;
    });
  }
};
</script>

<style>
.lds-grid {
  display: inline-block;
  position: relative;
  width: 64px;
  height: 64px;
}
.lds-grid div {
  position: absolute;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: #fff;
  animation: lds-grid 1.2s linear infinite;
}
.lds-grid div:nth-child(1) {
  top: 6px;
  left: 6px;
  animation-delay: 0s;
}
.lds-grid div:nth-child(2) {
  top: 6px;
  left: 26px;
  animation-delay: -0.4s;
}
.lds-grid div:nth-child(3) {
  top: 6px;
  left: 45px;
  animation-delay: -0.8s;
}
.lds-grid div:nth-child(4) {
  top: 26px;
  left: 6px;
  animation-delay: -0.4s;
}
.lds-grid div:nth-child(5) {
  top: 26px;
  left: 26px;
  animation-delay: -0.8s;
}
.lds-grid div:nth-child(6) {
  top: 26px;
  left: 45px;
  animation-delay: -1.2s;
}
.lds-grid div:nth-child(7) {
  top: 45px;
  left: 6px;
  animation-delay: -0.8s;
}
.lds-grid div:nth-child(8) {
  top: 45px;
  left: 26px;
  animation-delay: -1.2s;
}
.lds-grid div:nth-child(9) {
  top: 45px;
  left: 45px;
  animation-delay: -1.6s;
}
@keyframes lds-grid {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.container {
  flex-direction: column;
}
.page-title {
  position: relative;
  color: rgb(230, 230, 230);
  width: 1000px;
  margin: 0 auto;
  text-align: center;
  margin-top: 70px;
  background-color: rgba(0, 0, 0, 0.12);
  font-size: 3rem;
  border-radius: 8px 8px 0px 0px;

  height: 91px;
  font-weight: bold;
}
.image-grid {
  justify-content: flex-start;
  width: 1000px;
  height: auto;
  background-color: rgba(0, 0, 0, 0.12);
  margin: 0 auto;
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
  border-radius: 0px 0px 8px 8px;
  margin-top: 20px;
  display: flex;
  padding: 40px 40px 20px 40px;
  flex-direction: row;
  flex-wrap: wrap;
}
.image-single {
  position: relative;
  width: auto !important;
  height: auto !important;
  display: inline-block;
  border-radius: 10px;
  margin: 0px 10px 10px 0px;
  transition-duration: 320ms;
}
.image-single-src {
  position: relative;
  object-fit: cover;
  width: auto;
  height: 200px;
  background-size: contain;
  background-repeat: no-repeat;
  border-radius: 5px;
}
.image-single:hover .image-single-overlay {
  visibility: visible;
}

.image-single-overlay {
  visibility: hidden;
  position: absolute;
  width: 250px;
  height: 188px;
  margin: 6px;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  border-radius: 5px;
  z-index: 3;
  top: 0;
  left: 0;
}
.overlay-info {
  width: 100%;
  height: 100%;
  padding: 8px;
  color: white;
}
.overlay-info p {
  margin: 0px 0px 4px 0px;
  text-overflow: ellipsis;
  word-wrap: break-word;
}
.v-input.v-text-field--is-booted {
  position: absolute;
  top: 10px;
  right: 11px;
}
.flip-list-move {
  transition: transform 1s;
}
.v-application ul {
  width: 1000px;
  padding: 0;
}
</style>