export const state = () => ({
  currentUser: {
    id: "",
    name: "",
    email: "",
    isLoggedIn: false
  }
});
export const mutations = {
  setCurrentUser(state, data) {
    state.currentUser = data;
  }
};
export const getters = {
  getCurrentUser(state) {
    return state.currentUser;
  }
};
