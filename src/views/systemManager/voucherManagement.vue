<template>
    <div class="peopleDetail">
      <el-col :span="24" class="queryBar">
        <el-form :model="formInline" inline label-position="left">
          <el-form-item label="姓名">
            <el-input v-model="formInline.name" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="userDetail">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
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
            <el-button type="warning" size="small"  @click="handleReset(scope.$index, scope.row)">重置密码</el-button>
            <router-link :to="'/icCardDetail/'+scope.row.id">
              <el-button type="warning" size="small" >IC卡管理</el-button>
            </router-link>
            <router-link :to="'/fingerDetail/'+scope.row.id">
              <el-button type="warning" size="small" >指纹管理</el-button>
            </router-link>
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
      return {
        // 表格数据
        userList: [],
        tableData1: [],
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
    },
    methods: {
      handleSizeChange (val) {
        console.info(val)
      },
      handleCurrentChange (val) {
        this.userDetail()
      },
      refDialog (name) {
        this.$refs[name].resetFields()
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
      userDetail () {
        user.findAllForPage({params: Object.assign(this.page, this.formInline)}).then(res => {
          this.tableData1 = res.content
          this.page.totalElements = res.totalElements
        })
      },
      handleReset (index, row) {
        let params = Object.assign({}, row)
        user.setdefaultpass(params.id)
          .then(response => {
            this.$message({
              type: 'success',
              message: '重置成功!'
            })
          }, response => {
            console.info('fail')
          })
      }
    }
  }
</script>

<style>

</style>
