export const state = () => ({
  currentUser: {
    id: "",
    name: "",
    email: "",
    emailVerified: false,
    role: "",
    isLoggedIn: null,
    images: []
  }
});
export const mutations = {
  setCurrentUser(state, data) {
    state.currentUser = data;
  },
  logoutUser(state, data) {
    state.currentUser = {
      id: "",
      name: "",
      email: "",
      isLoggedIn: false,
      role: "",
      emailVerified: false,
      images: []
    };
  },
  addImage(state, element) {
    state.currentUser.images.push(element);
  },
  removeImages(state) {
    state.currentUser.images = [];
  },
  removeImage(state, ID) {
    state.currentUser.images.forEach((imgObj, index) => {
      if (imgObj.ID == ID) {
        state.currentUser.images.splice(index, 1);
      }
    });
  }
};
export const getters = {
  getCurrentUser(state) {
    return state.currentUser;
  },
  getImages(state) {
    return state.currentUser.images;
  }
};
