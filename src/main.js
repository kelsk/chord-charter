import Vue from 'vue'
import { firestorePlugin } from 'vuefire';
import App from './App.vue';
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import router from './router.js';
import store from './store';
// import Keyboard from 'simple-keyboard';
// import 'simple-keyboard/build/css/index.css'



const firebaseConfig = {
  apiKey: "AIzaSyDUhfSwEZYq6iXinKB3C_B0OWK04c8LlHw",
  authDomain: "chord-charter.firebaseapp.com",
  databaseURL: "https://chord-charter.firebaseio.com",
  projectId: "chord-charter",
  storageBucket: "chord-charter.appspot.com",
  messagingSenderId: "130890823599",
  appId: "1:130890823599:web:dc40a83115aaf48c08215a",
  measurementId: "G-HJR8NWKFX1"
};
firebase.initializeApp(firebaseConfig)
firebase.auth().onAuthStateChanged(user =>  {
  if (user) {
    store.dispatch('fetchUser', user)
  } else {
    window.console.log('no user is signed in.')
  }
});

Vue.use(firestorePlugin)
export const db = firebase.firestore()

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')


// KEYBOARD SOURCE:
// Francisco Hodge simple-keyboard
// https://franciscohodge.com/projects/simple-keyboard/getting-started/
// installed on 1/3/2020
// let keyboard = new Keyboard({
//   layout: {
//     'default': ['0 1 2 3 4 5 6 7 8 9',
//     ' 10 11 12 13 14 15 16 17 18',
//       ' 19 20 21 22 23 24 25'],
//     'qwerty': [
//       'q w e r t y u i o p',
//       ' a s d f g h j k l',
//       ' z x c v b n m '
//     ]
//   },
//   layoutName: "default"
// })


// export default keyboard;
