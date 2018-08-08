<template>
  <div class="instrumentBagInfo">
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
      <el-table-column
        type="index"
        label="序号"  align="center"
        width="80">
      </el-table-column>
      <el-table-column prop="bagCode" label="编号" width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="operator.name" label="操作员" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="instrumentList" label="器械列表"  show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="createDate" label="登记时间" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="stopFlag" label="状态" width="120" :formatter="_formatType" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-button type="danger" size="small">详情</el-button>
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
        <el-form-item label="编号" prop="name">
          <el-input v-model="addForm.bagCode" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="操作员" prop="zipCode">
          <el-select filterable v-model="addForm.operator.id" placeholder="请选择操作员">
              <el-option
                v-for="item in staffList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--编辑界面-->
    <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
        <el-form-item label="编号" prop="name">
          <el-input v-model="editForm.bagCode" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="操作员" prop="zipCode">
          <el-select filterable v-model="editForm.operator.id" placeholder="请选择操作员">
            <el-option
              v-for="item in staffList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="editForm.stopFlag" on-color="#13ce66" off-color="#ff4949" on-text="启用" off-text="停用" @change="stopFlagChange"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { instrumentBagInfo, user } from '../../api/api'
  export default {
    data () {
      return {
        staffList: [],
        // 表格数据
        tableData: [],
        // 是否显示上传界面
        upLoadFormVisible: false,
        // 显示表格时候是否loading
        isLoading: false,
        // 是否显示添加界面
        addFormVisible: false,
        // 是否显示编辑界面
        editFormVisible: false,
        // 是否显示分配界面
        allotFormVisible: false,
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
          bagCode: '',
          operator: {
            id: null
          },
          stopFlag: true
        },
        addLoading: false,
        addFormRules: {
        },
        editLoading: false,
        // 编辑界面数据
        editForm: {
          id: null,
          bagCode: '',
          operator: {
            id: null
          },
          stopFlag: null
        },
        editFormRules: {
        },
        allotLoading: false,
        // 分配界面数据
        allotForm: {
          operatingRoom: null,
          staff: null
        }
      }
    },
    methods: {
      refDialog (name) {
        this.$refs[name].resetFields()
      },
      _formatType (row, column) {
        // 序列化类型
        return row.stopFlag ? '启用' : '停用'
      },
      handleChange (index, row) {
        let enabled = row.stopFlag
        let text = enabled ? '停用' : '启用'
        this.$confirm('此操作将' + text + '该耗材包, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = Object.assign({}, row)
          param.stopFlag = !param.stopFlag
          instrumentBagInfo.update(param)
            .then(response => {
              this.$message({
                type: 'success',
                message: '报废成功!'
              })
              this.onSubmit()
            }, response => {
              this.$message({
                type: 'error',
                message: '报废失败!'
              })
            })
        }).catch(() => {
          console.info('关闭停用')
        })
      },
      stopFlagChange (val) {
        // 即将进行的操作
        let op = val
        let text = op ? '启用' : '停用'
        this.$confirm('此操作将' + text + '该器械包, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

        }).catch(() => {
          this.editForm.stopFlag = !val
        })
      },
      handleEdit (index, row) {
        this.editFormVisible = true
        this.editForm = Object.assign({}, row)
      },
      editSubmit () {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.editLoading = true
            let params = Object.assign({}, this.editForm)
            instrumentBagInfo.update(params)
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
            instrumentBagInfo.add(params)
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
      onSubmit () {
        // this.isLoading = true
        instrumentBagInfo.list({params: Object.assign(this.page, this.formInline)})
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
      },
      initData () {
        user.findAll()
          .then(response => {
            this.staffList = []
            response.map((x) => {
              this.staffList.push({
                value: x.id,
                label: x.name
              })
            })
          }, response => {
            console.info(response)
          })
      }
    },
    mounted () {
      this.onSubmit()
      this.initData()
    }
  }
</script>

<style>
  .btn-export{
    float: right;
    margin-left:15px !important;
  }
</style>
