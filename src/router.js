import Vue from 'vue';
import VueRouter from 'vue-router';
import ChordBoards from './views/ChordBoardView.vue';
import ChordLibrary from './components/ChordLibrary.vue';
import Charts from './views/ChartView.vue';
// import ChartLibrary from './components/ChartLibrary.vue';
import ChordChart from './components/ChordChart.vue';
import NewChordChart from './components/NewChordChart.vue';
import Login from './views/Login.vue';
import store from './store.js';

Vue.use(VueRouter)

const fonts = ['Acme', 'Alata', 'Asap Condensed', 'Boogaloo', 'Calistoga', 'Caveat Brush', 'Fredoka One', 'Tinos'];

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/chordboards',
    name: 'chordboards',
    component: ChordBoards,
    meta: {
      requiresAuth: true
    },
  },
  {
    path: '/charts',
    name: 'charts',
    component: Charts,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: 'new',
        name: 'new',
        component: NewChordChart,
        meta: {
          requiresAuth: true
        },
        props: {
          fonts
        }
      },
        // :TITLE
      {
        path: '/:title',
        name: ':title',
        component: ChordChart,
        meta: {
          requiresAuth: true,
        },
        props: {
          fonts
        },
      },
      {
        path: '/:title/edit',
        name: 'edit',
        component: NewChordChart,
        meta: {
          requiresAuth: true
        },
        props: {
          fonts
        },
      },
    
    

    ]
  },
  {
    path: '/chords',
    name: 'chords',
    component: ChordLibrary,
    meta: {
      requiresAuth: true
    },
  },


];
const router = new VueRouter({
  routes
});

// below code from https://dev.to/gautemeekolsen/vue-guard-routes-with-firebase-authentication-f4l
// retrieved 01/18/20
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !store.state.currentUser.data) {
    next('/');
  } else {
    next();
  }
})

export default router
