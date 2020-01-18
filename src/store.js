
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    keyboard: {},
    chartTitles: [],
    currentChart: {
      // set with defaults
      details: {
        title: 'untitled',
        author: 'author',
        timeSig: {
          upper: 4,
          lower: 4
        }
      },
      content: {
        bars: [],
        beats: [],
        lyrics: [],
      },
      style: {
        measuresPerLine: 8,
        font: 'Alata'
      },
    },
    currentChordBoard: 'default',
    currentChordBoardLayout: [' c h o r d   b o a r d '],
    currentUser: undefined,
  },
  mutations: {
    addChartTitles(state, titles) {
      state.chartTitles = titles;
      window.console.log('successfully stored chart titles: ', titles)
    },
    toggle(state, n) {
      state.currentChordBoard = n
      window.console.log('successfully stored state: ', n)
    },
    toggleLayout(state, n) {
      state.currentChordBoardLayout = n;
      window.console.log('successfully stored layout state: ', n)
    },
    updateChordBoard(state, n) {
      if (n[0] === 'name') {
        state.currentChordBoard = n[1]
      } else {
        state.keyboard = n[1];
      }
      window.console.log('successfully updated chordboard state: ', n)
    },
    editChart(state, updates) {
      window.console.log('update value: ', updates.value);
      state.currentChart[updates.keys[0]][updates.keys[1]] = updates.value;
    },
    loadChart(state, chart) {
      state.currentChart = chart;
      window.console.log('successfully loaded chart state: ', chart)
    },
    setCurrentUser(state, user) {
      state.currentUser = user;
      window.console.log('successfully added user to state: ', user);
    },
    addTitle(state, title) {
      state.chartTitles.push(title);
      window.console.log('successfully added title to state: ', title)
    },
    removeTitle(state, title) {
      state.chartTitles.splice(state.chartTitles.indexOf(title), 1);
      window.console.log('successfully removed title from state: ', title)
    }
  }
})

window.console.log(store)
export default store;