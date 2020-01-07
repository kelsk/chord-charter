<template>
  <div id="chart">
    <title>
      Title
    </title>
    <section id="details">
      <span>Tempo:</span>
      <span>Key:</span>
    </section>
    <section id="body">
      <p 
      v-bind:key="measure.id"
      v-for="measure in measures">
        {{measure}}
      </p>
    </section>
  </div>
</template>

<script>
export default {
  name: 'ChordChart',
  data() {
    return {
      measures: [
        'C', 'C', 'C', 'F'
      ]
    }
  }
}
</script>