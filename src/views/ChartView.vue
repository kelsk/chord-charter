<template>
  <div>
    <!-- <link ref="../assets/DESYREL_.ttf" rel="stylesheet"/> -->
    <main class="chart__container">
    <ChartLibrary>
    </ChartLibrary>
    <div class="chartlibrary__welcome" v-if="$route.params.title === `charts`">
      <div class="chartlibrary__welcome-overlay">
        <div class="welcome-scroll">
        <p class="info">
          Welcome to the Chart Library
        </p>
        <p class="info">
          The Chart Library is designed to simplify writing, storing, editing, and accessing chord charts. Chord charts are easy to make and customize to your liking. 
          To create a chart, go to <router-link :to="'/charts/new'">Add New Chart</router-link> and click "Start Recording". 
          </p>
        <p class="info">


        Current Chart Features:
      <ul>
        <li>
          Add lyrics and repeats to a chart's measures
        </li>
        <li>
          Change the font and number of measures per line
        </li>
        <li>
          Use the Play feature to hear a synth playback of your chart
        </li>
        <li>
          Edit your chart using a Chordboard of your choice
        </li>
      </ul>
        </p>
        <p class="info">
      Features to look for in the future:
      <ul>
        <li>
          Creating charts via MIDI files
        </li>
        <li>
          Organizing charts with tags
        </li>
        <li>
          Printer-friendly PDFs of your charts
        </li>
        <li>
          Additional music notation components
        </li>
      </ul>
      </p>

      </div>
      </div>
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