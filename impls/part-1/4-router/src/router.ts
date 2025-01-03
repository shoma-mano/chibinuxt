import {
  type RouteRecordRaw,
  createRouter as _createRouter,
  createMemoryHistory,
  createWebHistory,
} from 'vue-router'
import Hello from './pages/hello.vue'
import World from './pages/world.vue'

export const createRouter = () => {
  const routes = [
    {
      path: '/hello',
      component: Hello,
    },
    {
      path: '/world',
      component: World,
    },
  ] satisfies RouteRecordRaw[]
  console.log(import.meta.server)
  const history = import.meta.server
    ? createMemoryHistory()
    : createWebHistory()
  const router = _createRouter({
    history,
    routes,
  })
  return router
}
