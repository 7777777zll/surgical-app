<template>
    <div class="peopleDetail">
      <el-col :span="24" class="queryBar">
        <el-form :model="formInline" inline label-position="left">
          <router-link to="/systemManagement/voucherManagement">
            <el-button class="btn-export" type="primary">返回</el-button>
          </router-link>
          <el-button class="btn-export" @click="addSystem">新增IC卡</el-button>
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
        <el-table-column prop="certficateContent" label="IC卡号" show-overflow-tooltip></el-table-column>
        <!--<el-table-column prop="pinYin" label="拼音" width="100" show-overflow-tooltip></el-table-column>-->
        <el-table-column prop="useable" label="凭证类型" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.certificateType === 1 ? '指纹' : 'IC卡'}}
          </template>
        </el-table-column>
        <el-table-column prop="useable" label="凭证状态" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.useable ? '启用' : '停用'}}
          </template>
        </el-table-column>
        <!--<el-table-column prop="register" label="电话" width="100" show-overflow-tooltip></el-table-column>-->
        <!--<el-table-column prop="deviceId" label="登录名" width="120" show-overflow-tooltip></el-table-column>-->
        <!--<el-table-column prop="register" label="密码" width="100" show-overflow-tooltip></el-table-column>-->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="warning" size="small"  @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
    <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false" @close="refDialog('addForm')">
      <el-form :model="addForm" label-width="130px" :rules="addFormRules" ref="addForm">
        <el-form-item label="IC卡号" prop="certficateContent" required>
          <el-input v-model="addForm.certficateContent" auto-complete="off"></el-input>
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
          certficateContent: '',
          user: {
            id: this.$route.params.id
          },
          certificateType: 0,
          useable: true
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
          certficateContent: [
            { required: true, message: '请输入IC卡号', trigger: 'blur' }
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
        this.addFormVisible = true
      },
      addSubmit () {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.addLoading = true
            let params = Object.assign({}, this.addForm)
            user.addIcCard(this.addForm.user.id, params)
              .then(response => {
                this.$message({
                  showClose: true,
                  message: '添加成功',
                  type: 'success'
                })
                this.addLoading = false
                this.addFormVisible = false
                this.$refs['addForm'].resetFields()
                this.userDetail()
              }, response => {
                this.$message({
                  showClose: true,
                  message: '添加失败',
                  type: 'error'
                })
                this.addLoading = false
              })
          } else {
            console.info('error')
          }
        })
      },
      userDetail () {
        user.icCard(this.$route.params.id, {params: Object.assign(this.page)}).then(res => {
          this.tableData1 = res.content
          this.page.totalElements = res.totalElements
        })
      },
      handleDelete (index, row) {
        let params = Object.assign({}, row)
        user.delIcCard(params.id)
          .then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.userDetail()
          }, response => {
            console.info('fail')
          })
      }
    }
  }
</script>

<style>

</style>
