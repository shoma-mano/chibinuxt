import {
  createRouter as _createRouter,
  createMemoryHistory,
  createWebHistory,
} from 'vue-router'
// @ts-expect-error virtual module
import routes from '#routes'

export const createRouter = () => {
  const history = import.meta.server
    ? createMemoryHistory()
    : createWebHistory()
  const router = _createRouter({
    history,
    routes,
  })
  return router
}
