const state = {
  tx_user_id: "",
  tx_userSig: localStorage.getItem("tx_userSig")
    ? localStorage.getItem("tx_userSig")
    : "",
  tx_privateMapKey: ""
};

const getters = {
  tx_userSig: state => {
    return state.userSig;
  }
};

const mutations = {
  setUserId(state, tx_user_id) {
    state.tx_user_id = tx_user_id;
  },
  setUserSig(state, tx_userSig) {
    state.tx_userSig = tx_userSig;
    localStorage.setItem("userSig", userSig);
  },
  setPrivateMapKey(state, tx_privateMapKey) {
    state.tx_privateMapKey = tx_privateMapKey;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations
};
