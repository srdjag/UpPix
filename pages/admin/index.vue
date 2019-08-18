<template>
  <v-container fill-height>
    <div class="page-title">
      <span style="font-family: 'Indie Flower', cursive; margin-left: -70px;">Admin Area</span>
    </div>
    <div class="upload-wrap">
      <v-expansion-panels popout dark>
        <v-expansion-panel v-for="(user, i) in users" :key="i" hide-actions>
          <v-expansion-panel-header>
            <v-row align="center" class="spacer" no-gutters>
              <v-col cols="4" sm="2" md="1">
                <v-avatar size="38px" color="#377fb4">
                  <i class="material-icons">person_pin</i>
                </v-avatar>
              </v-col>

              <v-col class="hidden-xs-only" sm="5" md="3">
                <span class="grey--text">{{user.email}}</span>
              </v-col>

              <v-col class="text-no-wrap" cols="5" sm="3">
                <v-chip class="ml-0" label small>{{user.role}}</v-chip>
                <v-chip
                  v-if="user.storageUsed >= user.storageCap"
                  color="red"
                  class="ml-4"
                  label
                  small
                >Limit</v-chip>
              </v-col>

              <v-spacer></v-spacer>
            </v-row>
          </v-expansion-panel-header>

          <v-expansion-panel-content class="text-left">
            <v-divider></v-divider>
            <v-card-text>
              Total allowed space:
              <b>
                <span v-html="formatBytes(user.storageCap)"></span>
              </b>
              <br />Total used space:
              <b>
                <span v-html="formatBytes(user.storageUsed)"></span>
              </b>
              <br />Number of images:
              <b>{{user.quota}}</b>
              <br />Images number limit:
              <b>{{user.limit}}</b>
              <br />Suspended status:
              <b v-html="user.suspended ? 'True' : 'False'"></b>
              <br />
              <div class="my-2 mr-6" v-if="user.role !== 'Admin'">
                <v-btn
                  v-if="user.suspended !== true"
                  outlined
                  color="warning"
                  @click.prevent="suspend(user.id, i)"
                  small
                >suspend</v-btn>
                <v-btn
                  v-else-if="user.suspended === true"
                  outlined
                  color="success"
                  @click.prevent="unsuspend(user.id, i)"
                  small
                >unsuspend</v-btn>
              </div>
            </v-card-text>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </v-container>
</template>

<script>
import firebase from "../../plugins/firebase";

export default {
  asyncData({ store, redirect }) {
    var _this = this;
    var users = [];
    firebase
      .database()
      .ref("/users/")
      .once("value")
      .then(function(snapshot) {
        if (snapshot.exists()) {
          const usersArray = Object.keys(snapshot.val()).map(
            i => snapshot.val()[i]
          );
          const usersIDArray = Object.keys(snapshot.val());

          for (let index = 0; index < usersArray.length; index++) {
            var id = usersIDArray[index];
            var user = usersArray[index];
            user.id = id;
            users.push(user);
          }
        } else {
        }
      });
    return { users: users };
  },
  created() {
    this.users.sort((a, b) => (a.role > b.role ? 1 : b.role > a.role ? -1 : 0));
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
    suspend(id, i) {
      var _this = this;
      firebase
        .database()
        .ref("users/" + id)
        .update({
          suspended: true
        })
        .then(e => {
          _this.users[i].suspended = true;
        });
    },
    unsuspend(id, i) {
      var _this = this;
      firebase
        .database()
        .ref("users/" + id)
        .update({
          suspended: false
        })
        .then(e => {
          _this.users[i].suspended = false;
        });
    }
  }
};
</script>

<style scoped>
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
</style>