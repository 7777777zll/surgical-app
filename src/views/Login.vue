<template>
  <el-form class="form-container" :model="submitForm" :rules="formRules" ref="submitForm">
    <div class="theme"><i class="fa fa-user-md"></i></div>
    <h1 class="title">登陆 管理平台</h1>
    <el-form-item prop="loginName">
      <el-input
        placeholder="用户名"
        v-model="submitForm.loginName">
        <i class="el-input__icon fa fa-user-o" slot="icon"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        placeholder="密码"
        type="password"
        v-model="submitForm.password"
        @keyup.enter.native="onSubmit('submitForm')">
        <i class="el-input__icon fa fa-key" slot="icon"></i>
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button class="btn-submit" type="success" @click="onSubmit('submitForm')">登陆</el-button>
    </el-form-item>
    <el-col :span="24" class="version-info">
      <a href="http://www.rivamed.cn">Copyright©  2018 北京瑞华康源科技有限公司</a>
    </el-col>
  </el-form>
</template>



<script>
  export default {
    name: 'Home',
    data () {
      return {
        submitForm: {
          loginName: '',
          password: ''
        },
        formRules: {
          loginName: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      onSubmit (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let obj = Object.assign(this.submitForm)
            this.$store.dispatch('Login', obj).then(() => {
              this.nativeFun('loginSuccess')
              this.$router.push({ path: '/' }) // 登录成功之后重定向到首页
            }).catch(err => {
              console.debug(err)
//              this.$message.error(err.message) // 登录失败提示错误
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    },
    beforeCreate () {
      document.getElementsByTagName('body')[0].className = 'customBody'
    },
    beforeDestroy () {
      document.body.removeAttribute('class', 'customBody')
    }
  }
</script>


<style lang="scss">
  .customBody {
    background: -webkit-linear-gradient(#67b26f , #4ca2cd); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(#67b26f , #4ca2cd); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(#67b26f , #4ca2cd); /* Firefox 3.6 - 15 */
    background: linear-gradient(to right, #67b26f , #4ca2cd); /* 标准的语法（必须放在最后） */
    overflow: hidden;
    .form-container{
      transform: translate(-50%,-50%);
      position: absolute;
      left: 50%;
      top: 50%;
      background-color: rgba(255, 255, 255, .1);
      border-radius: 15px;
      width: 350px;
      padding: 14px;
      .theme{
        text-align: center;
        .fa-user-md{
          font-size: 75px;
          color: #ffffff;
        }
      }
      .title{
        margin: 5px auto 13px auto;
        font-size: 32px;
        font-weight: 300;
        color: #ffffff;
        text-align: center;
      }
      .btn-submit{
        width: 100%;
      }
      .version-info{
        text-align: center;
        padding: 5px;
        a{
          text-decoration: none;
          color: #ffffff;
        }
      }
    }
  }
  html{
    height: 100%;
  }
</style>
