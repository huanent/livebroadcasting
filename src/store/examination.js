import { liveBroadcastService } from "@/core/live-broadcast/live-broadcast-service";
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
      `/question/list?pageNum=${pageNum}&pageSize=${pageSize}&userId=${liveBroadcastService.userId}`
    );
    commit("SET_Paged_List", result.data);
  },
  async remove({ commit }, id) {
    const result = await axios.post(
      `/question/remove/${id}?userId=${liveBroadcastService.userId}`
    );
    return result;
  },
  async save({ commit }, payload) {
    const result = await axios.post(
      `/question/save?userId=${liveBroadcastService.userId}`,
      payload
    );
    return result;
  },
  async sendExamination({ commit }, questions) {
    const result = await sendExaminationMsg(JSON.stringify(questions));
    return result;
  },
  async sendExamAnsers({ commit }, answers) {
    // const result = await liveBroadcastService.timService.sendExaminationMsg(
    //   JSON.stringify(answers)
    // );
    // return result;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
