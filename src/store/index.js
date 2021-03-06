/**
 * Created by Kotori on 2017/8/7.
 */

import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import permission from './modules/permission'
import user from './modules/user'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    permission,
    user,
    app
  },
  getters
})

export default store
