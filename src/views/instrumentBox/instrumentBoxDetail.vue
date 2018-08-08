<template>
    <div class="peopleDetail">
      <div class="fr">
          <router-link to="/instrumentBoxManagement/instrumentBoxList">
              <el-button  type="primary" size="small">返回</el-button>
          </router-link>
      </div>
      <div class="cb"></div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="基本信息" name="first">
            <table class="table-detail table-bordered">
              <tbody>
                <tr>
                  <td class="title">编码</td>
                  <td>{{showForm.cabineCode}}</td>
                  <td class="title">机器唯一码</td>
                  <td>{{showForm.uniquenessCode}}</td>
                  <td class="title">设备SN号</td>
                  <td>{{showForm.sn}}</td>
                </tr>
                <tr>
                  <td class="title">器械柜设备状态</td>
                  <td>{{showForm.online === 0 ? '离线' : '在线'}}</td>
                  <td class="title">器械柜状态</td>
                  <td>{{ showForm.cabinetState | parseCabinetStateType }}</td>
                  <td class="title">登记日期</td>
                  <td>{{ showForm.registerDate }}</td>
                </tr>
                <tr>
                  <td class="title">最后更改日期</td>
                  <td>{{showForm.lastChangeTime}}</td>
                  <td class="title">最后更改人员</td>
                  <td>{{showForm.lastChanger ? showForm.lastChanger.name : ''}}</td>
                  <td class="title">耗材总数</td>
                  <td>{{ showForm.count }}</td>
                </tr>
              </tbody>
            </table>
          </el-tab-pane>
          <el-tab-pane label="器械列表" name="second">
              <el-form :model="showForm" ref="showForm" inline>
                <!--<el-form-item label="名称">-->
                  <!--<el-input v-model="formInline.name"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item>-->
                  <!--<el-button type="primary" @click="onSubmit">查询</el-button>-->
                <!--</el-form-item>-->
              </el-form>
              <el-table :data="tableData1" border tooltip-effect="dark" v-loading="isLoading" style="width: 100%" id="tableData1">
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
                <el-table-column prop="registerTime" label="登记日期" width="200" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="stopFlag" label="状态" width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    {{ scope.row.state | parseInstrumentStatus }}
                  </template>
                </el-table-column>
            </el-table>
            <el-col :span="24" class="queryBar">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="page.page"
                :page-size="page.size"
                layout="total, prev, pager, next"
                :total="page.totalElements"
                style="float: right">
              </el-pagination>
            </el-col>
          </el-tab-pane>
          <el-tab-pane label="授权用户">
            <el-form :model="addForm" ref="showForm" inline label-position="left">
              <el-form-item>
                <el-select v-model="addForm.id" placeholder="请选择" filterable>
                  <el-option
                    v-for="item in userList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    <span style="float: left">{{ item.label }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.dept }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="success" @click="addSystem">新增</el-button>
              </el-form-item>
            </el-form>
            <el-table :data="tableData1" border tooltip-effect="dark" v-loading="isLoading" style="width: 100%" id="tableData1">
              <el-table-column
                type="index"
                label="序号"  align="center"
                width="80">
              </el-table-column>
              <!--<el-table-column prop="id" label="人员ID" width="100" show-overflow-tooltip></el-table-column>-->
              <!--<el-table-column prop="userCode" label="用户编码" width="100" show-overflow-tooltip></el-table-column>-->
              <!--<el-table-column prop="certificateType" label="凭证类型" width="100" show-overflow-tooltip></el-table-column>-->
              <el-table-column prop="name" label="姓名" show-overflow-tooltip></el-table-column>
              <!--<el-table-column prop="pinYin" label="拼音" width="100" show-overflow-tooltip></el-table-column>-->
              <el-table-column prop="department.name" label="所属部门" show-overflow-tooltip></el-table-column>
              <!--<el-table-column prop="register" label="电话" width="100" show-overflow-tooltip></el-table-column>-->
              <!--<el-table-column prop="deviceId" label="登录名" width="120" show-overflow-tooltip></el-table-column>-->
              <!--<el-table-column prop="register" label="密码" width="100" show-overflow-tooltip></el-table-column>-->
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="warning" size="small"  @click="handleDelete1(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="使用日志" name="third">
            <template>
               <el-table :data="tableData2" border tooltip-effect="dark" style="width: 100%">
                 <el-table-column
                   type="index"
                   label="序号"  align="center"
                   width="80">
                 </el-table-column>
                 <el-table-column prop="code" label="操作类型" show-overflow-tooltip>
                   <template slot-scope="scope">
                     {{ scope.row.operation | parseCabinetOpStateType}}
                   </template>
                 </el-table-column>
                 <el-table-column prop="time" label="操作时间" width="120" show-overflow-tooltip></el-table-column>
                 <el-table-column prop="operator.name" label="操作员" show-overflow-tooltip></el-table-column>
                 <!--<el-table-column prop="belongList" label="操作方式" width="200" show-overflow-tooltip></el-table-column>-->
                 <!--<el-table-column prop="cabinetEquipStatus" label="抽屉编号" width="150" show-overflow-tooltip></el-table-column>-->
               </el-table>
              <el-col :span="24" class="queryBar">
                <el-pagination
                  @size-change="LoghandleSizeChange"
                  @current-change="LoghandleCurrentChange"
                  :current-page.sync="Logpage.page"
                  :page-size="Logpage.size"
                  layout="total, prev, pager, next"
                  :total="Logpage.totalElements"
                  style="float: right">
                </el-pagination>
              </el-col>
            </template>
          </el-tab-pane>
      </el-tabs>
          <!--新增界面-->
    <!--<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false" @close="refDialog('addForm')">-->
      <!--<el-form :model="addForm" label-width="130px" :rules="addFormRules" ref="addForm">-->
        <!--<el-form-item label="人员ID" prop="userId" required>-->
          <!--<el-input v-model="addForm.userId" auto-complete="off"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="用户编码" prop="userCode">-->
          <!--<el-input v-model="addForm.userCode" auto-complete="off"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="所属部门" prop="department">-->
          <!--<el-select v-model="addForm.department" auto-complete="off">-->
            <!--<el-option label="卡片" value="卡片">卡片</el-option>-->
            <!--<el-option label="指纹" value="指纹">指纹</el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="姓名" prop="name">-->
          <!--<el-input v-model="addForm.name" auto-complete="off"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="拼音" prop="pinyin">-->
          <!--<el-input  v-model="addForm.pinyin" auto-complete="off"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="电话" prop="phone">-->
          <!--<el-input v-model="addForm.phone" auto-complete="off"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="登录名" prop="loginName">-->
          <!--<el-input v-model="addForm.loginName" auto-complete="off"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="密码" prop="password">-->
          <!--<el-input v-model="addForm.password" auto-complete="off"></el-input>-->
        <!--</el-form-item>-->
      <!--</el-form>-->
      <!--<div slot="footer" class="dialog-footer">-->
        <!--<el-button @click.native="addFormVisible = false">取消</el-button>-->
        <!--<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>-->
      <!--</div>-->
    <!--</el-dialog>-->
  </div>
</template>

  <script>
  import { user, instrumentBoxList } from '../../api/api'
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
        userList: [],
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
          id: ''
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
        Logpage: {
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
          ],
          userCode: [
            { required: true, message: '请输入人员编码', trigger: 'blur' }
          ],
          department: [
            { required: true, message: '请选择所属部门', trigger: 'change' }
          ],
          name: [
            { required: true, message: '请输入人员姓名', trigger: 'blur' }
          ],
          pinyin: [
            { required: true, message: '请输入人员拼音', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入人员密码', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '请输入人员手机号', trigger: 'blur' }
          ],
          loginName: [
            { required: true, message: '请输入人员登录名', trigger: 'blur' }
          ]
        },
        showForm: {
          cabineCode: '',
          uniquenessCode: '',
          sn: '',
          online: '',
          cabinetState: '',
          registerDate: '',
          lastChangeTime: '',
          lastChanger: {
            name: ''
          },
          count: ''
        }
      }
    },
    mounted: function () {
      this.userDetail()
      this.initData()
    },
    methods: {
      handleSizeChange (val) {
        console.info(val)
      },
      handleCurrentChange (val) {
        this.fingerprintCardList()
      },
      LoghandleSizeChange (val) {
        console.info(val)
      },
      LoghandleCurrentChange (val) {
        this.instrumentCabinet()
      },
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
          this.userDetail()
        } else if (tab.index === '3') {
          this.instrumentCabinet()
        }
      },
      pswResetForm () {
        this.$refs.passwordForm.resetFields()
      },
      addSystem () {
        let param = Object.assign({}, this.addForm)
        instrumentBoxList.addUser(this.$route.params.id, param.id)
          .then(response => {
            this.$message({
              type: 'success',
              message: '新增成功!'
            })
            this.userDetail()
          }, response => {
            console.info('fail')
          })
        console.info(this.addForm.id)
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
        instrumentBoxList.findByCabinetId(this.$route.params.id, {params: Object.assign(this.page, this.formInline)})
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
        instrumentBoxList.findOne(this.$route.params.id).then(res => {
          this.showForm = res
          this.tableData1 = res.operators
        })
      },
      instrumentCabinet () {
        this.isLoading = true
        instrumentBoxList.logs(this.$route.params.id, {params: Object.assign({}, this.Logpage)})
          .then(response => {
            this.isLoading = false
            this.Logpage.totalElements = response.totalElements
            this.tableData2 = response.content
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
      initData () {
        // 加载下拉框数据
        // 所有用户
        user.findIsLock()
          .then(response => {
            this.userList = []
            response.map((x) => {
              this.userList.push({
                value: x.id,
                label: x.name,
                dept: x.department.name ? x.department.name : '未知'
              })
            })
          }, response => {
            console.info(response)
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
        this.$confirm('此操作将从授权中移除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = Object.assign({}, row)
          instrumentBoxList.delete(this.$route.params.id, param.id)
            .then(response => {
              this.$message({
                type: 'success',
                message: '移除成功!'
              })
              this.userDetail()
            }, response => {
              console.info('fail')
            })
        }).catch(() => {
          console.info('关闭移除')
        })
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
