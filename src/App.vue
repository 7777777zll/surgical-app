<template>
  <div id="app">
    <transition>
      <router-view ref="layout"></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'app',
  mounted () {
    // 注册事件, 供调用
    // TODO 指纹验证失败, 指纹采集后不匹配
    window.newEpc = epc => {
      let control = this.$refs['layout'].$refs['main-control']
      let routes = ['/storeRoomManagement/instrumentUseStatus', '/instrumentManagement/instrumentInformation', '/rejectManagement/rejectApply', '/repairManagement/repairApply', '/maintainManagement/maintainEnter', '/repairManagement/repairEnter', '/instrumentManagement/queryInstrument']
      let funs = ['getInstrument', 'pushRfid', 'getInstrument', 'getInstrument', 'onSubmit', 'onSubmit', 'getInstrument']
      // 判断当前页面是否需要
      let index = routes.indexOf(this.$route.path)
      if (index !== -1) {
        control[funs[index]](epc)
      }
    }
    window.fingerVerificationRet = userCode => {
      console.log(userCode)
      let control = this.$refs['layout'].$refs['main-control']
      let routes = ['/storeRoomManagement/instrumentUseStatus', '/storeRoomManagement/loseInstrumentSearch']
      let funs = ['getUser', 'getUser']
      let index = routes.indexOf(this.$route.path)
      if (index !== -1) {
        control[funs[index]](userCode)
      }
    }
    window.fingerVerificationFail = () => {
      let control = this.$refs['layout'].$refs['main-control']
      if (this.$route.path === '/storeRoomManagement/instrumentUseStatus') {
        control.fingerErr()
      }
    }
    window.showFingerRegister = msg => {
      let control = this.$refs['layout'].$refs['main-control']
      if (this.$route.path.indexOf('/fingerDetail/') === 0) {
        control.fingerReg(msg)
      }
    }
    window.fingerRegisterSuccess = finger => {
      let control = this.$refs['layout'].$refs['main-control']
      if (this.$route.path.indexOf('/fingerDetail/') === 0) {
        control.getFinger(finger)
      }
    }
    window.fingerRecivedError = () => {
      console.log('fingerRecivedError')
    }
  }
}
</script>

<style>
 *{
  padding: 0px;
  margin: 0px;
 }

#app {
 font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  font-size: 14px;
}
  .table-detail{
    width: 100%;
    max-width: 100%;
    border-spacing: 0;
    border-collapse: collapse;
  }
 .table-detail .title{
   font-weight: bold;
 }
 .table-fix-bottom{
   margin-bottom: 22px;
 }
 .table-fix-top{
   margin-top: 22px;
 }
 .table-detail td,.table-detail th{
   width : 146px;
   height:30px;
   background-color:#fff;
 }
 .table-detail th,.table-detail td{
   border:1px solid #ddd!important
 }
 .table-bordered th,.table-bordered td{
   border:1px solid #ddd!important
 }
 .table-bordered {
   border: 1px solid #ddd;
 }
 .table-bordered > thead > tr > th, .table-bordered > tbody > tr > th, .table-bordered > tfoot > tr > th, .table-bordered > thead > tr > td, .table-bordered > tbody > tr > td, .table-bordered > tfoot > tr > td {border: 1px solid #ddd;}
 .table-detail > thead > tr > th, .table-detail > tbody > tr > th, .table-detail > tfoot > tr > th, .table-detail > thead > tr > td, .table-detail > tbody > tr > td, .table-detail > tfoot > tr > td {
   padding: 5px;
   line-height: 1.42857143;
   vertical-align: middle;
   border-top: 1px solid #ddd;
 }

</style>
