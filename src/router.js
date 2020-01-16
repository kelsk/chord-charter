import Vue from 'vue';
import VueRouter from 'vue-router';
import ChordBoards from './views/ChordBoardView.vue';
import ChordLibrary from './components/ChordLibrary.vue';
import HelloWorld from './components/HelloWorld.vue';
import Charts from './views/ChartView.vue';
// import ChartLibrary from './components/ChartLibrary.vue';
import ChordChart from './components/ChordChart.vue';
import NewChordChart from './components/NewChordChart.vue';

Vue.use(VueRouter)

const fonts = ['Acme', 'Alata', 'Asap Condensed', 'Boogaloo', 'Calistoga', 'Caveat Brush', 'Fredoka One', 'Tinos'];

const routes = [
  {
    path: '/hello',
    name: 'hello',
    component: HelloWorld
  },
  {
    path: '/chordboards',
    name: 'chordboards',
    component: ChordBoards,
  },
  {
    path: '/charts',
    name: 'charts',
    component: Charts,
    children: [
      // {
      //   path: '/',
      //   name: 'chartlibrary',
      //   component: ChartLibrary
      // },
      {
        path: 'new',
        name: 'new',
        component: NewChordChart,
        props: {
          fonts
        }
      },
        // :TITLE
  {
    path: '/:title',
    name: ':title',
    component: ChordChart,
    props: {
      fonts
    },
    children: [
    ]
      },
      {
        path: '/:title/edit',
        name: 'edit',
        component: NewChordChart
      },
    
    

    ]
  },
  {
    path: '/chords',
    name: 'chords',
    component: ChordLibrary
  },


];
const router = new VueRouter({
  routes
})

export default router
