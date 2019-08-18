const express = require("express");
const app = express();
const request = require("request");

import firebase from "../plugins/firebase.js";

app.get("/:img", (req, res) => {
  firebase
    .database()
    .ref("images")
    .orderByChild("fullFileName")
    .equalTo(req.params.img)
    .once("value")
    .then(function(snapshot) {
      if (snapshot.exists()) {
        var data = snapshot.val()[Object.keys(snapshot.val())[0]];
        var dataJSON = JSON.parse(JSON.stringify(data));

        res.writeHead(200, {
          "content-type": "image/jpg"
        });
        request(dataJSON.URL).pipe(res);
      }
    });
});

module.exports = {
  path: "/i",
  handler: app
};
