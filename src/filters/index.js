import moment from 'moment/moment'
// 器械状态格式化
export function parseInstrumentStatus (state) {
  const status = ['初始化', '登记', '借用', '归还', '申请维修', '申请维修作废', '待维修', '维修完成', '申请报废', '申请报废作废', '待报废', '报废', '损坏', '丢失']
  return state >= status.length ? '未知' : status[state]
}

// 保养类型格式化
export function parseMaintainType (state) {
  const status = ['类型1', '类型2', '类型3']
  return state >= status.length ? '未知' : status[state]
}

// 操作类型格式化
export function parseOperationType (state) {
  const status = ['注册', '分配', '分配至器械柜', '器械柜取出', '器械柜放入', '取消器械柜分配状态', '分配至器械库房', '从库房借出', '借出的工具归还到库房', '维修', '保养', '报废']
  return state >= status.length ? '未知' : status[state]
}

// 维修结果格式化
export function parseInsRepairStateType (state) {
  const status = ['等待维修', '损坏过于严重而无法维修', '维修成功']
  return state >= status.length ? '未知' : status[state]
}

// 器械柜状态格式化
export function parseCabinetStateType (state) {
  const status = ['未审批', '使用', '损坏', '暂停使用', '报废']
  return state >= status.length ? '未知' : status[state]
}

// 器械柜操作状态格式化
export function parseCabinetOpStateType (state) {
  const status = ['开锁', '关锁', '打开抽屉', '关闭抽屉', '取出器械', '归还器械', '申请注册', '审核通过', '注册成功', '损坏', '暂停使用', '报废']
  return state >= status.length ? '未知' : status[state]
}

// 时间格式化
export function parseDate (time) {
  return moment(time).format('YYYY-MM-DD')
}

// 维修申请单状态格式化
export function parseRepairType (state, confirm) {
  if (state === 0) {
    return '待审核'
  } else if (state === 1) {
    return confirm ? '待确认' : '已拒绝'
  } else if (state === 2) {
    return '已确认'
  } else if (state === 3) {
    return '部分确认'
  }
  return '未知'
}
