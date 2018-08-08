<template>
    <div class="peopleDetail">
      <div class="fr">
          <router-link to="/instrumentManagement/browse">
              <el-button  type="primary" size="small">返回</el-button>
          </router-link>
      </div>
      <div class="cb"></div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="器械详情" name="first">
          <table class="table-detail table-bordered">
            <tbody>
              <tr>
                <td class="title">编码</td>
                <td>{{showForm.instrumentsCode}}</td>
                <td class="title">RFID编码</td>
                <td>{{showForm.rfidCode}}</td>
                <td class="title">名称</td>
                <td>{{showForm.instrumentDict.name}}</td>
              </tr>
              <tr>
                <td class="title">规格</td>
                <td>{{showForm.instrumentDict.spec}}</td>
                <td class="title">分配状态</td>
                <td>{{ showForm.distributionStatus === 0 ? '器械柜' : showForm.distributionStatus === 1 ? '库房' : '未知' }}</td>
                <td class="title">所属位置</td>
                <td>{{ showForm.cabinet ? '' : ''}}
                  {{ showForm.store ? showForm.store.name : ''}}</td>
              </tr>
              <tr>
                <td class="title">登记人</td>
                <td>{{showForm.registor.name}}</td>
                <td class="title">登记时间</td>
                <td>{{showForm.registerTime}}</td>
                <td class="title">状态</td>
                <td>{{ showForm.state | parseInstrumentStatus }}</td>
              </tr>
            </tbody>
          </table>
        </el-tab-pane>
        <el-tab-pane label="操作日志" name="second">
          <!--<el-form :model="showForm" ref="showForm" inline>-->
            <!--<el-form-item label="名称">-->
              <!--<el-input v-model="formInline.name"></el-input>-->
            <!--</el-form-item>-->
            <!--<el-form-item>-->
              <!--<el-button type="primary" @click="onSubmit">查询</el-button>-->
            <!--</el-form-item>-->
          <!--</el-form>-->
          <el-table :data="tableData1" border tooltip-effect="dark" v-loading="isLoading" style="width: 100%" id="tableData1">
            <el-table-column
              type="index"
              label="序号"  align="center"
              width="80">
            </el-table-column>
            <el-table-column prop="operationTime" label="操作时间" show-overflow-tooltip></el-table-column>
            <el-table-column prop="operator.name" label="操作人" show-overflow-tooltip></el-table-column>
            <el-table-column prop="peopleId" label="操作类型"  show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row.operationType | parseOperationType }}
              </template>
            </el-table-column>
            <el-table-column prop="name" label="操作位置" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row.cabinet ? '' : ''}}
                {{ scope.row.store ? scope.row.store.name : ''}}
              </template>
            </el-table-column>
          </el-table>
          <el-col :span="24" class="queryBar">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="page.page" :page-size="page.size" layout="total, prev, pager, next" :total="page.totalElements" style="float: right">
            </el-pagination>
          </el-col>
        </el-tab-pane>
        <el-tab-pane label="保养信息" name="third">
          <template>
            <el-table :data="tableData2" border tooltip-effect="dark" style="width: 100%">
              <el-table-column
                type="index"
                label="序号"  align="center"
                width="80">
              </el-table-column>
              <el-table-column prop="maintainTime" label="最近保养时间" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="maintainTime" label="保养类型" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row.maintainType | parseMaintainType }}
                </template>
              </el-table-column>
            </el-table>
            <el-col :span="24" class="queryBar">
              <el-pagination @size-change="handleSizeChangeMain" @current-change="handleCurrentChangeMain" :current-page.sync="Mainpage.page" :page-size="Mainpage.size" layout="total, prev, pager, next" :total="Mainpage.totalElements" style="float: right">
              </el-pagination>
            </el-col>
          </template>
        </el-tab-pane>
        <el-tab-pane label="维修信息" name="fourth">
          <template>
            <el-table :data="tableData3" border tooltip-effect="dark" style="width: 100%">
              <el-table-column
                type="index"
                label="序号"  align="center"
                width="80">
              </el-table-column>
              <el-table-column prop="excuteTime" label="维修时间" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="maintainTime" label="维修结果" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ filterRow(scope.row).insRepairState | parseInsRepairStateType }}
                </template>
              </el-table-column>
            </el-table>
            <el-col :span="24" class="queryBar">
              <el-pagination @size-change="handleSizeChangeRepair" @current-change="handleCurrentChangeRepair" :current-page.sync="Repairpage.page" :page-size="Repairpage.size" layout="total, prev, pager, next" :total="Repairpage.totalElements" style="float: right">
              </el-pagination>
            </el-col>
          </template>
        </el-tab-pane>
      </el-tabs>
  </div>
</template>

  <script>
  import { user, instruments } from '../../api/api'
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
          newPsw: [{ required: true, validator: validatePass, trigger: 'blur' }],
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
        Mainpage: {
          page: 1,
          size: 10,
          totalElements: 0
        },
        Repairpage: {
          page: 1,
          size: 10,
          totalElements: 0
        },
        // 表格查询条件
        formInline: {
          name: ''
        },
        addFormRules: {
          userId: [{ required: true, message: '请输入人员ID', trigger: 'blur' }]
        },
        showForm: {
          instrumentsCode: '',
          rfidCode: '',
          instrumentDict: {
            name: '',
            spec: ''
          },
          distributionStatus: null,
          cabine: null,
          store: null,
          registor: {
            name: ''
          },
          registerTime: '',
          isUse: '',
          isLock: ''
        }
      }
    },
    mounted: function () {
      this.instrumentDetail()
    },
    methods: {
      refDialog (name) {
        this.$refs[name].resetFields()
      },
      handleClick (tab, event) {
        //        this.isLoading = false
        if (tab.index === '1') {
          this.instrumenLog()
        } else if (tab.index === '0') {
          this.instrumentDetail()
        } else if (tab.index === '2') {
          this.maintainLog()
        } else if (tab.index === '3') {
          this.repairLog()
        }
      },
      pswResetForm () {
        this.$refs.passwordForm.resetFields()
      },
      addSystem () {
        this.addFormVisible = true
      },
      addSubmit () {
        this.$refs.addForm.validate(valid => {
          if (valid) {
            console.info('ok')
          } else {
            console.info('error')
          }
        })
      },
      repairLog () {
        this.isLoading = true
        instruments
          .findRepairByInstrument(this.$route.params.id, {
            params: Object.assign(this.page, this.formInline)
          })
          .then(
            response => {
              this.isLoading = false
              this.Repairpage.totalElements = response.totalElements
              this.tableData3 = response.content
            },
            response => {
              console.info('fail')
            }
          )
      },
      maintainLog () {
        this.isLoading = true
        instruments
          .findMaintainByInstrument(this.$route.params.id, {
            params: Object.assign(this.page, this.formInline)
          })
          .then(
            response => {
              this.isLoading = false
              this.Mainpage.totalElements = response.totalElements
              this.tableData2 = response.content
            },
            response => {
              console.info('fail')
            }
          )
      },
      instrumenLog () {
        this.isLoading = true
        instruments
          .findByInstrument(this.$route.params.id, {
            params: Object.assign(this.page, this.formInline)
          })
          .then(
            response => {
              this.isLoading = false
              this.page.totalElements = response.totalElements
              this.tableData1 = response.content
            },
            response => {
              console.info('fail')
            }
          )
      },
      instrumentDetail () {
        instruments.findById(this.$route.params.id).then(res => {
          this.showForm = res
        })
      },
      instrumentCabinet () {
        this.isLoading = true
        user.instrumentCabinet({ params: Object.assign(this.page) }).then(
          response => {
            this.isLoading = false
            this.page.totalElements = response.totalElements
            this.tableData2 = response.content
            console.log(this.tableData2)
          },
          response => {
            console.info('fail')
          }
        )
      },
      borrowInstrumentCabinet () {
        this.isLoading = true
        user.borrowInstrumentCabinet({ params: Object.assign(this.page) }).then(
          response => {
            this.isLoading = false
            this.page.totalElements = response.totalElements
            this.tableData3 = response.content
            console.log(this.tableData3)
          },
          response => {
            console.info('fail')
          }
        )
      },
      pswOnSubmit () {
        this.$refs.passwordForm.validate(valid => {
          if (valid) {
            alert('submit!')
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      filterRow (row) {
        let obj = row.instrument.find(x => {
          return (
            Number.parseInt(x.instrument.id) ===
            Number.parseInt(this.$route.params.id)
          )
        })
        return obj
      },
      handleDelete1 (index, row) {
        console.log(index, row)
      },
      handleSizeChange (val) {
        console.info(val)
      },
      handleCurrentChange (val) {
        this.instrumenLog()
      },
      handleSizeChangeMain (val) {
        console.info(val)
      },
      handleCurrentChangeMain (val) {
        this.maintainLog()
      },
      handleSizeChangeRepair (val) {
        console.info(val)
      },
      handleCurrentChangeRepair (val) {
        this.repairLog()
      }
    }
  }
</script>

<style>
  .fr {
    float: right;
  }
  .cb {
    clear: both;
  }
</style>
