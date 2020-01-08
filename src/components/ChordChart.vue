<template>
  <div id="chart" class="chart">
    <!-- <link href="https://fonts.googleapis.com/css?family=Hammersmith+One|Lalezar|Nanum+Pen+Script|Oxygen|Patrick+Hand|Paytone+One|Rajdhani|Titillium+Web|Volkhov|Yanone+Kaffeesatz&display=swap" rel="stylesheet"> -->
    <link href="https://fonts.googleapis.com/css?family=Acme|Alata|Asap+Condensed|Boogaloo|Calistoga|Caveat+Brush|Fredoka+One|Tinos&display=swap" rel="stylesheet">
    <nav class="chart__options">
      <span>
        Measures per line:
        <input type="number" placeholder="8" max="10" min="1" v-on:change="updateMeasuresPerLine($event)" />
      </span>
      <span>
        Chord Font:
        <select v-model="chart.style.font" @change="updateFont(chart.style.font)">
          <option v-bind:key="font.id" v-for="font in fonts" v-bind:value="font">{{font}}
          </option>
        </select>
      </span>
      <span>
        Other Options
      </span>

    </nav>
    <header class="chart__header">
      <span class="chart__title">
        {{chart.details.title}}
      </span>
      <span 
      v-bind:if="chart.author" class="chart__author">
      by {{chart.details.author}}
      </span>
    </header>

    <section id="details" class="chart__details">
      <span class="chart__details-tempo">
        Tempo: {{chart.details.tempo}}
      </span>
      <span class="chart__details-key">
        Key: {{chart.details.keySig}}
      </span>
      <span class="chart__details-time">
        Time: {{chart.details.timeSig.upper}}/{{chart.details.timeSig.lower}}
      </span>
    </section>

    <section id="chart-body" class="chart__body grid__col-4">
      <div
      v-bind:key="measure.id"
      v-for="measure in measures">
        <p class="chart__measure-beats">
        <span class="beat"
        v-bind:key="beat.id"
        v-for="beat in measure.beats">
        {{beat}}
        </span>
        </p>
        <p class="chart__measure-lyrics">
          <input class="lyric"
          v-bind:key="lyric.id"
          type="text"
          v-for="lyric in measure.lyrics" v-bind:placeholder="lyric">
        </p>
      </div>
    </section>
    <button v-on:click="populateMeasures">
      Populate Measures
    </button>
  </div>
</template>

<script>
export default {
  name: 'ChordChart',
  mounted() {
    this.populateMeasures();
  },
  updated() {
    // SAVED METHOD TO UPDATE PLACEHOLDER SIZE
    // let inputs = document.getElementsByTagName('input')
    // inputs.forEach(el => {
    //   let elSize = el.getAttribute('placeholder').length;
    //   let beatSize = this.chart.measuresPerLine;
    //   el.setAttribute('size', el.getAttribute('placeholder').length + 1);
    // })
          document.getElementsByClassName('chart__measure-lyrics').forEach(measure => {
            measure.classList.add('grid__col-' + this.chart.details.timeSig.upper.toString())
          })

  },
  data() {
    return {
      fonts: ['Acme', 'Alata', 'Asap Condensed', 'Boogaloo', 'Calistoga', 'Caveat Brush', 'Fredoka One', 'Tinos'],
      measures: [],
      chart: {
        style: {
          font: 'Alata',
          measuresPerLine: 8,
        },
        details: {
          title: "Happy Birthday",
          author: 'Kelsey',
          tempo: 108,
          keySig: 'C',
          timeSig: {
            upper: 3,
            lower: 4
          }
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
        ],
        lyrics: [
          ' ', ' ', 'happy',
          'birth','day','to',
          'you',' ','happy',
          'birth','day','to',
          'you',' ','happy',
          'birth','day','dear',
          'SOME','ONE','happy',
          'birth','day','to',
          'you', ' ', ' '
        ]
      }
    }
  },
  methods: {
    updateFont(font) {
      document.getElementById('chart').setAttribute('style', `font-family: '${font}', sans-serif;`);
      window.console.log("ran updateFont with font ", font);
      window.console.log(document.getElementById('chart').fontFamily);
    },
    updateMeasuresPerLine(event) {
      let mpl = this.chart.style.measuresPerLine;
      let etv = event.target.value
      let chart = document.getElementById('chart-body');
      chart.classList.remove('grid__col-' + mpl.toString());
      chart.classList.add('grid__col-' + etv.toString());
      this.chart.style.measuresPerLine = etv;
    },

  // this should be a cloud function
    populateMeasures() {
      const beatsPerMeasure = this.chart.details.timeSig.upper;
      for (let i=0; i<this.chart.beats.length; i++) {
        let measure = {};
        let beats = [];
        let lyrics = [];
        for (let j=0; j<beatsPerMeasure; j++) {
        beats.push(this.chart.beats[i]);
        lyrics.push(this.chart.lyrics[i]);
        if ( j < beatsPerMeasure - 1 ) i++;
        }
        measure['beats'] = beats;
        measure['lyrics'] = lyrics;
        this.measures.push(measure);
      }
      this.formatMeasures(beatsPerMeasure);
    },

    formatMeasures() {
      this.measures.forEach(measure => {
        let currentBeat = measure.beats[0];
        window.console.log(currentBeat);
        for (let i=1; i < this.chart.details.timeSig.upper; i++) {
          if (currentBeat === '') {
            measure.beats[i-1] = '/';
            currentBeat = measure.beats[i];
            window.console.log('Entered slash loop');
          } else if (currentBeat === measure.beats[i]) {
            measure.beats[i] = ''
          } else {
            currentBeat = measure.beats[i]
          }
        }
      }) 
    }
  }
}
</script>

<style scoped>
.chart {
  text-align: center;
  font-size: 2rem;
}
.chart__options {
  height: 3rem;
}
.chart__header {
  height: 3rem;
}
.chart__body {
  display: grid;
  grid-row-gap: 1rem;
  font-size: 2rem;
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
.chart__measure-beats, .chart__measure-lyrics {
  border-left: 1px solid black;  
  text-align: center;
  display: flex;
  justify-content: space-around;
  margin: 0;
}
.chart__measure-beats {
  padding: 0px 20px 0px 20px;
}
.chart__measure-lyrics {
  padding: 0px 20px 0px 20px;
  display: grid;
}
.lyric {
  font-size: 1rem;
  border: none;
  padding: 0;
  width: 100%;
}
.lyric::placeholder {
  color: black;
  text-align: center;
}
.lyric:focus::placeholder {
  color: grey;
}
</style>