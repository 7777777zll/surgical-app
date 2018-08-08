import Vue from 'vue'
import Router from 'vue-router'
import Error404 from '../views/error/404.vue'
import Login from '../views/Login.vue'
import Layout from '../views/layout/Layout.vue'
import HomePage from '../views/homePage/index.vue'
import ProducerDict from '../views/basicInformation/producerDict.vue'
import InstrumentType from '../views/basicInformation/instrumentType.vue'
import InstrumentDict from '../views/basicInformation/instrumentDict.vue'
import InstrumentBoxList from '../views/instrumentBox/instrumentBoxList.vue'
import InstrumentBoxExamine from '../views/instrumentBox/instrumentBoxExamine.vue'
// import instrumentBoxStatus from '../views/instrumentBox/instrumentBoxStatus.vue'
import instrumentBoxDetail from '../views/instrumentBox/instrumentBoxDetail.vue'
// import InstrumentBagInfo from '../views/instrumentBag/instrumentBagInfo.vue'
// import BasicInformation from '../views/systemManager/index.vue'
import UserGroupManagement from '../views/systemManager/userGroupManagement.vue'
import peopleManagement from '../views/systemManager/peopleManagement.vue'
import peopleDetail from '../views/systemManager/peopleDetail.vue'
import clientDeviceConfiguration from '../views/systemManager/clientDeviceConfiguration.vue'
import DepartmentManagement from '../views/systemManager/departmentManagement.vue'
import VoucherManagement from '../views/systemManager/voucherManagement.vue'
import Browse from '../views/instrumentManagement/browse.vue'
import Inventory from '../views/instrumentManagement/inventory.vue'
import QueryInstrument from '../views/instrumentManagement/queryInstrument.vue'
// import InstrumentOverhaul from '../views/instrumentManagement/instrumentOverhaul.vue'
import InstrumentInformation from '../views/instrumentManagement/instrumentInformation.vue'
// import InstrumentAbnormal from '../views/instrumentManagement/instrumentAbnormal.vue'
// import InstrumentLogs from '../views/instrumentManagement/instrumentLogs.vue'
import instrumentUseStatus from '../views/storeRoomManagement/instrumentUseStatus.vue'
import storeManagement from '../views/storeRoomManagement/storeManagement.vue'
// import instrumentReturn from '../views/storeRoomManagement/instrumentReturn.vue'
import instrumentOvertime from '../views/storeRoomManagement/instrumentOvertime.vue'
import instrumentOvertimeDetail from '../views/storeRoomManagement/instrumentOvertimeDetail.vue'
import instrumentSearch from '../views/storeRoomManagement/instrumentSearch.vue'
import loseInstrumentSearch from '../views/storeRoomManagement/loseInstrumentSearch.vue'
import instrumentBorrowDetail from '../views/storeRoomManagement/instrumentBorrowDetail.vue'
import instrumentReturnDetail from '../views/storeRoomManagement/instrumentReturnDetail.vue'
import instrumentListDetail from '../views/storeRoomManagement/instrumentListDetail.vue'
import instrumentDetail from '../views/instrumentManagement/instrumentDetail.vue'
import icCardDetail from '../views/systemManager/icCardDetail.vue'
import fingerDetail from '../views/systemManager/fingerDetail.vue'
import repairApply from '../views/repairManagement/repairApply.vue'
import repairConfirm from '../views/repairManagement/repairConfirm.vue'
import repairEnter from '../views/repairManagement/repairEnter.vue'
import repairConfirmDetail from '../views/repairManagement/repairConfirmDetail.vue'
import repairSearchDetail from '../views/repairManagement/repairSearchDetail.vue'
import repairSearch from '../views/repairManagement/repairSearch.vue'
import repairApprove from '../views/repairManagement/repairApprove.vue'
import repairApproveDetail from '../views/repairManagement/repairApproveDetail.vue'
import maintainPlan from '../views/maintainManagement/maintainPlan.vue'
import maintainPlanDetail from '../views/maintainManagement/maintainPlanDetail.vue'
import maintainList from '../views/maintainManagement/maintainList.vue'
import maintainEnter from '../views/maintainManagement/maintainEnter.vue'
import maintainWarning from '../views/maintainManagement/maintainWarning.vue'
import rejectApply from '../views/rejectManagement/rejectApply.vue'
import rejectCheck from '../views/rejectManagement/rejectCheck.vue'
import rejectCheckDetail from '../views/rejectManagement/rejectCheckDetail.vue'
import rejectConfirm from '../views/rejectManagement/rejectConfirm.vue'
import rejectConfirmDetail from '../views/rejectManagement/rejectConfirmDetail.vue'
import rejectSearch from '../views/rejectManagement/rejectSearch.vue'
import rejectSearchDetail from '../views/rejectManagement/rejectSearchDetail.vue'
import loanReturnReport from '../views/reportForms/loanReturnReport.vue'
import repairReport from '../views/reportForms/repairReport.vue'

Vue.use(Router)

/**
 *  自定义组件
 *  icon: 菜单图标
 *  hidden: 是否显示
 *  redirect: 重定向地址
 *  notSon: 是否有子节点
* */

// 通用路由
export const constantRouter = [
  { path: '/login', component: Login, hidden: true },
  { path: '/404', component: Error404, hidden: true }
]

// 根据权限的私有路由
export const asyncRouter = [
  { path: '/', component: Layout, redirect: '/homePage/index', hidden: true },
  {
    path: '/homePage',
    component: Layout,
    name: '首页',
    icon: 'fa fa-home',
    redirect: 'index',
    notSon: true,
    children: [
      { path: 'index', component: HomePage, name: '首页', code: '8a2d66a88acf4d40a7d1e926d5c83f9d' }
    ]
  },
  {
    path: '/basicInformation',
    component: Layout,
    name: '器械基础信息',
    icon: 'fa fa-info-circle',
    redirect: 'producerDict',
    children: [
      { path: 'producerDict', component: ProducerDict, name: '器械生产商字典', code: '5a809baac0df459b877687be710e749a' },
      { path: 'instrumentType', component: InstrumentType, name: '器械类型', code: 'bc7952cc7a924bbfba005fd655c0c641' },
      { path: 'instrumentDict', component: InstrumentDict, name: '器械字典', code: '3249bbd412e54c05bbb1a11d9715555a' }
    ]
  },
  {
    path: '/instrumentManagement',
    component: Layout,
    name: '器械管理',
    icon: 'fa fa-wrench',
    redirect: 'checkIn',
    children: [
      { path: 'instrumentInformation', component: InstrumentInformation, name: '器械登记', meta: { role: ['device'] }, code: '4611f5baf04248e9a9dc2b1e7b451809' },
      { path: 'browse', component: Browse, name: '器械浏览', code: '1ed310907f7b45fe896c4e81025f138a' },
      { path: 'inventory', component: Inventory, name: '库存查询', code: 'aa7cec82298d4b37ab1ea696bccb02f3' },
      { path: 'queryInstrument', component: QueryInstrument, name: '器械查询', code: 'b44e208e615e488c9f95d7546869a365' }
      // { path: 'instrumentOverhaul', component: InstrumentOverhaul, name: '器械检修查询' },
      // { path: 'instrumentAbnormal', component: InstrumentAbnormal, name: '器械异常查询' },
      // { path: 'instrumentLogs', component: InstrumentLogs, name: '器械日志浏览' }
    ]
  },
  {
    path: '/instrumentBoxManagement',
    component: Layout,
    name: '器械柜管理',
    icon: 'fa fa-list',
    redirect: 'instrumentBoxList',
    children: [
      { path: 'instrumentBoxExamine', component: InstrumentBoxExamine, name: '器械柜注册审核', code: '7e72569b6fee4309b659799b485da64e' },
      { path: 'instrumentBoxList', component: InstrumentBoxList, name: '器械柜查询/列表浏览', code: '123685efb5b54b5ab2ea7183a0f6eff6' }
      // { path: 'instrumentBoxStatus', component: instrumentBoxStatus, name: '器械柜状态监控' },
      // { path: 'index', component: BasicInformation, name: '器械柜使用信息统计' }
    ]
  },
  {
    path: '/storeRoomManagement',
    component: Layout,
    name: '器械库房管理',
    icon: 'fa fa-university',
    redirect: 'storeManagement',
    children: [
      { path: 'storeManagement', component: storeManagement, name: '库房管理', code: '43cc77dc3386490abc8dd3c498435e24' },
      { path: 'instrumentUseStatus', component: instrumentUseStatus, name: '器械借用', meta: { role: ['device'] }, code: '12fa634887984ff4bb622eccad07feaf' },
      // { path: 'instrumentReturn', component: instrumentReturn, name: '器械归还' },
      { path: 'instrumentOvertime', component: instrumentOvertime, name: '逾期浏览', code: 'f1ba0bb9c83b4879bd14ae64a672ff9f' },
      { path: 'instrumentSearch', component: instrumentSearch, name: '借用查询', code: '8733a038709749e2a49fa000968bc236' },
      { path: 'loseInstrumentSearch', component: loseInstrumentSearch, name: '丢失补录', code: 'bd64c3fa3b1a42ff9da931dba0e38365' }
    ]
  },
  // {
  //   path: '/instrumentBagManagement',
  //   component: Layout,
  //   name: '智能器械包管理',
  //   icon: 'fa fa-medkit',
  //   redirect: 'instrumentBagInfo',
  //   children: [
  //     { path: 'instrumentBagInfo', component: InstrumentBagInfo, name: '器械包信息' },
  //     { path: 'index', component: BasicInformation, name: '器械包日志查询' }
  //   ]
  // },
  {
    path: '/maintainManagement',
    component: Layout,
    name: '保养管理',
    icon: 'fa fa-plug',
    redirect: 'maintainPlan',
    children: [
      { path: 'maintainPlan', component: maintainPlan, name: '保养计划', code: 'd064c5da9d9342caa2afb75a73c6ab68' },
      { path: 'maintainWarning', component: maintainWarning, name: '保养提醒', code: '5ba7b1eb04894739ae2502924fc63c60' },
      { path: 'maintainList', component: maintainList, name: '保养查询', code: 'ef4812a36c954da59d115a18c003d3d5' },
      { path: 'maintainEnter', component: maintainEnter, name: '扫码保养确认', code: '18e33cf1892d49de96ad85cb8cf3fc10' }
    ]
  },
  {
    path: '/repairManagement',
    component: Layout,
    name: '维修管理',
    icon: 'fa fa-wrench',
    redirect: 'repairApply',
    children: [
      { path: 'repairApply', component: repairApply, name: '维修申请', code: '6fc0f740de644cdaa505ccd681e28089' },
      { path: 'repairApprove', component: repairApprove, name: '维修审批', code: '7e36a4beaa684561854ad85131286f2d' },
      { path: 'repairConfirm', component: repairConfirm, name: '维修确认', code: 'caf0ba91d4534dd09d6b81194a9f5588' },
      { path: 'repairEnter', component: repairEnter, name: '扫码维修确认', code: 'f803e3197fb340e0af5f6b1e621e3ebf' },
      { path: 'repairSearch', component: repairSearch, name: '维修查询', code: 'aeb0b7a3bfc2417ab74f233b27ffd1f3' }
    ]
  },
  {
    path: '/rejectManagement',
    component: Layout,
    name: '报废管理',
    icon: 'fa fa-exclamation-triangle',
    redirect: 'rejectApply',
    children: [
      { path: 'rejectApply', component: rejectApply, name: '报废申请', code: '6722628d688246108dfbe167e9126456' },
      { path: 'rejectCheck', component: rejectCheck, name: '报废审批', code: '1bd0dda6d6bd4841b3487b8718cc2d77' },
      { path: 'rejectConfirm', component: rejectConfirm, name: '报废确认', code: 'a54e92ecb5624e12ae96ceb5be6698f8' },
      { path: 'rejectSearch', component: rejectSearch, name: '报废查询', code: 'a598c26290e1491da900896a412514cc' }
    ]
  },
  {
    path: '/reportForms',
    component: Layout,
    name: '报表',
    icon: 'fa fa-sticky-note',
    redirect: 'loanReturnReport',
    children: [
      { path: 'loanReturnReport', component: loanReturnReport, name: '借用归还报表', code: '9b31033827ba4d60afbb2594cf2e6215' },
      { path: 'repairReport', component: repairReport, name: '维修保养报表', code: '582473b6151e479ba0e52dcf16777edc' }
    ]
  },
  {
    path: '/systemManagement',
    component: Layout,
    name: '系统管理',
    icon: 'fa fa-cog',
    redirect: 'peopleManagement',
    children: [
      { path: 'peopleManagement', component: peopleManagement, name: '人员管理', code: '9868e69200904db0baa0f7af56569238' },
      { path: 'userGroupManagement', component: UserGroupManagement, name: '用户组管理', code: '12a8bca9d70d40848ddc909bfc29f07b' },
      { path: 'departmentManagement', component: DepartmentManagement, name: '部门管理', code: '69a2195cee8f40908b01bb37023647bb' },
      { path: 'voucherManagement', component: VoucherManagement, name: '凭证管理', code: '2f264b6bf57a48cf8a3a85594bff426b' },
      { path: 'clientDeviceConfiguration', component: clientDeviceConfiguration, name: '客户端设备配置', meta: { role: ['device'] }, code: '1B51E8DC-3047-4D16-9BF7-683EA5214E35' }
    ]
  },
  {
    path: '/peopleDetail/:id',
    component: Layout,
    name: '人员详情',
    redirect: '',
    children: [{ path: '', component: peopleDetail, name: '人员详情' }],
    hidden: true
  },
  {
    path: '/instrumentBoxDetail/:id',
    component: Layout,
    name: ' 器械柜详情',
    redirect: '',
    children: [{ path: '', component: instrumentBoxDetail, name: '器械柜详情' }],
    hidden: true
  },
  {
    path: '/maintainPlanDetail/:id',
    component: Layout,
    name: ' 保养计划详情',
    redirect: '',
    children: [{ path: '', component: maintainPlanDetail, name: '保养计划详情' }],
    hidden: true
  },
  {
    path: '/rejectCheckDetail/:id',
    component: Layout,
    name: ' 报废审批详情',
    redirect: '',
    children: [{ path: '', component: rejectCheckDetail, name: '报废审批详情' }],
    hidden: true
  },
  {
    path: '/rejectConfirmDetail/:id',
    component: Layout,
    name: ' 报废确认详情',
    redirect: '',
    children: [{ path: '', component: rejectConfirmDetail, name: '报废确认详情' }],
    hidden: true
  },
  {
    path: '/rejectSearchDetail/:id',
    component: Layout,
    name: ' 报废查询详情',
    redirect: '',
    children: [{ path: '', component: rejectSearchDetail, name: '报废查询详情' }],
    hidden: true
  },
  {
    path: '/repairApproveDetail/:id',
    component: Layout,
    name: ' 维修审批详情',
    redirect: '',
    children: [{ path: '', component: repairApproveDetail, name: '维修审批详情' }],
    hidden: true
  },
  {
    path: '/repairConfirmDetail/:id',
    component: Layout,
    name: ' 维修确认详情',
    redirect: '',
    children: [{ path: '', component: repairConfirmDetail, name: '维修确认详情' }],
    hidden: true
  },
  {
    path: '/repairSearchDetail/:id',
    component: Layout,
    name: ' 维修查询详情',
    redirect: '',
    children: [{ path: '', component: repairSearchDetail, name: '维修查询详情' }],
    hidden: true
  },
  {
    path: '/instrumentBorrowDetail/:id',
    component: Layout,
    name: ' 器械借用详情',
    redirect: '',
    children: [{ path: '', component: instrumentBorrowDetail, name: '器械借用详情' }],
    hidden: true
  },
  {
    path: '/instrumentReturnDetail/:id',
    component: Layout,
    name: ' 器械归还详情',
    redirect: '',
    children: [{ path: '', component: instrumentReturnDetail, name: '器械归还详情' }],
    hidden: true
  },
  {
    path: '/instrumentOvertimeDetail/:id',
    component: Layout,
    name: ' 逾期详情',
    redirect: '',
    children: [{ path: '', component: instrumentOvertimeDetail, name: '逾期详情' }],
    hidden: true
  },
  {
    path: '/instrumentListDetail/:id',
    component: Layout,
    name: ' 库房器械借用详情',
    redirect: '',
    children: [{ path: '', component: instrumentListDetail, name: '库房器械借用详情' }],
    hidden: true
  },
  {
    path: '/instrumentDetail/:id',
    component: Layout,
    name: ' 器械详情详情',
    redirect: '',
    children: [{ path: '', component: instrumentDetail, name: '器械详情详情' }],
    hidden: true
  },
  {
    path: '/icCardDetail/:id',
    component: Layout,
    name: ' 凭证管理',
    redirect: '',
    children: [{ path: '', component: icCardDetail, name: 'IC卡管理' }],
    hidden: true
  },
  {
    path: '/fingerDetail/:id',
    component: Layout,
    name: ' 指纹管理',
    redirect: '',
    children: [{ path: '', component: fingerDetail, name: '指纹管理' }],
    hidden: true
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouter
})
