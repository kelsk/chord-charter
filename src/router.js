import Vue from 'vue';
import VueRouter from 'vue-router';
import ChordBoards from './views/ChordBoardView.vue';
import HelloWorld from './components/HelloWorld.vue';
import Charts from './views/ChartView.vue';

Vue.use(VueRouter)

const routes = [
  {
    path: '/hello',
    name: 'hello',
    component: HelloWorld
  },
  {
    path: '/charts',
    name: 'charts',
    component: Charts,
  },
  {
    path: '/chordboards',
    name: 'chordboards',
    component: ChordBoards,
  }
];
const router = new VueRouter({
  routes
})

export default router
