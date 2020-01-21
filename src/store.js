
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
    chordBoardNames: [],
    currentChordBoard: 'default',
    currentChordBoardLayout: [' c h o r d   b o a r d '],
    currentUser: {
      loggedIn: false,
      data: null
    },
    miniHidden: false,
  },
  getters: {
    currentUser(state) {
      return state.currentUser
    },
  },
  mutations: {
    addChartTitles(state, titles) {
      state.chartTitles = titles;
    },
    addChordBoardName(state, names) {
      state.chordBoardNames = names;
    },
    toggle(state, n) {
      state.currentChordBoard = n
    },
    toggleLayout(state, n) {
      state.currentChordBoardLayout = n;
    },
    updateChordBoard(state, n) {
      if (n[0] === 'name') {
        state.currentChordBoard = n[1]
      } else {
        state.currentChordBoard = n[0];
        state.keyboard = n[1];
      }
    },
    editChart(state, updates) {
      state.currentChart[updates.keys[0]][updates.keys[1]] = updates.value;
    },
    loadChart(state, chart) {
      state.currentChart = chart;
    },
    setLoggedIn(state, value) {
      state.currentUser.loggedIn = value;
    },
    setCurrentUserData(state, data) {
      state.currentUser.data = data;
    },
    toggleMiniChordBoard(state, value) {
      state.miniHidden = value
    },
    addTitle(state, title) {
      state.chartTitles.push(title);
    },
    removeTitle(state, title) {
      state.chartTitles.splice(state.chartTitles.indexOf(title), 1);
    },
    removeChordboard(state, name) {
      state.chordBoardNames.splice(state.chordBoardNames.indexOf(name), 1);
    },
  },
  // below methods from https://blog.logrocket.com/vue-firebase-authentication/
  // retrieved on 1/18/20
  actions: {
    fetchUser({ commit }, user) {
      commit('setLoggedIn', user !== null);
      if (user) {
        commit('setCurrentUserData', {
          displayName: user.displayName,
          email: user.email
        });
      } else {
        commit('setCurrentUserData', null);
      }
    },
  }
})

export default store;