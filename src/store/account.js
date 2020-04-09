const state = {
    token: '123'
};

const getters = {
    token: (state) => {
        return state.token;
    },
};

const mutations = {
    setToken(state, token) {
        state.token = token;
        localStorage.setItem("token", token);
    },
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
};
