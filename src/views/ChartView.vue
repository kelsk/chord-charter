<template>
  <div>
    <!-- <link ref="../assets/DESYREL_.ttf" rel="stylesheet"/> -->
    <main class="chart__container">
    <ChartLibrary>
    </ChartLibrary>
    <div class="logo" v-if="$route.params.title === `charts`">
      Chord Charter
    </div>
    <router-view :key="$route.params.title">
    </router-view>
    </main>
  </div>
</template>
<script>
import ChartLibrary from '../components/ChartLibrary.vue'

export default {
  name: 'Charts',
  components: {
    ChartLibrary,
  },
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
</style>