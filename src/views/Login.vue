<template>
  <div>
    <div v-if="!this.$store.state.currentUser.data" class="login">
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
    <div v-else>
      Welcome to Chord Charter, {{this.$store.state.currentUser.data.displayName}}
    </div>
  </div>
</template>
<script>
import firebase from 'firebase'
export default {
  name: 'Login',
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
            error => window.console.log('Sign In error: ', error)
          )
        } else [
          window.console.log('Create User error: ', error)
        ]
      })
    },
  }
}
</script>
<style scoped>

.login {
  margin: 2rem;
  padding: 1rem;
  border: 2px solid black;
  border-radius: 10px;
  max-width: 200px;
}
</style>