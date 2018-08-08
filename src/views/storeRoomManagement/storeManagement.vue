<template>
  <div class="producerDict">
    <el-col :span="24" class="queryBar">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="名称">
          <el-input v-model="formInline.name"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="formInline.useable">
            <el-option label="全部" value=""></el-option>
            <el-option label="启用" value="true"></el-option>
            <el-option label="停用" value="false"></el-option>
          </el-select>
        </el-form-item>
         <el-form-item>
          <el-button type="success" @click="addSystem">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
        <!--<el-button class="btn-export importBtn" @click="upLoadExcl">导入Excel</el-button>-->
        <!--<el-dropdown class="btn-export" @command="exportExcl">-->
          <!--<el-button class="exportBtn">-->
            <!--导出Excel<i class="el-icon-caret-bottom el-icon&#45;&#45;right"></i>-->
          <!--</el-button>-->
          <!--<el-dropdown-menu slot="dropdown">-->
            <!--<el-dropdown-item command='all'>导出全部</el-dropdown-item>-->
            <!--<el-dropdown-item command='check'>导出选中</el-dropdown-item>-->
          <!--</el-dropdown-menu>-->
        <!--</el-dropdown>-->
      </el-form>
    </el-col>
    <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" @selection-change="handleSelectionChange" v-loading="isLoading" element-loading-text="拼命加载中">
      <el-table-column
        type="index"
        label="序号"  align="center"
        width="80">
      </el-table-column>
      <el-table-column prop="name" label="名称" width="220" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="creator.name" label="创建人" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="location" label="位置" width="220" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="useable" label="状态" width="120" :formatter="_formatType" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template slot-scope="scope">
          <!--<el-button size="small" @click="handleInfo(scope.$index, scope.row)">详情</el-button>-->
          <el-button type="warning" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button :type="scope.row.useable ? 'danger' : 'success'" size="small" @click="handleChange(scope.$index, scope.row)">{{ scope.row.useable ? '停用' : '启用' }}</el-button>
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
      <el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm">
        <el-form-item label="名称" prop="name">
          <el-input v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="库房位置" prop="location">
          <el-input v-model="addForm.location" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--编辑界面-->
    <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="100px"  :rules="editFormRules" ref="editForm">
        <el-form-item label="名称" prop="name">
          <el-input v-model="editForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="库房位置" prop="location">
          <el-input v-model="editForm.location" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="创建人" prop="location">
          <el-input v-model="editForm.creator.name" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="创建时间" prop="location">
          <el-input v-model="editForm.createTime" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-switch v-model="editForm.useable" active-color="#13ce66" inactive-color="#ff4949" active-text="启用" inactive-text="停用" @change="useableChange"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--详情界面-->
    <el-dialog title="详情" :visible.sync="infoFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" ref="editForm" inline label-position="left">
        <el-col :span="8">
          <el-form-item label="名称:">
            {{editForm.name}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="简称:">
            {{editForm.shrotName}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="国别:">
            {{editForm.country}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="地址:">
            {{editForm.address}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系人:">
            {{editForm.contacts}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系电话:">
            {{editForm.contactNumber}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="E-mail:">
            {{editForm.email}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态:">
            {{_formatType(editForm)}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="创建人:">
            {{editForm.creator ? editForm.creator.name : ''}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="创建时间:">
            {{editForm.createrTime}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="更新人:">
            {{editForm.updateOperator ? editForm.updateOperator.name : ''}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="更新时间:">
            {{editForm.updateTime}}
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="infoFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>

    <!--上传界面-->
    <el-dialog title="导入Excl" :visible.sync="upLoadFormVisible" :close-on-click-modal="false">
      <el-upload
        class="upload-demo"
        ref="upload"
        action="api/producers/Excel"
        :file-list="fileList"
        :on-progress="progress"
        :auto-upload="false">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </el-dialog>

  </div>
</template>

<script>
  import { storeRoom } from '../../api/api'
  import { validatePhone } from '@/utils/validates'
  export default {
    data () {
      return {
        // 表格数据
        tableData: [
        ],
        // 表格选中列表
        multipleSelection: [],
        // 显示表格时候是否loading
        isLoading: false,
        // 是否显示添加界面
        addFormVisible: false,
        // 是否显示编辑界面
        editFormVisible: false,
        // 是否显示导入界面
        upLoadFormVisible: false,
        // 是否显示详情界面
        infoFormVisible: false,
        // 导入列表
        fileList: [],
        // 表格查询条件
        formInline: {
          name: '',
          useable: ''
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
          location: '',
          useable: true
        },
        addLoading: false,
        addFormRules: {
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ],
          location: [
            { required: true, message: '请输入库房位置', trigger: 'blur' }
          ]
        },
        editLoading: false,
        // 编辑界面数据
        editForm: {
          id: 0,
          name: '',
          shrotName: '',
          country: '',
          address: '',
          contacts: '',
          contactNumber: '',
          email: '',
          creator: {
            name: ''
          },
          useable: null
        },
        editFormRules: {
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ],
          country: [
            { required: true, message: '请输入国别', trigger: 'blur' }
          ],
          address: [
            { required: true, message: '请输入地址', trigger: 'blur' }
          ],
          contacts: [
            { required: true, message: '请输入联系人', trigger: 'blur' }
          ],
          contactNumber: [
            { required: true, message: '请输入联系电话', trigger: 'blur' },
            { validator: validatePhone, trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入E-mail', trigger: 'blur' },
            { type: 'email', message: '请输入正确的E-mail', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      refDialog (name) {
        this.$refs[name].resetFields()
      },
      useableChange (val) {
        // 即将进行的操作
        let op = val
        let text = op ? '启用' : '停用'
        this.$confirm('此操作将' + text + '该库房, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

        }).catch(() => {
          this.editForm.useable = !val
        })
      },
      progress (event, file, fileList) {
        console.info(event)
      },
      submitUpload () {
        this.$refs.upload.submit()
      },
      upLoadExcl () {
        this.upLoadFormVisible = true
      },
      _formatType (row, column) {
        // 序列化类型
        return row.useable ? '启用' : '停用'
      },
      exportExcl (e) {
        // 0 打印全部 , 1打印选中
        let idArr = []
        if (e === 'check') {
          // 打印选中
          this.multipleSelection.map((x, i) => {
            idArr[i] = x.id
          })
        }
        window.location.href = 'api/producers/Excel?ids=' + idArr.join()
        return false
      },
      handleChange (index, row) {
        let useable = row.useable
        let text = useable ? '停用' : '启用'
        this.$confirm('此操作将' + text + '该库房, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = Object.assign({}, row)
          param.useable = !param.useable
          storeRoom.update(param.id, param)
            .then(response => {
              this.$message({
                type: 'success',
                message: text + '成功!'
              })
              this.onSubmit()
            }, response => {

            })
        }).catch(() => {
          console.info('关闭停用')
        })
      },
      handleEdit (index, row) {
        this.editFormVisible = true
        this.editForm = Object.assign({}, row)
      },
      handleInfo (index, row) {
        this.infoFormVisible = true
        this.editForm = Object.assign({}, row)
      },
      editSubmit () {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.editLoading = true
            let params = Object.assign({}, this.editForm)
            storeRoom.update(params.id, params)
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
            storeRoom.add(params)
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
        storeRoom.findByPage({params: Object.assign(this.page, this.formInline)})
          .then(response => {
            this.isLoading = false
            this.page.totalElements = response.totalElements
            this.tableData = response.content
          }, response => {
            console.info('fail')
          })
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
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
