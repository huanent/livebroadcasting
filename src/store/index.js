import Vue from 'vue'
import Vuex from 'vuex'
import account from './account'
import board from './board'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    account,
    board
  }
})