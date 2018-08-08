<template>
    <div class="peopleDetail">
      <div class="fr">
          <router-link to="/storeRoomManagement/instrumentSearch">
              <el-button  type="primary" size="small">返回</el-button>
          </router-link>
      </div>
      <div class="cb"></div>
        <el-form :model="showForm" ref="showForm" inline label-position="left">
           <el-col :span="4">
            <el-form-item label="器械库房:">
              {{showForm.Id}}
            </el-form-item>
          </el-col>
           <el-col :span="4">
            <el-form-item label="器械名称:">
              {{showForm.applyStatus}}
            </el-form-item>
          </el-col>
           <el-col :span="4">
            <el-form-item label="归还人:">
              {{showForm.applyStatus}}
            </el-form-item>
          </el-col>
           <el-col :span="4">
            <el-form-item label="归还人单位:">
              {{showForm.applyStatus}}
            </el-form-item>
          </el-col>
           <el-col :span="4">
            <el-form-item label="归还经手人:">
              {{showForm.applyStatus}}
            </el-form-item>
          </el-col>
           <el-col :span="4">
            <el-form-item label="归还时间:">
              {{showForm.applyStatus}}
            </el-form-item>
          </el-col>
           <el-col :span="4">
            <el-form-item label="是否逾期:">
              {{showForm.applyStatus}}
            </el-form-item>
          </el-col>
           <el-col :span="4">
            <el-form-item label="是否完好:">
              {{showForm.applyStatus}}
            </el-form-item>
          </el-col>
          <div style="clear:both"></div>
        </el-form>
        <h5 style="color: #925555;font-size: 15px;">器械列表:</h5>
        <el-col :span="24" class="queryBar">
          <el-table  :data="tableData" border tooltip-effect="dark" style="width: 100%" v-loading="isLoading">
            <el-table-column type="selection" width="55" fixed="left"></el-table-column>
            <el-table-column
              type="index"
              label="序号"  align="center"
              width="80">
            </el-table-column>
            <el-table-column prop="instrumentsCode" label="编码" width="200" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="rfidCode" label="RFID编码" width="200" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="instrumentDict.name" label="名称" width="200" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="instrumentDict.spec" label="规格" width="200" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="name" label="分配设备" width="200" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row.distributionStatus == 0 ? '未分配' : scope.row.distributionStatus == 1 ? '器械柜' : '器械包' }}
              </template>
            </el-table-column>
            <el-table-column prop="name" label="设备编码" width="200" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row.cabine ? scope.row.cabine.cabineCode : ''}}
                {{ scope.row.bag ? scope.row.bag.bagCode : ''}}
              </template>
            </el-table-column>
            <el-table-column prop="createDate" label="登记日期" width="200" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="stopFlag" label="状态" width="100" :formatter="_formatType" show-overflow-tooltip>
            </el-table-column>
          </el-table>
        </el-col>
  </div>
</template>

  <script>
  import { user } from '../../api/api'
  export default {
    data () {
      var validatePassOld = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入旧密码'))
        } else {
          var patrn = /^[a-zA-Z]{1}([a-zA-Z0-9]|[._]){4,19}$/
          if (!patrn.exec(value)) {
            callback(new Error('请输入5-20位由字母数字下划线组成的密码'))
          } else {
            callback()
          }
        }
      }
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入新密码'))
        } else {
          var patrn = /^[a-zA-Z]{1}([a-zA-Z0-9]|[._]){4,19}$/
          if (!patrn.exec(value)) {
            callback(new Error('请输入5-20位由字母数字下划线组成的密码'))
          } else {
            if (this.passwordForm.confirmPsw !== '') {
              this.$refs.passwordForm.validateField('confirmPsw')
            } else {
              callback()
            }
          }
        }
      }
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入确认密码'))
        } else {
          var patrn = /^[a-zA-Z]{1}([a-zA-Z0-9]|[._]){4,19}$/
          if (!patrn.exec(value)) {
            callback(new Error('请输入5-20位由字母数字下划线组成的密码'))
          } else if (value !== this.passwordForm.newPsw) {
            callback(new Error('两次输入密码不一致!'))
          } else {
            callback()
          }
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
          oldPsw: '',
          newPsw: '',
          confirmPsw: ''
        },
        passwordRules: {
          oldPsw: [
            { required: true, validator: validatePassOld, trigger: 'blur' }
          ],
          newPsw: [
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
        user.detail({params: this.$route.params.id}).then(res => {
          this.showForm = res.content
          console.log(this.showForm)
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
            alert('submit!')
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
</style>
