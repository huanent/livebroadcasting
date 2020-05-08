import { liveBroadcastService } from "@/main";
const axios = window["axios"];

const state = {
  pagedModel: {}
};

const getters = {
  pagedModel: state => {
    var pagedModel = {
      model: {}
    };
    if (state.pagedModel.list) {
      pagedModel.list = state.pagedModel.list.map(item => {
        return {
          summary: item.title.replace(/<[^>]*>/g, "") || "[点击查看详情]",
          ...item
        };
      });
    }
    pagedModel.total = state.pagedModel.total || 0;
    return pagedModel;
  }
};

const mutations = {
  SET_Paged_List(state, payload) {
    state.pagedModel = payload;
  }
};
const actions = {
  async getList({ commit }, { pageNum, pageSize }) {
    const result = await axios.get(
      `/question/list?pageNum=${pageNum}&pageSize=${pageSize}`
    );
    commit("SET_Paged_List", result.data);
  },
  async remove({ commit }, id) {
    const result = await axios.post(`/question/remove/${id}`);
    return result;
  },
  async save({ commit }, payload) {
    const result = await axios.post("/question/save", payload);
    return result;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
