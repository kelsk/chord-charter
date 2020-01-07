import Vue from 'vue';
import VueRouter from 'vue-router';
import ChordBoard from './components/ChordBoard.vue';
import HelloWorld from './components/HelloWorld.vue';
import ChartLibrary from './components/ChartLibrary.vue';

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
    component: ChartLibrary
  },
  {
    path: '/chordboards',
    name: 'chordboards',
    component: ChordBoard
  }
];
const router = new VueRouter({
  routes
})

export default router
