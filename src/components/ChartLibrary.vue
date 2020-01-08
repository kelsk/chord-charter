<template>
  <div>
    Chord Chart Library
  <div>
    <ChordChart></ChordChart>
  </div>

  </div>
</template>

<script>
import ChordChart from './ChordChart.vue'

export default {
  name: 'ChartLibrary',
  components: {
    ChordChart,
  },
  mounted() {
    window.console.log("Chart Library mounted")
  }
}
</script>