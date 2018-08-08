/**
 * Created by Kotori on 2017/5/16.
 */

import axios from 'axios'
// import mock from '../mock/mock'
import { Message } from 'element-ui'

let base = '/api'

// 响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response
}, function (error) {
  // 对响应错误做点什么
  if (error.response) {
    if (error.response.status === 400) {
      Message.error({
        message: error.response.data.message
      })
    }
  } else {
    return Promise.reject(error)
  }
})

export const Login = {
  login: (params) => {
    return axios.post(`${base}/login`, params).then(res => res.data)
  },
  getUserInfo: (params) => {
    return axios.get(`${base}/users/getcurrentuser`, params).then(res => res.data)
  }
}

export const producerDict = {
  findAllForPage: (params) => {
    return axios.get(`${base}/producers/findallbypage`, params).then(res => res.data)
  },
  save: (params) => {
    return axios.post(`${base}/producers`, params).then(res => res.data)
  },
  update: (id, params) => {
    return axios.put(`${base}/producers/${id}`, params).then(res => res.data)
  },
  opStopFlag: (params) => {
    return axios.put(`${base}/producers/opStopFlag`, params).then(res => res.data)
  },
  findAllNoPage: (params) => {
    return axios.get(`${base}/producers`, params).then(res => res.data)
  },
  exportExcel: (params) => {
    return axios.get(`${base}/producers/exportExcel`, params, {responseType: 'stream'}).then(res => res.data)
  }
}

export const instrumentType = {
  findAllForPage: (params) => {
    return axios.get(`${base}/instrumenttypes/findallforpage`, params).then(res => res.data)
  },
  save: (params) => {
    return axios.post(`${base}/instrumenttypes`, params).then(res => res.data)
  },
  updateVendor: (id, params) => {
    return axios.put(`${base}/instrumenttypes/${id}`, params).then(res => res.data)
  },
  opStopFlag: (params) => {
    return axios.put(`${base}/instrumenttypes/opStopFlag`, params).then(res => res.data)
  },
  findAllNoPage: (params) => {
    return axios.get(`${base}/instrumenttypes`, params).then(res => res.data)
  }
}

export const instrumentDict = {
  findAllForPage: (params) => {
    return axios.get(`${base}/instrumentdicts/findallforpage`, params).then(res => res.data)
  },
  save: (params) => {
    return axios.post(`${base}/instrumentdicts`, params).then(res => res.data)
  },
  updateVendor: (id, params) => {
    return axios.post(`${base}/instrumentdicts/${id}/update`, params).then(res => res.data)
  },
  opStopFlag: (params) => {
    return axios.put(`${base}/instrumentdicts/opStopFlag`, params).then(res => res.data)
  },
  findByType: (params) => {
    return axios.get(`${base}/instrumentdicts/findAllByType/${params}`).then(res => res.data)
  },
  findAll: (params) => {
    return axios.get(`${base}/instrumentdicts`, params).then(res => res.data)
  },
  findByDictId: (id, params) => {
    return axios.get(`${base}/instrumentdicts/${id}/instruments`, params).then(res => res.data)
  },
  findImgById: (id, params) => {
    return axios.get(`${base}/instrumentdicts/${id}/image`, params).then(res => res.data)
  }
}

export const department = {
  findAll: (params) => {
    return axios.get(`${base}/departments`, params).then(res => res.data)
  },
  findAllByPage: (params) => {
    return axios.get(`${base}/departments/findallbypage`, params).then(res => res.data)
  },
  save: (params) => {
    return axios.post(`${base}/departments`, params).then(res => res.data)
  },
  update: (id, params) => {
    return axios.put(`${base}/departments/${id}`, params).then(res => res.data)
  },
  findUserByDeptId: (id) => {
    return axios.get(`${base}/departments/${id}/employees`).then(res => res.data)
  }
}

export const instrumentloan = {
  loan: (storeId, params) => {
    return axios.post(`${base}/instrumentloans/${storeId}`, params).then(res => res.data)
  },
  back: (storeId, params) => {
    return axios.put(`${base}/instrumentloans/${storeId}`, params).then(res => res.data)
  },
  findByRfid: (params) => {
    return axios.get(`${base}/instrumentloans/findbyrfid`, params).then(res => res.data)
  },
  getoverdue: (params) => {
    return axios.get(`${base}/instrumentloans/getoverdue`, params).then(res => res.data)
  },
  findByPage: (params) => {
    return axios.get(`${base}/instrumentloans/findbypage`, params).then(res => res.data)
  },
  findByUserId: (id, params) => {
    return axios.get(`${base}/instrumentloans/findByLoanUser/${id}`, params).then(res => res.data)
  },
  lost: (params) => {
    return axios.put(`${base}/instrumentloans/loseInstrument`, params).then(res => res.data)
  }
}

export const role = {
  findAll: (params) => {
    return axios.get(`${base}/Department/findAll`, params).then(res => res.data)
  },
  list: (params) => {
    return axios.get(`${base}/roles`, params).then(res => res.data)
  },
  findAllForPage: (params) => {
    return axios.get(`${base}/roles/findallpage`, params).then(res => res.data)
  },
  save: (params) => {
    return axios.post(`${base}/roles`, params).then(res => res.data)
  },
  update: (id, params) => {
    return axios.put(`${base}/roles/${id}`, params).then(res => res.data)
  }
}

export const user = {
  findOne: (id) => {
    return axios.get(`${base}/users/${id}`).then(res => res.data)
  },
  findIsLock: (params) => {
    return axios.get(`${base}/users/islock`, params).then(res => res.data)
  },
  findAll: (params) => {
    return axios.get(`${base}/users`, params).then(res => res.data)
  },
  findAllForPage: (params) => {
    return axios.get(`${base}/users/findallpage`, params).then(res => res.data)
  },
  add: (params) => {
    return axios.post(`${base}/users`, params).then(res => res.data)
  },
  update: (id, params) => {
    return axios.put(`${base}/users/${id}`, params).then(res => res.data)
  },
  findAllForfingerCard: (params) => {
    // return axios.get(`${base}/User/fingerprintCard`, params).then(res => res.data)
    return axios.get(`${base}/User/fingerprintCard`).then(res => res.data)
  },
  detail: (params) => {
    return axios.get(`${base}/users/${params}`).then(res => res.data)
  },
  instrumentCabinet: (params) => {
    return axios.post(`${base}/User/instrumentCabinet`).then(res => res.data)
  },
  borrowInstrumentCabinet: (params) => {
    return axios.post(`${base}/User/borrowInstrumentCabinet`).then(res => res.data)
  },
  clientList: (params) => {
    return axios.post(`${base}/User/clientList`).then(res => res.data)
  },
  setmypass: (params) => {
    return axios.put(`${base}/users/setmypass`, params).then(res => res.data)
  },
  setdefaultpass: (id) => {
    return axios.put(`${base}/users/${id}/setdefaultpass`).then(res => res.data)
  },
  icCard: (id, params) => {
    return axios.get(`${base}/user/${id}/iccard`, params).then(res => res.data)
  },
  addIcCard: (id, params) => {
    return axios.post(`${base}/user/${id}`, params).then(res => res.data)
  },
  delIcCard: (id) => {
    return axios.delete(`${base}/user/${id}`).then(res => res.data)
  },
  finger: (id, params) => {
    return axios.get(`${base}/user/${id}/finger`, params).then(res => res.data)
  }
}

export const permission = {
  findAll: (params) => {
    return axios.get(`${base}/permissions`, params).then(res => res.data)
  },
  findAllByPage: (params) => {
    return axios.get(`${base}/Department/findAllByPage`, params).then(res => res.data)
  },
  save: (params) => {
    return axios.post(`${base}/Role/add`, params).then(res => res.data)
  },
  update: (params) => {
    return axios.put(`${base}/Department/update`, params).then(res => res.data)
  }
}

export const instruments = {
  save: (params) => {
    return axios.post(`${base}/instruments`, params).then(res => res.data)
  },
  updateList: (params) => {
    return axios.put(`${base}/instruments/updateList`, params).then(res => res.data)
  },
  findAll: (params) => {
    return axios.get(`${base}/instruments`, params).then(res => res.data)
  },
  list: (params) => {
    return axios.get(`${base}/instruments/findAllByPage`, params).then(res => res.data)
  },
  update: (id, params) => {
    return axios.put(`${base}/instruments/${id}`, params).then(res => res.data)
  },
  instrumentRegist: (params) => {
    return axios.get(`${base}/Instruments/instrumentRegist`).then(res => res.data)
  },
  findByRfid: (params) => {
    return axios.get(`${base}/instruments/findByRfid`, params).then(res => res.data)
  },
  findByRfidCode: (params) => {
    return axios.get(`${base}/instruments/findByRfidCode/${params}`).then(res => res.data)
  },
  findById: (id) => {
    return axios.get(`${base}/instruments/${id}`).then(res => res.data)
  },
  findByInstrument: (id, params) => {
    return axios.get(`${base}/instruments/${id}/logs`, params).then(res => res.data)
  },
  findMaintainByInstrument: (id, params) => {
    return axios.get(`${base}/instruments/${id}/maintainlogs`, params).then(res => res.data)
  },
  findRepairByInstrument: (id, params) => {
    return axios.get(`${base}/instruments/${id}/repairlogs`, params).then(res => res.data)
  },
  inventory: (params) => {
    return axios.get(`${base}/instruments/findInventory`, params).then(res => res.data)
  }
}

export const instrumentLogs = {
  list: (params) => {
    return axios.get(`${base}/instrumentLogs/list`).then(res => res.data)
  }
}

export const instrumentBoxList = {
  findAllByPage: (params) => {
    return axios.get(`${base}/cabinets/findAllByPage`, params).then(res => res.data)
  },
  add: (params) => {
    return axios.post(`${base}/InstrumentBoxList/add`, params).then(res => res.data)
  },
  update: (id, params) => {
    return axios.put(`${base}/cabinets/${id}`, params).then(res => res.data)
  },
  findAll: (params) => {
    return axios.get(`${base}/cabinets`, params).then(res => res.data)
  },
  findOne: (id) => {
    return axios.get(`${base}/cabinets/${id}`).then(res => res.data)
  },
  delete: (cid, uid) => {
    return axios.delete(`${base}/cabinets/${cid}/user/${uid}`).then(res => res.data)
  },
  addUser: (cid, uid) => {
    return axios.put(`${base}/cabinets/${cid}/user/${uid}`).then(res => res.data)
  },
  findByCabinetId: (id, params) => {
    return axios.get(`${base}/cabinets/${id}/instruments`, params).then(res => res.data)
  },
  waitExamine: (params) => {
    return axios.get(`${base}/cabinets/waitexamine`, params).then(res => res.data)
  },
  examine: (id) => {
    return axios.put(`${base}/cabinets/${id}/examine`).then(res => res.data)
  },
  logs: (id, params) => {
    return axios.get(`${base}/cabinets/${id}/logs`, params).then(res => res.data)
  }
}

export const instrumentBagInfo = {
  list: (params) => {
    return axios.get(`${base}/InstrumentBag/findAllByPage`, params).then(res => res.data)
  },
  add: (params) => {
    return axios.post(`${base}/InstrumentBag/save`, params).then(res => res.data)
  },
  update: (params) => {
    return axios.put(`${base}/InstrumentBag/update`, params).then(res => res.data)
  }
}

export const InterfaceGroups = {
  listAll: (params) => {
    return axios.get(`${base}/interfaceGroups/listAll`, params).then(res => res.data)
  },
  list: (params) => {
    return axios.get(`${base}/interfaceGroups/list`, params).then(res => res.data)
  },
  add: (params) => {
    return axios.post(`${base}/interfaceGroups/add`, params).then(res => res.data)
  },
  delete: (params) => {
    return axios.delete(`${base}/interfaceGroups/delete/${params}`).then(res => res.data)
  },
  update: (params) => {
    return axios.put(`${base}/interfaceGroups/update`, params).then(res => res.data)
  },
  findById: (params) => {
    return axios.get(`${base}/interfaceGroups/update/${params}`).then(res => res.data)
  }
}

export const InterFaces = {
  list: (params) => {
    return axios.get(`${base}/interfaces/list`, params).then(res => res.data)
  },
  add: (params) => {
    return axios.post(`${base}/interfaces/add`, params).then(res => res.data)
  },
  delete: (params) => {
    return axios.delete(`${base}/interfaces/delete/${params}`).then(res => res.data)
  },
  update: (params) => {
    return axios.put(`${base}/interfaces/update`, params).then(res => res.data)
  }
}

export const SamplingRecord = {
  add: (params) => {
    return axios.post(`${base}/samplingRecordController/add`, params).then(res => res.data)
  },
  findByInterfaces: (id, params) => {
    return axios.get(`${base}/samplingRecordController/findByInterfaces/${id}`, params).then(res => res.data)
  },
  queryByInterfaces: (id, params) => {
    return axios.get(`${base}/samplingRecordController/queryByInterfaces/${id}`, params).then(res => res.data)
  }
}

export const ReportStatistics = {
  queryStatisticsByDate: (params) => {
    return axios.post(`${base}/queryStatisticsByDate`, params).then(res => res.data)
  }
}

export const Marathon = {
  list: (params) => {
    return axios.get(`${base}/mc/marathonChronosStatus`, params).then(res => res.data)
  },
  add: (params) => {
    return axios.get(`${base}/mc/startNewAppById/${params}`).then(res => res.data)
  },
  delete: (params) => {
    return axios.get(`${base}/mc/deletebyappid/${params}`).then(res => res.data)
  }
}
// 维修
export const repair = {
  add: (params) => {
    return axios.post(`${base}/repairapplys`, params).then(res => res.data)
  },
  findByPage: (params) => {
    return axios.get(`${base}/repairapplys/findbypage`, params).then(res => res.data)
  },
  findOne: (id, params) => {
    return axios.get(`${base}/repairapplys/${id}`, params).then(res => res.data)
  },
  update: (id, params) => {
    return axios.put(`${base}/repairapplys/${id}`, params).then(res => res.data)
  },
  repairapplys: (params) => {
    return axios.get(`${base}/repairapplys/findInstrumentByRfid/${params}`).then(res => res.data)
  },
  rfidEnter: (params) => {
    return axios.put(`${base}/repairapplys/rfidEnter`, params).then(res => res.data)
  }
}
// 报废
export const scrap = {
  add: (params) => {
    return axios.post(`${base}/scrapapplys`, params).then(res => res.data)
  },
  findByPage: (params) => {
    return axios.get(`${base}/scrapapplys/findbypage`, params).then(res => res.data)
  },
  findOne: (id, params) => {
    return axios.get(`${base}/scrapapplys/${id}`, params).then(res => res.data)
  },
  update: (id, params) => {
    return axios.put(`${base}/scrapapplys/${id}`, params).then(res => res.data)
  }
}
// 保养
export const maintain = {
  findByPage: (params) => {
    return axios.get(`${base}/maintainplans/findbypage`, params).then(res => res.data)
  },
  add: (params) => {
    return axios.post(`${base}/maintainplans`, params).then(res => res.data)
  },
  findOne: (id, params) => {
    return axios.get(`${base}/maintainplans/${id}`, params).then(res => res.data)
  },
  findAllPlanList: (params) => {
    return axios.get(`${base}/maintain/findAllPlanList`).then(res => res.data)
  },
  maintainPlanDetail: (params) => {
    return axios.get(`${base}/maintain/maintainPlanDetail`).then(res => res.data)
  },
  maintainDicDetail: (params) => {
    return axios.get(`${base}/maintain/maintainDicDetail`).then(res => res.data)
  }
}

export const mainNotify = {
  findByPage: (params) => {
    return axios.get(`${base}/mainnotifys/findbypage`, params).then(res => res.data)
  },
  update: (params) => {
    return axios.put(`${base}/mainnotifys`, params).then(res => res.data)
  },
  findByRfid: (params) => {
    return axios.get(`${base}/mainnotifys/findByInstrumentId/${params}`).then(res => res.data)
  }
}

export const maintainlogs = {
  findByPage: (params) => {
    return axios.get(`${base}/maintainlogs/findbypage`, params).then(res => res.data)
  }
}

// 器械库房
export const storeRoom = {
  findAll: (params) => {
    return axios.get(`${base}/stores`, params).then(res => res.data)
  },
  add: (params) => {
    return axios.post(`${base}/stores`, params).then(res => res.data)
  },
  update: (id, params) => {
    return axios.put(`${base}/stores/${id}`, params).then(res => res.data)
  },
  findByPage: (params) => {
    return axios.get(`${base}/stores/findbypage`, params).then(res => res.data)
  },
  borrowList: (params) => {
    return axios.get(`${base}/storeRoomManagement/borrowList`).then(res => res.data)
  },
  returnList: (params) => {
    return axios.get(`${base}/storeRoomManagement/returnList`).then(res => res.data)
  },
  overtimeList: (params) => {
    return axios.get(`${base}/storeRoomManagement/overtimeList`).then(res => res.data)
  },
  instrumentList: (params) => {
    return axios.get(`${base}/storeRoomManagement/instrumentList`).then(res => res.data)
  }
}

// 报表
export const report = {
  loan: (params) => {
    return axios.get(`${base}/reportLoanEntitys`, params).then(res => res.data)
  },
  op: (params) => {
    return axios.get(`${base}/reportEntitys`, params).then(res => res.data)
  }
}

export const instrumentAbnormal = {}

export const epcHelper = {
  getEpc: (params) => {
    return axios.get(`${base}/epc/newone`, params).then(res => res.data)
  }
}
