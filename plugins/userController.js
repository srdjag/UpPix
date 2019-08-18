import firebase from "./firebase.js";

var exp = {};

exp.logOut = function() {
  firebase
    .auth()
    .signOut()
    .then(
      function() {
        window.$nuxt.$store.commit("logoutUser");
        document.location.href = "/";
      },
      function(error) {}
    );
};

exp.loginWithGoogle = function() {
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase
    .auth()
    .signInWithPopup(provider)
    .then(function(result) {
      var token = result.credential.accessToken;
      var user = result.user;

      document.location.href = "/";
    })
    .catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email;
      var credential = error.credential;
    });
};

exp.loginWithEmail = function(email, password, that) {
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      document.location.href = "/";
    })
    .catch(function(error) {
      that.$toast.show(error.message, {
        duration: 3000,
        singleton: true,
        position: "top-center",
        theme: "bubble",
        type: "error"
      });
    });
};

exp.signInWithGoogle = function() {
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase
    .auth()
    .signInWithPopup(provider)
    .then(function(result) {
      document.location.href = "/";
    })
    .catch(function(error) {});
};

exp.signInWithEmail = function(email, password, that) {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(user => {
      //Send verification email
      var user = firebase.auth().currentUser;
      user
        .sendEmailVerification()
        .then(function() {
          document.location.href = "/";
        })
        .catch(function(error) {});
    })
    .catch(function(error) {
      that.$toast.show(error.message, {
        duration: 3000,
        singleton: true,
        position: "top-center",
        theme: "bubble",
        type: "error"
      });
    });
};

export default exp;
