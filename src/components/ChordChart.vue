<template>
  <div id="chart">
    <nav class="chart__options">
      <span>
        Measures per line:
        <input type="number" placeholder="8" max="10" min="1" v-on:change="updateMeasuresPerLine($event)" />
      </span>
    </nav>
    <header class="chart__header">
      <span class="chart__title">
        {{chart.title}}
      </span>
      <span 
      v-bind:if="chart.author" class="chart__author">
      {{chart.author}}
      </span>
    </header>

    <section id="details" class="chart__details">
      <span class="chart__details-tempo">
        Tempo: {{chart.tempo}}
      </span>
      <span class="chart__details-key">
        Key: {{chart.keySig}}
      </span>
      <span class="chart__details-time">
        Time: {{chart.timeSig.upper}}/{{chart.timeSig.lower}}
      </span>
    </section>

    <section id="chart-body" class="chart__body grid__col-3">
      <p 
      class="chart__measure"
      v-bind:key="measure.id"
      v-for="measure in measures">
        {{measure}}
      </p>
    </section>
    <button v-on:click="populateMeasures">
      Populate Measures
    </button>
  </div>
</template>

<script>
export default {
  name: 'ChordChart',
  data() {
    return {
      measures: [],
      chart: {
        measuresPerLine: 8,
        title: "Happy Birthday",
        tempo: 108,
        keySig: 'C',
        timeSig: {
          upper: 3,
          lower: 4
        },
        beats: [
          '', '', 'G', 
          'C', 'C', 'C',
          'G', 'G', 'G', 
          'G', 'G', 'G', 
          'C', 'C', 'C', 
          'C7', 'C7', 'C7', 
          'F', 'F', 'F#dim7',
          'C/G', 'C/G', 'G7', 
          'C', 'C', 'C'
        ]
      }
    }
  },
  methods: {
    updateMeasuresPerLine(event) {
      let mpl = this.chart.measuresPerLine;
      let etv = event.target.value
      let chart = document.getElementById('chart-body');
      chart.classList.remove('grid__col-' + mpl.toString());
      chart.classList.add('grid__col-' + etv.toString());
      this.chart.measuresPerLine = etv;
      window.console.log(this.chart.measuresPerLine);

    },

  // this should be a cloud function
    populateMeasures() {
      const beatsPerMeasure = this.chart.timeSig.upper;
      for (let i=0; i<this.chart.beats.length; i++) {
        let measure = [];
        for (let j=0; j<beatsPerMeasure; j++) {
        measure.push(this.chart.beats[i]);
        window.console.log('i = ', i);
        window.console.log('chord = ', this.chart.beats[i]);
        if ( j < beatsPerMeasure - 1 ) i++;
        }
        this.measures.push(measure);
      }
      this.formatMeasures();
    },

    formatMeasures() {
      this.measures.forEach(measure => {
        let currentBeat = measure[0];
        window.console.log(currentBeat);
        for (let i=1; i < this.chart.timeSig.upper; i++) {
          if (currentBeat === measure[i]) {
            measure[i] = ''
          } else {
            currentBeat = measure[i]
          }
        }
      }) 
    }
  }
}
</script>

<style scoped>
.chart__body {
  display: grid;
  grid-row-gap: 1rem;
}
.grid__col-1 {
  grid-template-columns: 1fr;
}
.grid__col-2 {
  grid-template-columns: repeat(2, 1fr);
}
.grid__col-3 {
  grid-template-columns: repeat(3, 1fr);
}
.grid__col-4 {
  grid-template-columns: repeat(4, 1fr);
}
.grid__col-5 {
  grid-template-columns: repeat(5, 1fr);
}
.grid__col-6 {
  grid-template-columns: repeat(6, 1fr);
}
.grid__col-7 {
  grid-template-columns: repeat(7, 1fr);
}
.grid__col-8 {
  grid-template-columns: repeat(8, 1fr);
}
.chart__measure {
  border-left: 1px solid black;  
  text-align: center;
  display: flex;
  justify-content: space-around;
}
</style>