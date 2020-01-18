<template>
  <div>
    <!-- <link ref="../assets/DESYREL_.ttf" rel="stylesheet"/> -->
    <main class="chart__container">
    <ChartLibrary>
    </ChartLibrary>
    <div class="logo" v-if="$route.params.title === `charts`">
      Chord Charter
      <div v-if="!this.$store.state.currentUser" class="login">
        Please log in 
        <form
        id="login"
        v-on:submit.prevent="submitForm"
        >

          <p>
            <label for="email">Email</label>
            <input 
            v-model="email"
            type="text" 
            name="" 
            id="">
          </p>
          <p>
            <label for="password">Password</label>
            <input 
            v-model="password"
            type="text" 
            name="" 
            id="">
          </p>
          
          <button type="submit">
            submit
          </button>
        </form>
      </div>
    </div>
    <router-view :key="$route.params.title">
    </router-view>
    </main>
  </div>
</template>
<script>
import ChartLibrary from '../components/ChartLibrary.vue'
import firebase from 'firebase'

export default {
  name: 'Charts',
  components: {
    ChartLibrary,
  },
  data() {
    return {
      email: '',
      password: '',
    }
  },
  methods: {
    submitForm() {
      window.console.log('email: ', this.email, this.password);
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(
        this.$store.commit('setCurrentUser', this.email)
      ).catch(error =>  {
        if (error.code === 'auth/email-already-in-use') {
          firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(
            this.$store.commit('setCurrentUser', this.email)
          ).catch(
            error => window.alert('Error: ', error)
          )
        }
      })
    },
  }
}
</script>
<style scoped>
/* @font-face {
  font-family: 'Desyrel';
  src: url('../assets/DESYREL_.ttf');
} */
.logo {
  /* font-family: 'Desyrel'; */
  font-size: 4rem;
}
.login {
  font-size: 2rem;
}
</style>