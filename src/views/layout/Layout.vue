<template>
  <el-row class="container">
    <el-col :span="24" class="header">
      <el-col :span="10" class="logo" :class="sidebar ? 'logo-width' : 'logo-collapse-width' ">
      				{{sidebar ? sysName : '' }}
      </el-col>
      <el-col :span="10">
        <div class="tools" @click.prevent="collapse">
          <i class="fa fa-align-justify"></i>
        </div>
      </el-col>
      <el-col :span="4" class="userInfo">
        <div @click="screenfull" class="screenfull">
          <i class="fa fa-arrows-alt"></i>
        </div>
         <el-dropdown>
            <span class="el-dropdown-link userInfo-inner">
              <img src="../../assets/avatar.png" />{{name}}
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="updatePwd">密码修改</el-dropdown-item>
              <el-dropdown-item @click.native="logOut">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
      </el-col>
    </el-col>
    <el-col :span="24" class="main">
      <el-scrollbar
        tag="ul"
        ref="scrollbar"
        class="siderbar-scroll">
        <sidebar class="sidebar-container"></sidebar>
      </el-scrollbar>
      <section class="content-container">
        <div class="grid-content bg-purple-light">
          <el-col :span="24" class="breadcrumb-container">
            <strong class="title">{{$route.name}}</strong>
            <el-breadcrumb separator="/" class="breadcrumb-inner">
              <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
                {{ item.name }}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </el-col>
          <el-col :span="24" class="content-wrapper">
            <transition name="fade" mode="out-in">
              <router-view ref="main-control"></router-view>
            </transition>
          </el-col>
        </div>
      </section>
    </el-col>
    <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false" @close="refDialog('passwordForm')">
      <el-form label-width="100px" :model="passwordForm" :rules="passwordRules" ref="passwordForm">
        <el-form-item label="原密码" prop="old">
          <el-input type="password" v-model="passwordForm.old" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPsw">
          <el-input type="password" v-model="passwordForm.newPass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPsw">
          <el-input type="password" v-model="passwordForm.confirmPsw" auto-complete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click="pswOnSubmit" :loading="addLoading">确定</el-button>
        <el-button @click="pswResetForm('passwordForm')">重置</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>



<script>
  import screenfull from 'screenfull'
  import sidebar from './Sidebar'
  import moment from 'moment/moment'
  import { mapGetters } from 'vuex'
  import { user } from '../../api/api'

  export default {
    name: 'layout',
    components: {
      sidebar
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'name'
      ])
    },
    data () {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (this.passwordForm.confirmPsw !== '') {
            this.$refs.passwordForm.validateField('confirmPsw')
          }
          callback()
        }
      }
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.passwordForm.newPass) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      var obj = {
        addFormVisible: false,
        addLoading: false,
        collapsed: false,
        sysName: 'Rivamed',
        sysUserAvatar: './assets/logo.png',
        notifyMsg: {
          // 总数
          count: 12,
          // 当前显示类型
          type: 1,
          // exception 提示信息
          exception: '测试提示'
        },
        passwordForm: {
          old: '',
          newPass: '',
          confirmPsw: ''
        },
        passwordRules: {
          old: [
            { required: true, message: '请输入旧密码', trigger: 'blur' }
          ],
          newPass: [
            { required: true, validator: validatePass, trigger: 'blur' }
          ],
          confirmPsw: [
            { required: true, validator: validatePass2, trigger: 'blur' }
          ]
        }
      }
      return obj
    },
    methods: {
      refDialog (name) {
        this.$refs[name].resetFields()
      },
      collapse () {
        this.$store.dispatch('ToggleSideBar')
      },
      showMenu (i, status) {
        this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-' + i)[0].style.display = status ? 'block' : 'none'
      },
      handleOpen (key, keyPath) {
        console.log(key, keyPath)
      },
      handleClose (key, keyPath) {
        console.log(key, keyPath)
      },
      logOut () {
        this.$confirm('确认退出吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('LogOut').then(() => {
            console.info(123123)
            this.$router.push({ path: '/login' })
          }).catch(err => {
            this.$message.error(err) // 登录失败提示错误
          })
        }).catch(() => {
        })
      },
      notifyClick () {
        console.info(this.notifyMsg)
      },
      screenfull () {
        // var target = document.getElementsByClassName('content-container')[0]
        if (screenfull.enabled) {
          // 判断当前状态
          console.info()
          if ((this.sidebar && !screenfull.isFullscreen) || (!this.sidebar && screenfull.isFullscreen)) {
            this.$store.dispatch('ToggleSideBar')
          }
          // screenfull.request()
          screenfull.toggle()
        } else {
          // Ignore or do something else
        }
      },
      updatePwd () {
        this.addFormVisible = true
      },
      pswResetForm () {
        this.$refs.passwordForm.resetFields()
      },
      pswOnSubmit () {
        this.$refs.passwordForm.validate((valid) => {
          if (valid) {
            this.addLoading = true
            let params = Object.assign({}, this.passwordForm)
            user.setmypass(params)
              .then(response => {
                this.$message({
                  showClose: true,
                  message: '修改成功',
                  type: 'success'
                })
                this.addLoading = false
              }, response => {
                console.info('fail')
                this.addLoading = false
              })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    },
    sockets: {
      connect: function () {

      },
      warning: function (data) {
        let typeArr = ['success', 'warning', 'info', 'error']
        this.$notify({
          title: data.interfaceName,
          message: data.content + '\r\n' + moment(data.warnTime).format('YYYY-MM-DD'),
          type: typeArr[this.notifyMsg.type],
          onClick: this.notifyClick
        })
      }
    }
  }
</script>


<style lang="scss">
  .fade-enter-active{
    transition: all .3s ease;
  }
  .fade-leave-active {
    transition: all .5s ease
  }
  .fade-enter, .fade-leave-active {
    opacity: 0;
    transform: translateX(10px);
  }
  .container{
    position: absolute !important;
    top: 0px;
    bottom: 0px;
    width: 100%;
    .header{
       height: 60px;
       line-height: 60px;
       background-color: #ffffff;
       box-shadow: 0 0 1px 0 rgba(0,0,0,.3),0 0 6px 2px rgba(0,0,0,.15);
       .logo {
         //width:230px;
         color: #ffffff;
         background-color: rgb(45, 174, 170);
         height:60px;
         font-size: 22px;
         padding-left:20px;
         padding-right:20px;
         border-color: rgba(238,241,146,0.3);
         border-right-width: 1px;
         border-right-style: solid;
         -webkit-transition: all 350ms;
         -moz-transition: all 350ms;
         -ms-transition: all 350ms;
         -o-transition: all 350ms;
         transition: all 350ms;
       }
       .logo-width{
         width:230px;
       }
       .logo-collapse-width{
         width:60px
       }
       .tools{
         padding: 0px 23px;
         width:14px;
         height: 60px;
         line-height: 60px;
         cursor: pointer;
       }
       .userInfo {
         .screenfull{
           float: left;
         }
         text-align: right;
         padding-right: 35px;
         float: right;
         .userInfo-inner {
           cursor: pointer;
           color:#000000;
           img {
             width: 40px;
             height: 40px;
             border-radius: 20px;
             margin: 10px 0px 10px 10px;
             float: right;
           }
          }
        }
    }
    .main{
      display: flex;
      position: absolute;
      top: 60px;
      bottom: 0;
      overflow: hidden;
      .sidebar-container.el-menu--collapse{
        width: 60px;
        .el-submenu{
          .el-menu{
            position: fixed;
            margin-left: 0px;
            top: auto;
            margin-top: -100px;
            left: 65px;
          }
        }
      }
      .siderbar-scroll{
        .el-scrollbar__thumb{
          background-color: rgba(255,255,255,.5)
        }
        .el-scrollbar__wrap{
          overflow-x: hidden;
          background-color: rgb(39, 168, 157);
        }
      }
      .sidebar-container{
        width: 230px;
        background-color: rgb(39, 168, 157);
        border-right: none;
        .el-menu-item.is-active{
          background-color: #008792;
        }
        .fa {
          vertical-align: baseline;
          margin-right: 10px;
        }
        .el-menu-item:hover{
          background-color: #008792;
        }
        .el-submenu__title:hover{
          background-color: #008792;
        }
        .el-menu-item,.el-submenu__title{
          color: #ffffff;
          i {
            color: #ffffff;
          }
        }
        .el-submenu{
          color: #ffffff;
        }
        .el-submenu.is-opened{
          .el-menu-item{
            background-color: rgb(39, 158, 157);
          }
          .el-menu-item.is-active{
            background-color: #008792;
          }
          .el-menu-item:hover{
            background-color: #008792;
          }
        }
      }
      .content-container {
        // background: #f1f2f7;
        flex:1;
        //position: absolute;
        // right: 0px;
        // top: 0px;
        // bottom: 0px;
        // left: 230px;
        overflow-y: auto;
        padding: 20px;
        .breadcrumb-container {
          //margin-bottom: 15px;
          .title {
            width: 200px;
            float: left;
            color: #475669;
          }
          .breadcrumb-inner {
            float: right;
          }
        }
        .content-wrapper {
          background-color: #fff;
          box-sizing: border-box;
        }
        .queryBar{
          margin: 10px 0px;
          .el-form-item{
            margin-bottom: 5px;
          }
        }
      }
    }
  }
  .margin_110{
    margin-left:110px;
  }
  .el-message-box .el-message-box__content{
    margin-left:10%
  }
  .el-table th{
    text-align:center!important;
  }
  .importBtn{
    background:#8391a5!important;
    color:#fff!important;
    border:solid 1px #8391a5!important;
  }
  .exportBtn{
    background:#475d77!important;
    color:#fff!important;
    border:solid 1px #475d77!important;
  }
</style>
