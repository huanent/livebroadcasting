const state = {
  sdkappid: "1400345310",
  account: "",
  userSig: localStorage.getItem("userSig")
    ? localStorage.getItem("userSig")
    : "",
};

const getters = {
  userSig: (state) => {
    return state.userSig;
  },
};

const mutations = {
  setSdkAppId(state, sdkappid) {
    state.sdkappid = sdkappid;
  },
  setUserSig(state, userSig) {
    state.userSig = userSig;
    localStorage.setItem("userSig", userSig);
  },
  setAccount(state, account) {
    state.account = account;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
};
