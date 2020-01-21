<template>
  <div class="login">
    <div v-if="!this.$store.state.currentUser.data" class="login__form">
      Please log in 
      <form id="login" v-on:submit.prevent="submitForm">
        <p>
          <label for="name">Name</label>
          <input v-model="form.name" type="text">
        </p>
        <p>
          <label for="email">Email</label>
          <input v-model="form.email" type="text">
        </p>
        <p>
          <label for="password">Password</label>
          <input v-model="form.password" type="text">
        </p>
        <button type="submit">
          LOGIN
        </button>
      </form>
    </div>
    <div v-else class="chart__container">
      <ChartLibrary>
      </ChartLibrary> 
      <div class="login__welcome">
        Chord Charter
        <div class="login__links">
        <router-link :to="'/chordboards'">
        chordboards
        </router-link>
        <router-link :to="'/charts'">
        charts
        </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import firebase from 'firebase'
import ChartLibrary from '../components/ChartLibrary'

export default {
  name: 'Login',
  components: {
    ChartLibrary
  },
  data() {
    return {
      form: {
        email: '',
        name: '',
        password: '',
      }
    }
  },
  methods: {
    submitForm() {
      const self = this;
      firebase.auth().createUserWithEmailAndPassword(self.form.email, self.form.password).then(
        function(data){
          data.user.updateProfile({
            displayName: self.form.name
          }).then(()=>{});
        self.$store.commit('setCurrentUser', self.form.email)
        }
      ).catch(error =>  {
        if (error.code === 'auth/email-already-in-use') {
          firebase.auth().signInWithEmailAndPassword(self.form.email, self.form.password).then(
            function(data){
              data.user.updateProfile({
                displayName: self.form.name
              }).then(()=>{});
              self.$store.commit('setCurrentUserData', self.form);
              self.$router.push('/charts')
            }
          ).catch(
            error => window.alert('Sign In error: ', error)
          )
        } else [
          window.alert('Create User error: ', error)
        ]
      });
    },
  }
}
</script>
