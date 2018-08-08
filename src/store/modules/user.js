/**
 * 用来存放用户信息
 **/

import { Login } from '@/api/api'
import {getStatus, removeStatus, setStatus} from '@/utils/cookie'
const user = {
  state: {
    name: '',
    roles: [],
    status: getStatus()
  },
  mutations: {
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_STATUS: (state, status) => {
      state.status = status
    }
  },
  actions: {
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        Login.login(userInfo)
          .then(response => {
            // 登陆成功
            // 将信息存入vuex
            // 获取用户角色
            // commit('SET_ROLES', userInfo.roles)
            // commit('SET_NAME', userInfo.name)
            commit('SET_STATUS', true)
            setStatus(true)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 获取用户信息
    GetUserInfo ({ commit, state }) {
      return new Promise((resolve, reject) => {
        // state.token
        Login.getUserInfo()
          .then(response => {
            // 登陆成功
            // 将信息存入vuex
            // 获取用户角色
            // 获取设备id, 如果存在的话  role加上divice
            let deviceId = null
            if (window.native) {
              deviceId = window.native.getdeviceid()
            }
            if (deviceId) {
              response.roles.push({name: 'device', permissions: []})
            }
            // TODO
            commit('SET_ROLES', response.roles)
            commit('SET_NAME', response.name)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    LogOut ({ commit, state }) {
      return new Promise((resolve, reject) => {
        // logout(state.token).then(() => {
        //   commit('SET_TOKEN', '')
        //   commit('SET_ROLES', [])
        //   removeToken()
        //   resolve()
        // }).catch(error => {
        //   reject(error)
        // })
        // commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_STATUS', false)
        removeStatus()
        resolve()
      })
    },
    FedLogOut ({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit('SET_STATUS', false)
        removeStatus()
        resolve()
      })
    }
  }
}

export default user
