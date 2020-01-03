import Vue from 'vue'
import { firestorePlugin } from 'vuefire';
import App from './App.vue';
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import Keyboard from 'simple-keyboard'
import 'simple-keyboard/build/css/index.css'


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
Vue.use(firestorePlugin)
export const db = firebase.firestore()

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')

// KEYBOARD SOURCE:
// Francisco Hodge simple-keyboard
// https://franciscohodge.com/projects/simple-keyboard/getting-started/
// installed on 1/3/2020

let keyboard = new Keyboard({
  layout: {
    'default': [
      'C7 D7 Eb7 E7 F7 G7 Ab7 A7 Bb7 B7',
      ' C Dm Em F G Am Bb Bm C7',
      ' Cm D E Fm Gm A Bbm '
    ],
    'qwerty': [
      'q w e r t y u i o p',
      ' a s d f g h j k l',
      ' z x c v b n m '
    ]
  },
  layoutName: "default"
})

export default keyboard;
