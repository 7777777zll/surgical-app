/**
 * 用来存放用户信息
 **/

const app = {
  state: {
    sidebar: true
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      state.sidebar = !state.sidebar
    }
  },
  actions: {
    ToggleSideBar: ({ commit }) => {
      commit('TOGGLE_SIDEBAR')
    }
  }
}

export default app
