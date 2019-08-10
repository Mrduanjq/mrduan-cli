import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Home from '@/view/Home'
import Record from '@/view/Record'
import Box from '@/view/Box'
import Play from '@/view/Play'
Vue.use(Router);
export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/record',
      name: 'record',
      component: Record
    },
    {
      path: '/box',
      name: 'box',
      component: Box
    }, {
      path: '/play',
      name: 'play',
      component: Play
    }
  ]
})
