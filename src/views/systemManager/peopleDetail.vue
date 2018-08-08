<template>
    <div class="peopleDetail">
      <div class="fr">
          <router-link to="/systemManagement/peopleManagement">
              <el-button  type="primary" size="small">返回</el-button>
          </router-link>
      </div>
      <div class="cb"></div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="基本信息" name="first">
            <table class="table-detail table-bordered table-fix-bottom table-fix-top">
              <tbody>
                <tr>
                  <td class="title">姓名</td>
                  <td>{{showForm.name}}</td>
                  <td class="title">ID</td>
                  <td>{{showForm.id}}</td>
                  <td class="title">工号</td>
                  <td>{{showForm.userCode}}</td>
                </tr>
                <tr>
                  <td class="title">拼音</td>
                  <td>{{showForm.pinyin}}</td>
                  <td class="title">登录名</td>
                  <td>{{showForm.loginName}}</td>
                  <td class="title">所属部门</td>
                  <td>{{showForm.department.name}}</td>
                </tr>
                <tr>
                  <td class="title">电话</td>
                  <td>{{showForm.phone}}</td>
                  <td class="title">允许密码登录</td>
                  <td>{{showForm.isLoginBypsw}}</td>
                  <td class="title">是否停用</td>
                  <td>{{showForm.isUse}}</td>
                </tr>
                <tr>
                  <td class="title">是否锁定</td>
                  <td>{{showForm.isLock}}</td>
                  <td class="title"></td>
                  <td></td>
                  <td class="title"></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </el-tab-pane>
          <!--<el-tab-pane label="指纹卡片" name="second">-->
              <!--<el-col :span="24" class="queryBar">-->
                <!--<el-form :inline="true" :model="formInline" class="demo-form-inline">-->
                  <!--<el-form-item label="名称">-->
                    <!--<el-input v-model="formInline.name"></el-input>-->
                  <!--</el-form-item>-->
                   <!--<el-form-item>-->
                    <!--<el-button type="primary" @click="fingerprintCardList">查询</el-button>-->
                  <!--</el-form-item>-->
                  <!--<el-form-item>-->
                     <!--<el-button type="primary" @click="addSystem">新增</el-button>-->
                  <!--</el-form-item>-->
                <!--</el-form>-->
            <!--</el-col>-->
            <!--<el-table :data="tableData1" border tooltip-effect="dark" v-loading="isLoading" style="width: 100%" id="tableData1">-->
              <!--<el-table-column prop="number" label="序号"  align="center" width="100" show-overflow-tooltip></el-table-column>-->
              <!--<el-table-column prop="peopleId" label="人员ID" width="100" show-overflow-tooltip></el-table-column>-->
              <!--<el-table-column prop="name" label="名称" width="100" show-overflow-tooltip></el-table-column>-->
              <!--<el-table-column prop="certificateType" label="凭证类型" width="100" show-overflow-tooltip></el-table-column>-->
              <!--<el-table-column prop="cardInfo" label="指纹信息/卡片信息" width="200" show-overflow-tooltip></el-table-column>-->
              <!--<el-table-column prop="registerTime" label="注册时间" width="100" show-overflow-tooltip></el-table-column>-->
              <!--<el-table-column prop="invalidTime" label="失效时间" width="100" show-overflow-tooltip></el-table-column>-->
              <!--<el-table-column prop="register" label="注册人" width="100" show-overflow-tooltip></el-table-column>-->
              <!--<el-table-column prop="deviceId" label="注册设备ID" width="120" show-overflow-tooltip></el-table-column>-->
              <!--<el-table-column label="操作" width="100">-->
                <!--<template slot-scope="scope">-->
                  <!--<el-button type="warning" class="editBtn" size="small"  @click="handleDelete1(scope.$index, scope.row)">删除</el-button>-->
                <!--</template>-->
            <!--</el-table-column>-->
            <!--</el-table>-->
          <!--</el-tab-pane>-->
          <!--<el-tab-pane label="器械柜" name="third">-->
            <!--<template>-->
               <!--<el-table :data="tableData2" border tooltip-effect="dark" style="width: 100%">-->
                 <!--<el-table-column prop="num" label="序号"  align="center" show-overflow-tooltip></el-table-column>-->
                 <!--<el-table-column prop="code" label="编号" show-overflow-tooltip></el-table-column>-->
                 <!--<el-table-column prop="uniqueCode" label="机器唯一码" width="120" show-overflow-tooltip></el-table-column>-->
                 <!--<el-table-column prop="Operator" label="操作员" show-overflow-tooltip></el-table-column>-->
                 <!--<el-table-column prop="belongList" label="当前配置的器械列表" width="200" show-overflow-tooltip></el-table-column>-->
                 <!--<el-table-column prop="cabinetEquipStatus" label="器械柜设备状态" width="150" show-overflow-tooltip></el-table-column>-->
                 <!--<el-table-column prop="cabinetRFIDStatus" label="器械柜RFID状态" width="150" show-overflow-tooltip></el-table-column>-->
                 <!--<el-table-column prop="cabineLockStatus" label="器械柜锁状态" width="150" show-overflow-tooltip></el-table-column>-->
                 <!--<el-table-column prop="cabineCardRender" label="器械柜刷卡器状态" width="150" show-overflow-tooltip></el-table-column>-->
                 <!--<el-table-column prop="cabineFinger" label="器械柜指纹状态(备用)" width="180" show-overflow-tooltip></el-table-column>-->
                 <!--<el-table-column prop="loginDate" label="登记日期" width="100" show-overflow-tooltip></el-table-column>-->
                 <!--<el-table-column prop="synStatus" label="信息更改标识/同步状态" width="200" show-overflow-tooltip></el-table-column>-->
               <!--</el-table>-->
            <!--</template>-->
          <!--</el-tab-pane>-->
          <!--<el-tab-pane label="借用器械柜" name="forth">-->
            <!--<template>-->
               <!--<el-table :data="tableData3" border tooltip-effect="dark" style="width: 100%">-->
                 <!--<el-table-column prop="num" label="序号"  align="center" show-overflow-tooltip></el-table-column>-->
                 <!--<el-table-column prop="code" label="编号" show-overflow-tooltip></el-table-column>-->
                 <!--<el-table-column prop="uniqueCode" label="机器唯一码" width="120" show-overflow-tooltip></el-table-column>-->
                 <!--<el-table-column prop="Operator" label="操作员" show-overflow-tooltip></el-table-column>-->
                 <!--<el-table-column prop="belongList" label="当前配置的器械列表" width="200" show-overflow-tooltip></el-table-column>-->
                 <!--<el-table-column prop="cabinetEquipStatus" label="器械柜设备状态" width="150" show-overflow-tooltip></el-table-column>-->
                 <!--<el-table-column prop="cabinetRFIDStatus" label="器械柜RFID状态" width="150" show-overflow-tooltip></el-table-column>-->
                 <!--<el-table-column prop="cabineLockStatus" label="器械柜锁状态" width="150" show-overflow-tooltip></el-table-column>-->
                 <!--<el-table-column prop="cabineCardRender" label="器械柜刷卡器状态" width="150" show-overflow-tooltip></el-table-column>-->
                 <!--<el-table-column prop="cabineFinger" label="器械柜指纹状态(备用)" width="180" show-overflow-tooltip></el-table-column>-->
                 <!--<el-table-column prop="loginDate" label="登记日期" width="100" show-overflow-tooltip></el-table-column>-->
                 <!--<el-table-column prop="synStatus" label="信息更改标识/同步状态" width="200" show-overflow-tooltip></el-table-column>-->
               <!--</el-table>-->
            <!--</template>-->
          <!--</el-tab-pane>-->
          <!--<el-tab-pane label="密码管理" name="password" class="password">-->
            <!--<el-form label-width="100px" :model="passwordForm" :rules="passwordRules" ref="passwordForm">-->
                <!--<el-form-item label="原密码" prop="old">-->
                  <!--<el-input type="password" v-model="passwordForm.old" auto-complete="off"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="新密码" prop="newPsw">-->
                  <!--<el-input type="password" v-model="passwordForm.newPass" auto-complete="off"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="确认密码" prop="confirmPsw">-->
                  <!--<el-input type="password" v-model="passwordForm.confirmPsw" auto-complete="off"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item>-->
                  <!--<el-button type="primary" @click="pswOnSubmit">确定</el-button>-->
                  <!--<el-button @click="pswResetForm('passwordForm')">重置</el-button>-->
                <!--</el-form-item>-->
            <!--</el-form>-->
          <!--</el-tab-pane>-->
      </el-tabs>
          <!--新增界面-->
    <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false" @close="refDialog('addForm')">
      <el-form :model="addForm" label-width="130px" :rules="addFormRules" ref="addForm">
        <el-form-item label="人员ID" prop="userId" required>
          <el-input v-model="addForm.userId" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="凭证类型" prop="certificatesType">
          <el-select v-model="addForm.certificatesType" auto-complete="off">
            <el-option label="卡片" value="卡片">卡片</el-option>
            <el-option label="指纹" value="指纹">指纹</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="指纹信息/卡片信息" prop="cardInfo">
          <el-input v-model="addForm.cardInfo" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="注册时间" prop="registTime">
          <el-col :span="14">
            <el-date-picker type="date" placeholder="选择日期" v-model="addForm.registTime" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="失效时间" prop="invalidTime">
           <el-col :span="14">
            <el-date-picker type="date" placeholder="选择日期" v-model="addForm.invalidTime" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="注册人" prop="register">
          <el-input  v-model="addForm.register" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="注册设备ID" prop="equipmentId">
          <el-input v-model="addForm.equipmentId" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

  <script>
  import { user } from '../../api/api'
  export default {
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
      return {
        // 表格数据
        tableData1: [],
        tableData2: [],
        tableData3: [],
        activeName: 'first',
        addLoading: false,
        // 是否显示添加界面
        addFormVisible: false,
        // 显示表格时候是否loading
        isLoading: false,
            // 新增界面数据
        addForm: {
          name: '',
          userId: '',
          certificatesType: '',
          cardInfo: '',
          registTime: '',
          invalidTime: '',
          register: '',
          equipmentId: ''
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
        },
        // 分页对象
        page: {
          page: 1,
          size: 10,
          totalElements: 0
        },
        // 表格查询条件
        formInline: {
          name: ''
        },
        addFormRules: {
          userId: [
            { required: true, message: '请输入人员ID', trigger: 'blur' }
          ]
        },
        showForm: {
          Id: '',
          name: '',
          userCode: '',
          pinyin: '',
          password: '',
          department: '',
          phone: '',
          isLoginBypsw: '',
          isUse: '',
          isLock: ''
        }
      }
    },
    created: function () {
      this.userDetail()
    },
    methods: {
      refDialog (name) {
        this.$refs[name].resetFields()
      },
      handleClick (tab, event) {
        this.isLoading = false
        if (tab.index === '1') {
          this.fingerprintCardList()
        } else if (tab.index === '0') {
          this.userDetail()
        } else if (tab.index === '2') {
          this.instrumentCabinet()
        } else if (tab.index === '3') {
          this.borrowInstrumentCabinet()
        }
      },
      pswResetForm () {
        this.$refs.passwordForm.resetFields()
      },
      addSystem () {
        this.addFormVisible = true
      },
      addSubmit () {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            console.info('ok')
          } else {
            console.info('error')
          }
        })
      },
      fingerprintCardList () {
        this.isLoading = true
        user.findAllForfingerCard({params: Object.assign(this.page, this.formInline)})
          .then(response => {
            this.isLoading = false
            this.page.totalElements = response.totalElements
            this.tableData1 = response.content
            console.log(this.tableData1)
          }, response => {
            console.info('fail')
          })
      },
      userDetail () {
        user.detail(this.$route.params.id).then(res => {
          this.showForm = res
        })
      },
      instrumentCabinet () {
        this.isLoading = true
        user.instrumentCabinet({params: Object.assign(this.page)})
          .then(response => {
            this.isLoading = false
            this.page.totalElements = response.totalElements
            this.tableData2 = response.content
            console.log(this.tableData2)
          }, response => {
            console.info('fail')
          })
      },
      borrowInstrumentCabinet () {
        this.isLoading = true
        user.borrowInstrumentCabinet({params: Object.assign(this.page)})
          .then(response => {
            this.isLoading = false
            this.page.totalElements = response.totalElements
            this.tableData3 = response.content
            console.log(this.tableData3)
          }, response => {
            console.info('fail')
          })
      },
      pswOnSubmit () {
        this.$refs.passwordForm.validate((valid) => {
          if (valid) {
            let params = Object.assign({}, this.passwordForm)
            user.setmypass(params)
              .then(response => {
                this.$message({
                  showClose: true,
                  message: '修改成功',
                  type: 'success'
                })
                this.$refs.passwordForm.resetFields()
              }, response => {
                this.$message({
                  showClose: true,
                  message: '修改失败',
                  type: 'error'
                })
              })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      handleDelete1 (index, row) {
        console.log(index, row)
      }
    }
  }
</script>

<style>
  .fr{
    float:right;
  }
  .cb{
    clear: both;
  }
  .peopleDetail .password{
    padding-top: 30px;
    padding-left: 30px;;
  }
  .peopleDetail .password .el-input{
    width: 200px;
  }
</style>
