
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    keyboard: {},
    message: 'store state'
  },
  mutations: {
    toggle(state, n) {
      state.keyboard = n
      window.console.log('successfully stored state: ', n)
    },
    updateChordBoard(state, n) {
      state.keyboard = n;
      window.console.log('successfully updated state: ', n)
    }
  }
})

window.console.log(store)
export default store;