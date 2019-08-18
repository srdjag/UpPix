export default function({ store, redirect, route }) {
  // If user is not logged in
  if (
    store.state.currentUser.isLoggedIn == null ||
    store.state.currentUser.isLoggedIn == false
  ) {
    // If user is not logged in and tries to access protected pages
    if (
      route.name == "my-images" ||
      route.name == "upload" ||
      route.name == "admin"
    ) {
      return redirect("/");
    }
  }
  //If user is logged in
  else if (store.state.currentUser.isLoggedIn == true) {
    //If user is logged in and tries to access login/register pages
    if (route.name == "login" || route.name == "register") {
      return redirect("/");
    }
    //If user is logged in and tries to access admin area and is not admin
    if (store.state.currentUser.role !== "Admin" && route.name == "admin") {
      return redirect("/");
    }
  }
}
