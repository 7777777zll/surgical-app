<template>
    <div>
      <el-col :span="24" class="queryBar">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item>
            <el-input v-model="formInline.name" placeholder="名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="addSystem">新增</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" v-loading="isLoading" element-loading-text="拼命加载中">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="名称" width="120" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="enabled" label="状态" width="120">
          <template slot-scope="scope">{{ scope.row.enabled ? '停用' : '启用' }}</template>
        </el-table-column>
        <el-table-column prop="type" label="类型" :formatter="_formatType">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
            <el-button type="warning" size="small" @click="handleChange(scope.$index, scope.row)">{{ scope.row.enabled ? '启用' : '停用' }}</el-button>
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
      <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false" @close="refDialog('addForm')">
        <el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm">
          <el-form-item label="名称" prop="name">
            <el-input v-model="addForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-select v-model="addForm.type" auto-complete="off" placeholder="请选择系统类型">
              <el-option
                v-for="item in selectTypeData"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <template v-if="addForm.type == 0">
            <el-form-item label="数据库" prop="param.className">
              <el-select v-model="addForm.param.className" auto-complete="off" @change="addDbChange">
                <el-option
                  v-for="item in selectDbData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="IP地址" prop="param.host">
              <el-input v-model="addForm.param.host" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="端口号" prop="param.port">
              <el-input v-model="addForm.param.port" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="数据库名称" prop="param.name">
              <el-input v-model="addForm.param.name" auto-complete="off" placeholder="oracle数据库填写实例名"></el-input>
            </el-form-item>
            <el-form-item label="用户名" prop="param.username">
              <el-input v-model="addForm.param.username" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="param.password">
              <el-input type="password" v-model="addForm.param.password" auto-complete="off"></el-input>
            </el-form-item>
          </template>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
        </div>
      </el-dialog>

      <!--编辑界面-->
      <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
        <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
          <el-form-item label="名称" prop="name">
            <el-input v-model="editForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-select v-model="editForm.type" auto-complete="off" placeholder="请选择系统类型">
              <el-option
                v-for="item in selectTypeData"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <template v-if="editForm.type == 0">
            <el-form-item label="数据库" prop="param.className">
              <el-select v-model="editForm.param.className" auto-complete="off" @change="editDbChange">
                <el-option
                  v-for="item in selectDbData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="IP地址" prop="param.host">
              <el-input v-model="editForm.param.host" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="端口号" prop="param.port">
              <el-input v-model="editForm.param.port" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="数据库名称" prop="param.name">
              <el-input v-model="editForm.param.name" auto-complete="off" placeholder="oracle数据库填写实例名"></el-input>
            </el-form-item>
            <el-form-item label="用户名" prop="param.username">
              <el-input v-model="editForm.param.username" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="param.password">
              <el-input type="password" v-model="editForm.param.password" auto-complete="off"></el-input>
            </el-form-item>
          </template>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="editFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
    import { InterfaceGroups } from '../../api/api'
    export default {
      data () {
        return {
          // 下拉框数据
          selectTypeData: [
            { value: 0, label: '数据库' },
            { value: 1, label: 'webService' },
            { value: 2, label: 'MQ' }
          ],
          selectDbData: [
            { value: 'com.mysql.jdbc.Driver', label: 'mysql' },
            { value: 'oracle.jdbc.driver.OracleDriver', label: 'oracle' },
            { value: 'com.microsoft.sqlserver.jdbc.SQLServerDriver', label: 'sqlserver' }
          ],
          // 表格数据
          tableData: [
          ],
          // 显示表格时候是否loading
          isLoading: false,
          // 是否显示添加界面
          addFormVisible: false,
          // 是否显示编辑界面
          editFormVisible: false,
          // 表格查询条件
          formInline: {
            name: ''
          },
          // 分页对象
          page: {
            page: 1,
            size: 10,
            totalElements: 0
          },
          // 新增界面数据
          addForm: {
            name: '',
            type: null,
            param: {
              className: null,
              host: '',
              port: '',
              name: '',
              username: '',
              password: '',
              databaseType: ''
            }
          },
          addLoading: false,
          addFormRules: {
            name: [
              { required: true, message: '请输入名称', trigger: 'blur' }
            ],
            type: [
              { required: true, type: 'number', message: '请选择系统类型', trigger: 'blur' }
            ],
            'param.className': [
              { required: true, message: '请选择数据库类型', trigger: 'blur' }
            ],
            'param.host': [
              { required: true, message: '请输入IP地址', trigger: 'blur' }
            ],
            'param.port': [
              { required: true, message: '请输入端口号', trigger: 'blur' }
            ],
            'param.name': [
              { required: true, message: '请输入数据库名称', trigger: 'blur' }
            ],
            'param.username': [
              { required: true, message: '请输入用户名', trigger: 'blur' }
            ],
            'param.password': [
              { required: true, message: '请输入密码', trigger: 'blur' }
            ]
          },
          editLoading: false,
          // 编辑界面数据
          editForm: {
            id: 0,
            name: '',
            type: null,
            param: {
              className: null,
              host: '',
              port: '',
              name: '',
              username: '',
              password: '',
              databaseType: ''
            }
          },
          editFormRules: {
            name: [
              { required: true, message: '请输入名称', trigger: 'blur' }
            ],
            type: [
              { required: true, type: 'number', message: '请选择系统类型', trigger: 'blur' }
            ],
            'param.className': [
              { required: true, message: '请选择数据库类型', trigger: 'blur' }
            ],
            'param.host': [
              { required: true, message: '请输入IP地址', trigger: 'blur' }
            ],
            'param.port': [
              { required: true, message: '请输入端口号', trigger: 'blur' }
            ],
            'param.name': [
              { required: true, message: '请输入数据库名称', trigger: 'blur' }
            ],
            'param.username': [
              { required: true, message: '请输入用户名', trigger: 'blur' }
            ],
            'param.password': [
              { required: true, message: '请输入密码', trigger: 'blur' }
            ]
          }
        }
      },
      methods: {
        refDialog (name) {
          this.$refs[name].resetFields()
        },
        addDbChange (value) {
          // 这个组件很恶心, 回调参数只有value
          let selLabel = value
          let label = this.selectDbData.find(function (value, index, arr) {
            return value.value === selLabel
          }).label
          this.addForm.param.databaseType = label
        },
        editDbChange (value) {
          // 这个组件很恶心, 回调参数只有value
          let selLabel = value
          let label = this.selectDbData.find(function (value, index, arr) {
            return value.value === selLabel
          }).label
          this.editForm.param.databaseType = label
        },
        handleChange (index, row) {
          let enabled = row.enabled
          let text = enabled ? '启用' : '停用'
          this.$confirm('此操作将' + text + '该系统, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let param = Object.assign({}, row)
            param.enabled = !param.enabled
            InterfaceGroups.update(param)
            .then(response => {
              this.$message({
                type: 'success',
                message: text + '成功!'
              })
              this.onSubmit()
            }, response => {
              console.info('fail')
            })
          }).catch(() => {
            console.info('关闭停用')
          })
        },
        handleEdit (index, row) {
          this.editFormVisible = true
          this.editForm = Object.assign({}, row)
          this.editForm.param = JSON.parse(this.editForm.param)
        },
        handleDel (index, row) {
          this.$confirm('此操作将永久删除该系统, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            InterfaceGroups.delete(row.id)
            .then(response => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.onSubmit()
            }, response => {
              console.info('fail')
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        },
        editSubmit () {
          this.$refs.editForm.validate((valid) => {
            if (valid) {
              this.editLoading = true
              let params = Object.assign({}, this.editForm)
              params.param = JSON.stringify(params.param)
              InterfaceGroups.update(params)
              .then(response => {
                this.$message({
                  showClose: true,
                  message: '编辑成功',
                  type: 'success'
                })
                this.editLoading = false
                this.editFormVisible = false
                this.onSubmit()
              }, response => {
                this.$message({
                  showClose: true,
                  message: '编辑失败',
                  type: 'error'
                })
                this.editLoading = false
              })
            } else {
              console.info('error')
            }
          })
        },
        addSubmit () {
          this.$refs.addForm.validate((valid) => {
            if (valid) {
              this.addLoading = true
              let params = Object.assign({}, this.addForm)
              params.param = JSON.stringify(params.param)
              InterfaceGroups.add(params)
              .then(response => {
                this.$message({
                  showClose: true,
                  message: '添加成功',
                  type: 'success'
                })
                this.addLoading = false
                this.addFormVisible = false
                this.$refs['addForm'].resetFields()
                this.onSubmit()
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
        addSystem () {
          this.addFormVisible = true
        },
        _formatType (row, column) {
          // 序列化类型
          return row.type === 0 ? '数据库' : row.type === 1 ? 'webService' : row.type === 2 ? 'MQ' : '未知'
        },
        onSubmit () {
          this.isLoading = true
          InterfaceGroups.list({params: Object.assign(this.page, this.formInline)})
          .then(response => {
            this.isLoading = false
            this.page.totalElements = response.totalElements
            this.tableData = response.content
          }, response => {
            console.info('fail')
          })
        },
        handleSelectionChange () {

        },
        handleSizeChange (val) {
          console.info(val)
        },
        handleCurrentChange (val) {
          this.onSubmit()
        }
      },
      mounted () {
        this.onSubmit()
      }
    }
</script>

<style>
  .queryBar{

  }
</style>
