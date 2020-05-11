const state = {
  sdkAppId: "1400360542",
  lb_expires: "",
  lb_token: "",
  tx_userId: "",
  tx_userSig: "",
  tx_privateMapKey: "",
  role: "student", // student teacher
  nickname: "",
  username: "",
  avatar: ""
};

const getters = {
  tx_userSig: state => state.userSig,
  role: state => state.role,
  nickname: state => state.nickname,
  avatar_url: state => state.avatar
};

const mutations = {
  SET_LB_TOKEN(state, lb_token) {
    state.lb_token = lb_token;
    localStorage.setItem("lb_token", lb_token);
  },
  SET_LB_EXPIRES(state, lb_expires) {
    state.lb_expires = lb_expires;
    localStorage.setItem("lb_expires", lb_expires);
  },
  SET_NICKNAME(state, name) {
    state.nickname = name;
  },
  SET_AVATAR_URL(state, url) {
    state.avatar = "http://livebroadcasting.jinrui.kooboo.site" + url;
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
