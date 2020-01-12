
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    keyboard: {},
    currentChart: {
      // set with defaults
      details: {
        title: 'untitled',
        timeSig: {
          upper: 4,
          lower: 4
        }
      },
      content: {
        beats: [],
        lyrics: [],
      },
      style: {
        measuresPerLine: 8,
        font: "'Alata'"
      },
    },
    currentChordBoard: 'default',
    currentChordBoardLayout: [' h e l l o   w o r l d '],
    message: 'store state'
  },
  mutations: {
    toggle(state, n) {
      state.currentChordBoard = n
      window.console.log('successfully stored state: ', n)
    },
    toggleLayout(state, n) {
      state.currentChordBoardLayout = n;
      window.console.log('successfully stored layout state: ', n)
    },
    updateChordBoard(state, n) {
      state.keyboard = n;
      window.console.log('successfully updated chordboard state: ', n)
    },
    editChart(state, updates) {
      state.currentChart[updates.keys[0]][updates.keys[1]] = updates.value;
      window.console.log('successfully edited chart state: ', state.currentChart)
    },
    loadChart(state, chart) {
      state.currentChart = chart;
      window.console.log('successfully loaded chart state: ', chart)
    }
  }
})

window.console.log(store)
export default store;