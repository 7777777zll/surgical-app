import { constantRouter, asyncRouter } from '../../router'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission (roles, route, codes) {
  // 先判断条件
  if (route.code) {
    // 判断
    let res = codes.indexOf(route.code)
    if (res >= 0) {
      if (route.meta && route.meta.role) {
        return roles.some(role => route.meta.role.indexOf(role) >= 0)
      } else {
        return true
      }
    } else {
      return false
    }
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter (asyncRouter, roles, codes) {
  const accessedRouters = asyncRouter.filter(route => {
    if (hasPermission(roles, route, codes)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles, codes)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

const permission = {
  state: {
    routers: constantRouter,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouter.concat(routers)
    }
  },
  actions: {
    GenerateRoutes ({ commit }, data) {
      return new Promise(resolve => {
        const { roles } = data
        const rolesArr = []
        const codeArr = []
        roles.forEach((item, index, array) => {
          rolesArr.push(item.name)
          item.permissions.forEach((permission) => {
            codeArr.push(permission.code)
          })
        })
        let accessedRouters
        if (roles.indexOf('admin') >= 0) {
          accessedRouters = asyncRouter
        } else {
          accessedRouters = filterAsyncRouter(asyncRouter, rolesArr, codeArr)
        }
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
