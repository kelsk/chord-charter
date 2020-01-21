<template>
  <div id="app">
  <link href="https://fonts.googleapis.com/css?family=Acme|Alata|Asap+Condensed|Boogaloo|Calistoga|Caveat+Brush|Fredoka+One|Tinos&display=swap" rel="stylesheet">
    <nav class="app__nav" v-if="$store.state.currentUser.data">
      <div class="links">
      <router-link to="/charts">Charts</router-link>
      <router-link to="/chordboards">Chordboards</router-link>
      </div>
      <div class="logo">
        Chord Charter
      </div>
      <div class="user__wrapper">
        <div class="user" alt="logout" title="logout" v-on:click="logoutUser">
          <a id="username">
            Logout {{this.$store.state.currentUser.data.displayName}}
          </a>
        </div>
      </div>
    </nav>
    <nav v-else class="app__nav" alt="login" title="login">
      <div class="user-wrapper">
        <span class="login-btn">
      <router-link to="/">
        Login
    </router-link>
        </span>
      </div>
    <div class="logo">
      Chord Charter
    </div>
    </nav>

    <router-view></router-view>
  </div>
</template>

<script>
import store from './store.js'
import firebase from 'firebase'
import './assets/App.css'

export default {
  name: 'app',
  store,
  components: {
  },
  data() {
    return {
      chordReference: [],
    }
  },
  methods: {
    logoutUser() {
      let self = this;
      firebase.auth().signOut().then(function(){
        window.alert('Signout successful');
        self.$store.commit('setCurrentUserData', null);
        self.$router.push('/');
      })
    },
  },
}
</script>

