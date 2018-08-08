import Mock from 'mockjs'

Mock.mock('http://127.0.0.1:9000/api/login', {
  name: '@name',
  roles: ['admin']
})

Mock.mock('/producerDict/list', {
  'content|1-10': [{
    'index|+1': 1,
    'id': '@index',
    'name': '@ctitle(5, 10)',
    'spell': '@first',
    'address': '@county(true)',
    'zipCode': '@zip',
    'email': '@email',
    'contacts': '@name()',
    'contactNumber': '17548376542',
    'enabled|1-2': true
  }]
})

Mock.mock('/producerDict/listAll', {
  'content|1-10': [{
    'index|+1': 1,
    'id': '@index',
    'name': '@ctitle(5, 10)',
    'spell': '@first',
    'address': '@county(true)',
    'zipCode': '@zip',
    'email': '@email',
    'contacts': '@name()',
    'contactNumber': '17548376542',
    'enabled|1-2': true
  }]
})

Mock.mock('/instrumentType/list', {
  'content|1-10': [{
    'index|+1': 1,
    'id': '@index',
    'name': '@ctitle(5, 10)',
    'spell': '@first',
    'contacts': '@name()',
    'contactNumber': '17548376542',
    'enabled|1-2': true
  }]
})

Mock.mock('http://localhost:8088/api/browse/get', {
  'content|1-10': [{
    'index|+1': 1,
    'id': '@index',
    'name': '@ctitle(5, 10)',
    'spell': '@first',
    'enabled|1-2': true,
    'producerDict': {
      'id|1-3': 1,
      'name': '@ctitle(5, 10)'
    },
    'instrumentType': {
      'id|1-3': 1,
      'name': '@ctitle(5, 10)'
    },
    'specs': '18mm * 6',
    'repairTime': '@date',
    'scrapTime': '@date'
  }]
})

Mock.mock('http://localhost:8088/api/instrumentAbnormal/list', {
  'content|1-10': [{
    'index|+1': 1,
    'id': '@index',
    'name': '@ctitle(5, 10)',
    'spell': '@first',
    'enabled|1-2': true,
    'producerDict': {
      'id|1-3': 1,
      'name': '@ctitle(5, 10)'
    },
    'instrumentType': {
      'id|1-3': 1,
      'name': '@ctitle(5, 10)'
    },
    'specs': '18mm * 6',
    'repairTime': '@date',
    'scrapTime': '@date'
  }]
})

Mock.mock('http://localhost:8088/api/instrumentAbnormal/list', {
  'content|1-10': [{
    'index|+1': 1,
    'id': '@index',
    'name': '@ctitle(5, 10)',
    'spell': '@first',
    'enabled|1-2': true,
    'producerDict': {
      'id|1-3': 1,
      'name': '@ctitle(5, 10)'
    },
    'instrumentType': {
      'id|1-3': 1,
      'name': '@ctitle(5, 10)'
    },
    'specs': '18mm * 6',
    'repairTime': '@date',
    'scrapTime': '@date'
  }]
})

Mock.mock('/instrumentLogs/list', {
  'content|1-10': [{
    'index|+1': 1,
    'id': '@index',
    'name': '@ctitle(5, 10)',
    'spell': '@first',
    'enabled|1-2': true,
    'producerDict': {
      'id|1-3': 1,
      'name': '@ctitle(5, 10)'
    },
    'instrumentType': {
      'id|1-3': 1,
      'name': '@ctitle(5, 10)'
    },
    'specs': '18mm * 6',
    'repairTime': '@date',
    'scrapTime': '@date'
  }]
})

Mock.mock('/instrumentBoxList/list', {
  'content|1-10': [{
    'index|+1': 1,
    'id': '@index',
    'boxNumber': /\d{10,10}/,
    'boxUniqueNumber': /\d{10,10}/,
    'operator': '@name',
    'instrumentList|1-3': [
      '1',
      '2',
      '3'
    ],
    'deviceStatus|1': [1, 0],
    'rfidStatus|1': [1, 0],
    'lockStatus|1': [1, 0],
    'readerStatus|1': [1, 0],
    'fingerprintStatus|1': [1, 0],
    'registrationTime': '@date'
  }]
})

Mock.mock('/instrumentBoxStatus/list', {
  'content|1-30': [{
    'index|+1': 1,
    'id': '@index',
    'boxNumber': /\d{10,10}/,
    'boxUniqueNumber': /\d{10,10}/,
    'operator': '@name',
    'lastSyncTime': '@date',
    'status|1': [1, 0],
    'toolSum|1-100': 0
  }]
})
// 人员基本信息
Mock.mock('http://127.0.0.1:8088/api/User/detail', {
  'content|1': [{
    'name': '@name',
    'Id|+1': 1,
    'userCode|+1': 100,
    'pinyin': '@name',
    'loginName': '@name',
    'password|1': [1, 0],
    'department': '@name',
    'phone': '@date',
    'isLoginBypsw|1': [1, 0],
    'isUse|1': [1, 0],
    'isLock|1': [1, 0]
  }]
})
// 指纹卡片
Mock.mock('http://127.0.0.1:8088/api/User/fingerprintCard', {
  'content|1-10': [{
    'number|+1': 1,
    'peopleId|+1': 100,
    'name': '@name',
    'certificateType|1': [1, 0],
    'cardInfo': '@name',
    'registerTime': '@date',
    'invalidTime': '@date',
    'register': '@name',
    'deviceId': '@index'
  }]
})
// 器械柜
Mock.mock('http://127.0.0.1:8088/api/User/instrumentCabinet', {
  'content|1-10': [{
    'belongList|+1': 1,
    'uniqueCode|+1': 100,
    'synStatus|1': [1, 0],
    'cabineFinger|1': [1, 0],
    'cabineCardRender|1': [1, 0],
    'cabineLockStatus|1': [1, 0],
    'cabinetRFIDStatus|1': [1, 0],
    'cabinetEquipStatus|1': [1, 0],
    'Operator': '@name',
    'code': '@date',
    'num': '@date'
  }]
})
// 借用器械柜
Mock.mock('http://127.0.0.1:8088/api/User/borrowInstrumentCabinet', {
  'content|1-10': [{
    'belongList|+1': 1,
    'uniqueCode|+1': 100,
    'synStatus|1': [1, 0],
    'cabineFinger|1': [1, 0],
    'cabineCardRender|1': [1, 0],
    'cabineLockStatus|1': [1, 0],
    'cabinetRFIDStatus|1': [1, 0],
    'cabinetEquipStatus|1': [1, 0],
    'Operator': '@name',
    'code': '@date',
    'num': '@date'
  }]
})
// 客户端设备查询
Mock.mock('http://127.0.0.1:8088/api/User/clientList', {
  'content|1-10': [{
    'num|+1': 1,
    'name': '@name',
    'addString': '@name',
    'desc': '@name'
  }]
})
// 维修申请列表
Mock.mock('http://127.0.0.1:8088/api/Repair/checkList', {
  'content|1-10': [{
    'num|+1': 14456436,
    'applyDesc': '@name',
    'applyStatus': '@name',
    'applyTime': '@date',
    'applyStatus|1': [1, 0, 2],
    'checker': '@name',
    'checkTime': '@date',
    'checkDes': '@name',
    'taker': '@name',
    'takerDes': '@name',
    'finishLoginer': '@name',
    'finishDes': '@name',
    'takerTime': '@date',
    'finishTime': '@date'
  }]
})
// 维修申请列表
Mock.mock('http://127.0.0.1:8088/api/Reject/checkList', {
  'content|1-10': [{
    'num|+1': 1,
    'Id|+1': 1,
    'applyer': '@name',
    'applyTime': '@date',
    'applyStatus|1': [1, 0],
    'checker': '@name',
    'checkTime': '@date',
    'checkDes': '@name',
    'taker': '@name',
    'takerTime': '@date',
    'takerDes': '@name',
    'doer': '@name',
    'doDes': '@name',
    'doTime': '@date'
  }]
})
// 器械柜列表
Mock.mock('http://127.0.0.1:8088/api/InstrumentCabine/findAllByPage1', {
  'totalElements': 100,
  'content|1-10': [{
    'id|+1': 1,
    'cabineCode|+1': 1,
    'uniquenessCode|+1': 1
  }]
})
// 保养计划列表
Mock.mock('http://127.0.0.1:8088/api/maintain/findAllPlanList', {
  'content|1-10': [{
    'num|+1': 1,
    'Id|+1': 1,
    'name': '@name',
    'maintaintype|1': [1, 0],
    'maintainCyc|1': [1, 0],
    'maintainUnit': '@name',
    'warning': '@date',
    'isUse|1': [1, 0],
    'createTime': '@date',
    'createP': '@name',
    'lastMdfTime': '@date'
  }]
})
// 保养计划器械字典详情
Mock.mock('http://127.0.0.1:8088/api/maintain/maintainDicDetail', {
  'content|1-10': [{
    'num|+1': 1,
    'Id|+1': 1,
    'pinyin': '@name',
    'instrumentType|1': [1, 0],
    'pruductor|1': [1, 0],
    'format': '@name',
    'checkTime': '@date',
    'registTime|1': [1, 0],
    'isUse': '@date',
    'creator': '@name',
    'creatTime': '@date',
    'updater': '@name',
    'updateTime': '@date'
  }]
})
// 保养计划详情
Mock.mock('http://127.0.0.1:8088/api/maintain/maintainPlanDetail', {
  'content|1': [{
    'name': '@name',
    'Id|+1': 1,
    'userCode|+1': 100,
    'pinyin': '@name',
    'loginName': '@name',
    'password|1': [1, 0],
    'department': '@name',
    'phone': '@date',
    'isLoginBypsw|1': [1, 0],
    'isUse|1': [1, 0],
    'isLock|1': [1, 0]
  }]
})
// 保养计划详情
Mock.mock('http://127.0.0.1:8088/api/maintain/maintainPlanDetail', {
  'content|1': [{
    'name': '@name',
    'Id|+1': 1,
    'userCode|+1': 100,
    'pinyin': '@name',
    'loginName': '@name',
    'password|1': [1, 0],
    'department': '@name',
    'phone': '@date',
    'isLoginBypsw|1': [1, 0],
    'isUse|1': [1, 0],
    'isLock|1': [1, 0]
  }]
})
// 器械登记列表
Mock.mock('http://127.0.0.1:8088/api/Instruments/instrumentRegist', {
  'content|1-10': [{
    'name': '@name',
    'index|+1': 1,
    'pinyin|+1': 100,
    'instrumentType': '@name',
    'productor': '@name',
    'format|1': [1, 0],
    'checkTime': '@name',
    'rejectTime': '@date',
    'isUse|1': [1, 0],
    'creater|1': [1, 0],
    'createTime|1': [1, 0],
    'updater|1': [1, 0],
    'updateTime|1': [1, 0],
    'numbers|1': [1, 0],
    'codes|1': [1, 0]
  }]
})
// 器械借用列表
Mock.mock('http://127.0.0.1:8088/api/storeRoomManagement/borrowList', {
  'content|1-10': [{
    'index|+1': 1,
    'instrumentRoom': '@name',
    'instrument': '@name',
    'borrowTime': '@date',
    'borrowP': '@name',
    'borrowDepartment': '@name',
    'borrowByPeople': '@name',
    'preReturnTime': '@date',
    'isOverTime|1': [1, 0],
    'isComplete|1': [1, 0]
  }]
})
// 器械归还列表
Mock.mock('http://127.0.0.1:8088/api/storeRoomManagement/returnList', {
  'content|1-10': [{
    'index|+1': 1,
    'id|+1': 100,
    'instrumentRoom': '@name',
    'instrument': '@name',
    'borrowTime': '@date',
    'borrowP': '@name',
    'borrowDepartment': '@name',
    'borrowByP': '@name',
    'preReturnTime': '@date',
    'returnTime': '@date',
    'returnByP': '@name',
    'isOverTime|1': [1, 0],
    'isComplete|1': [1, 0]
  }]
})
// 器械逾期列表
Mock.mock('http://127.0.0.1:8088/api/storeRoomManagement/overtimeList', {
  'content|1-10': [{
    'index|+1': 1,
    'id|+1': 100,
    'instrumentRoom': '@name',
    'instrument': '@name',
    'borrowTime': '@date',
    'borrowP': '@name',
    'borrowDepartment': '@name',
    'borrowByP': '@name',
    'preReturnTime': '@date'
  }]
})
// 库房器械借用情况列表
Mock.mock('http://127.0.0.1:8088/api/storeRoomManagement/instrumentList', {
  'content|1-10': [{
    'index|+1': 1,
    'instrumentRoom': '@name',
    'instrument': '@name',
    'borrowTime': '@date',
    'borrowP': '@name',
    'borrowDepartment': '@name',
    'borrowByPeople|1': [1, 0],
    'preReturnTime': '@date',
    'returnTime': '@date',
    'returnByP': '@name',
    'isOverTime|1': [1, 0],
    'isComplete|1': [1, 0]
  }]
})
