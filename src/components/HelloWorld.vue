<template>
  <div class="hello">
    <p>
      <a href="https://cli.vuejs.org" target="_blank" rel="noopener">vue-cli documentation</a>
      <a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel" target="_blank" rel="noopener">babel</a>
      <a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint" target="_blank" rel="noopener">eslint</a>

      <a href="https://vuejs.org" target="_blank" rel="noopener">Core Docs</a>

      <a href="https://router.vuejs.org" target="_blank" rel="noopener">vue-router</a>
      <a href="https://vuex.vuejs.org" target="_blank" rel="noopener">vuex</a>
      <a href="https://github.com/vuejs/vue-devtools#vue-devtools" target="_blank" rel="noopener">vue-devtools</a>
      <a href="https://vue-loader.vuejs.org" target="_blank" rel="noopener">vue-loader</a>
      <a href="https://github.com/vuejs/awesome-vue" target="_blank" rel="noopener">awesome-vue</a>
  </p>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0;
}
a {
  color: #42b983;
  height: 10px;
  padding: 0;
  margin: 0;
}
.hello {
  font-size: .5rem;
  border: 1px solid rgb(147, 150, 150);
  background-color: rgb(108, 123, 123);
  padding: 5px;
}
</style>
