import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/views/layout/home.vue'
import Category from '@/views/layout/category.vue'
import Cart from '@/views/layout/cart.vue'
import User from '@/views/layout/user.vue'
import Layout from '@/views/layout'

import store from '@/store/index.js'

import Login from '@/views/login'
import Search from '@/views/search'
import SearchList from '@/views/search/list.vue'
import ProDetail from '@/views/prodetail'
import Pay from '@/views/pay'
import MyOrder from '@/views/myorder'
// const Login = import('@/views/login')
// const Search = import('@/views/search')
// const SearchList = import('@/views/search/list.vue')
// const ProDetail = import('@/views/prodetail')
// const Pay = import('@/views/pay')
// const MyOrder = import('@/views/myorder')

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/login', component: Login },
    {
      path: '/',
      component: Layout,
      redirect: '/home',
      children: [
        { path: '/home', component: Home },
        { path: '/category', component: Category },
        { path: '/cart', component: Cart },
        { path: '/user', component: User }
      ]
    },
    { path: '/search', component: Search },
    { path: '/myorder', component: MyOrder },
    { path: '/pay', component: Pay },
    { path: '/prodetail/:id', component: ProDetail },
    { path: '/searchlist', component: SearchList }
    // { path: '/', component:}
  ]
})

const authUrls = ['/pay', '/myorder']

router.beforeEach((to, from, next) => {
  // 1. to往哪里去， 到哪去的路由信息对象
  // 2. from 从哪里来， 从哪来的路由信息对象
  // 3. next() 是否放行
  // 如果next()调用，就是放行
  // next(路径) 拦截到某个路径页面
  // console.log(to, from, next)
  if (!authUrls.includes(to.path)) {
    next()
    return
  }

  const token = store.getters.token
  if (token) {
    next()
  } else {
    next('/login')
  }
  // console.log(token)
})

export default router
