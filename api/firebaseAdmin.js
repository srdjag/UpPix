//https://firebase.google.com/docs/functions/http-events

var admin = require("firebase-admin");

var app = admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://image-hosting-app.firebaseio.com"
});

export default function(req, res, next) {
  if (req.url == "/admin") {
    admin
      .auth()
      .listUsers()
      .then(function(listUsersResult) {
        listUsersResult.users.forEach(function(userRecord) {
          console.log("user", userRecord.toJSON());
        });
        if (listUsersResult.pageToken) {
          // List next batch of users.
          listAllUsers(listUsersResult.pageToken);
        }
      })
      .catch(function(error) {
        console.log("Error listing users:", error);
      });
  }

  next();
}
