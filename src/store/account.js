const state = {
  lb_token: "",
  tx_userId: "",
  tx_userSig: localStorage.getItem("tx_userSig")
    ? localStorage.getItem("tx_userSig")
    : "",
  tx_privateMapKey: ""
};

const getters = {
  tx_userSig: state => state.userSig
};

const mutations = {
  setLBToken(state, lb_token) {
    state.lb_token = lb_token;
    localStorage.setItem("lb_token", lb_token);
  },
  setTXUserId(state, tx_userId) {
    state.tx_userId = tx_userId;
  },
  setTXUserSig(state, tx_userSig) {
    state.tx_userSig = tx_userSig;
    localStorage.setItem("tx_userSig", tx_userSig);
  },
  setTXPrivateMapKey(state, tx_privateMapKey) {
    state.tx_privateMapKey = tx_privateMapKey;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations
};
