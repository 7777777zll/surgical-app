<template>
  <div class="instrumentType">
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
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="addSystem">新增</el-button>
        </el-form-item>
        <el-button class="btn-export importBtn" @click="upLoadExcl">导入Excl</el-button>
        <el-dropdown class="btn-export" @command="exportExcl">
          <el-button class="exportBtn">
            导出Excl<i class="el-icon-caret-bottom el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command='all'>导出全部</el-dropdown-item>
            <el-dropdown-item command='check'>导出选中</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-form>
    </el-col>
    <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" v-loading="isLoading" element-loading-text="拼命加载中">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column
        type="index"
        label="序号"  align="center"
        width="80"
        fixed="left">
      </el-table-column>
      <el-table-column prop="name" label="名称" width="220" show-overflow-tooltip fixed="left">
      </el-table-column>
      <el-table-column prop="spec" label="规格" width="200" show-overflow-tooltip>
      </el-table-column>
            <el-table-column prop="instrumentType.name" label="类型" width="180" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="producerDict.name" label="生产商" width="120" show-overflow-tooltip>
      </el-table-column>
      <!--<el-table-column prop="overhaulingDate" label="检修期限" width="120" show-overflow-tooltip>-->
      <!--</el-table-column>-->
      <!--<el-table-column prop="scrapDate" label="报废期限" width="120" show-overflow-tooltip>-->
      <!--</el-table-column>-->
      <el-table-column prop="useable" label="状态" :formatter="_formatType" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作" width="250" fixed="right">
        <template slot-scope="scope">
          <el-button size="small" @click="handleInfo(scope.$index, scope.row)">详情</el-button>
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
      <el-form :model="addForm" label-width="140px" :rules="addFormRules" ref="addForm">
        <el-form-item label="名称" prop="name">
          <el-input v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="instrumentType.id">
          <el-select v-model="addForm.instrumentType.id" filterable auto-complete="off" placeholder="请选择器械类型">
            <el-option
              v-for="item in instrumentTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生产商" prop="producerDict.id">
          <el-select v-model="addForm.producerDict.id" filterable auto-complete="off" placeholder="请选择生产商">
            <el-option
              v-for="item in producerDictList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规格" prop="spec">
          <el-input v-model="addForm.spec" auto-complete="off"></el-input>
        </el-form-item>
        <!--<el-form-item label="检修期限 (分钟)" prop="overhaulingDate">-->
          <!--<el-input v-model="addForm.overhaulingDate" auto-complete="off"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="报废期限 (分钟)" prop="scrapDate">-->
          <!--<el-input v-model="addForm.scrapDate" auto-complete="off"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="图片">
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :on-change="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--编辑界面-->
    <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="130px" :rules="editFormRules" ref="editForm">
        <el-form-item label="名称" prop="name">
          <el-input v-model="editForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="instrumentType.id">
          <el-select v-model="editForm.instrumentType.id" filterable auto-complete="off" placeholder="请选择器械类型">
            <el-option
              v-for="item in instrumentTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生产商" prop="producerDict.id">
          <el-select v-model="editForm.producerDict.id" filterable auto-complete="off" placeholder="请选择生产商">
            <el-option
              v-for="item in producerDictList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规格" prop="spec">
          <el-input v-model="editForm.spec" auto-complete="off"></el-input>
        </el-form-item>
        <!--<el-form-item label="检修期限 (分钟)" prop="overhaulingDate">-->
          <!--<el-input v-model="editForm.overhaulingDate" auto-complete="off"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="报废期限 (分钟)" prop="scrapDate">-->
          <!--<el-input v-model="editForm.scrapDate" auto-complete="off"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="">
          <el-switch v-model="editForm.useable" active-color="#13ce66" inactive-color="#ff4949" active-text="启用" inactive-text="停用" @change="useableChange"></el-switch>
        </el-form-item>
        <el-form-item label="图例">
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :on-change="handleAvatarSuccess"
            :before-upload="editBeforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="创建人">
          <el-input v-model="editForm.creater.name" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-input v-model="editForm.createrTime" auto-complete="off" disabled></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--详情界面-->
    <el-dialog title="详情" :visible.sync="infoFormVisible" :close-on-click-modal="false" width="70%">
      <table class="table-detail table-bordered">
        <tbody>
          <tr>
            <td class="title">名称</td>
            <td>{{editForm.name}}</td>
            <td class="title">类型</td>
            <td>{{editForm.instrumentType.name}}</td>
            <td class="title">生产商</td>
            <td>{{editForm.producerDict.name}}</td>
          </tr>
          <tr>
            <td class="title">规格</td>
            <td>{{editForm.spec}}</td>
            <td class="title">检修期限</td>
            <td>{{editForm.overhaulingDate}}</td>
            <td class="title">报废期限</td>
            <td>{{editForm.scrapDate}}分钟</td>
          </tr>
          <tr>
            <td class="title">状态</td>
            <td>{{_formatType(editForm)}}</td>
            <td class="title">创建人</td>
            <td>{{editForm.creater ? editForm.creater.name : ''}}</td>
            <td class="title">创建时间</td>
            <td>{{editForm.createrTime}}</td>
          </tr>
          <tr>
            <td class="title">更新人</td>
            <td>{{editForm.updateOperator}}</td>
            <td class="title">更新时间</td>
            <td>{{editForm.updateTime}}</td>
            <td class="title">图例</td>
            <td><img v-if="imageUrl" :src="imageUrl" class="avatar"></td>
          </tr>
        </tbody>
      </table>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="infoFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>

    <!--上传界面-->
    <el-dialog title="导入Excl" :visible.sync="upLoadFormVisible" :close-on-click-modal="false">
      <el-upload
        class="upload-demo"
        ref="upload"
        action="api/instrumentdicts/Excel"
        :file-list="fileList"
        :on-progress="progress"
        :auto-upload="false">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
        <div slot="tip" class="el-upload__tip">只能上传Excel文档</div>
      </el-upload>
    </el-dialog>

  </div>
</template>

<script>
  import { instrumentDict, producerDict, instrumentType } from '../../api/api'
  import moment from 'moment/moment'
  export default {
    data () {
      return {
        imageUrl: null,
        // 判斷圖片是否符合規則
        isLt2M: false,
        // 时间控件设置
        pickerOptions: {
          disabledDate (time) {
            return time.getTime() < moment()
          }
        },
        // 下拉框数据
        instrumentTypeList: [],
        producerDictList: [],
        // 表格数据
        tableData: [],
        // 显示表格时候是否loading
        isLoading: false,
        // 是否显示添加界面
        addFormVisible: false,
        // 是否显示编辑界面
        editFormVisible: false,
        // 是否显示详情界面
        infoFormVisible: false,
        // 是否显示导入界面
        upLoadFormVisible: false,
        // 导入列表
        fileList: [],
        // 表格选中列表
        multipleSelection: [],
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
          instrumentType: {
            id: null
          },
          producerDict: {
            id: null
          },
          spec: '',
          overhaulingDate: '',
          scrapDate: '',
          useable: true,
          image: ''
        },
        addLoading: false,
        addFormRules: {
          name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
          'instrumentType.id': [
            {
              required: true,
              message: '请选择器械类型',
              trigger: 'blur',
              type: 'number'
            }
          ],
          'producerDict.id': [
            {
              required: true,
              message: '请选择器械生产商',
              trigger: 'blur',
              type: 'number'
            }
          ],
          spec: [{ required: true, message: '请输入规格型号', trigger: 'blur' }]
        },
        editLoading: false,
        // 编辑界面数据
        editForm: {
          id: null,
          name: '',
          instrumentType: {
            id: null
          },
          producerDict: {
            id: null
          },
          creater: {
            name: ''
          },
          createrTime: '',
          spec: '',
          overhaulingDate: '',
          scrapDate: '',
          useable: null,
          image: ''
        },
        editFormRules: {
          name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
          'instrumentType.id': [
            {
              required: true,
              message: '请选择器械类型',
              trigger: 'blur',
              type: 'number'
            }
          ],
          'producerDict.id': [
            {
              required: true,
              message: '请选择器械生产商',
              trigger: 'blur',
              type: 'number'
            }
          ],
          spec: [{ required: true, message: '请输入规格型号', trigger: 'blur' }]
        }
      }
    },
    methods: {
      refDialog (name) {
        this.$refs[name].resetFields()
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
      exportExcl (e) {
        // 0 打印全部 , 1打印选中
        let idArr = []
        if (e === 'check') {
          // 打印选中
          this.multipleSelection.map((x, i) => {
            idArr[i] = x.id
          })
        }
        window.location.href = 'api/instrumentdicts/Excel?ids=' + idArr.join()
        return false
      },
      useableChange (val) {
        // 即将进行的操作
        let op = val
        let text = op ? '启用' : '停用'
        this.$confirm('此操作将' + text + '该生产商, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {})
          .catch(() => {
            this.editForm.useable = !val
          })
      },
      _formatType (row, column) {
        // 序列化类型
        return row.useable ? '启用' : '停用'
      },
      handleInfo (index, row) {
        this.infoFormVisible = true
        this.editForm = Object.assign({}, row)
        let baseUrl = self.location.protocol + '//' + self.location.hostname
        if (self.location.port !== '') {
          baseUrl = baseUrl + ':' + self.location.port
        }
        this.imageUrl = `${baseUrl}/api/instrumentdicts/${row.code}/image`
      },
      handleChange (index, row) {
        let enabled = row.useable
        let text = enabled ? '停用' : '启用'
        this.$confirm('此操作将' + text + '该器械字典, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            let rowObj = Object.assign({}, row)
            rowObj.useable = !rowObj.useable
            let params = new FormData()
            for (var p in rowObj) {
              params.append(
                p,
                typeof rowObj[p] === 'object' && p !== 'image'
                  ? rowObj[p].id
                  : rowObj[p]
              )
            }
            instrumentDict.updateVendor(rowObj.id, params).then(
              response => {
                this.$message({
                  type: 'success',
                  message: text + '成功!'
                })
                this.onSubmit()
              },
              response => {
                this.$message({
                  type: 'error',
                  message: text + '失败!'
                })
              }
            )
          })
          .catch(() => {
            console.info('关闭停用')
          })
      },
      handleEdit (index, row) {
        this.editFormVisible = true
        this.editForm = Object.assign({}, row)
        let baseUrl = self.location.protocol + '//' + self.location.hostname
        if (self.location.port !== '') {
          baseUrl = baseUrl + ':' + self.location.port
        }
        this.imageUrl = `${baseUrl}/api/instrumentdicts/${row.code}/image`
        //        this.getImgById(row.id)
      },
      editSubmit () {
        this.$refs.editForm.validate(valid => {
          if (valid) {
            let params = new FormData()
            for (var p in this.editForm) {
              console.info(p)
              console.info(this.editForm[p])
              params.append(
                p,
                typeof this.editForm[p] === 'object' && p !== 'image'
                  ? this.editForm[p].id
                  : this.editForm[p]
              )
            }
            this.editLoading = true
            //            let params = Object.assign({}, this.editForm)
            instrumentDict.updateVendor(this.editForm.id, params).then(
              response => {
                this.$message({
                  showClose: true,
                  message: '编辑成功',
                  type: 'success'
                })
                this.editLoading = false
                this.editFormVisible = false
                this.onSubmit()
              },
              response => {
                this.$message({
                  showClose: true,
                  message: '编辑失败',
                  type: 'error'
                })
                this.editLoading = false
              }
            )
          } else {
            console.info('error')
          }
        })
      },
      addSubmit () {
        this.$refs.addForm.validate(valid => {
          if (valid) {
            let params = new FormData()
            for (var p in this.addForm) {
              params.append(
                p,
                typeof this.addForm[p] === 'object' && p !== 'image'
                  ? this.addForm[p].id
                  : this.addForm[p]
              )
            }
            this.addLoading = true
            //            let params = Object.assign({}, this.addForm)
            instrumentDict.save(params).then(
              response => {
                this.$message({
                  showClose: true,
                  message: '添加成功',
                  type: 'success'
                })
                this.addLoading = false
                this.addFormVisible = false
                this.$refs['addForm'].resetFields()
                this.onSubmit()
              },
              response => {
                this.$message({
                  showClose: true,
                  message: '添加失败',
                  type: 'error'
                })
                this.addLoading = false
              }
            )
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
        instrumentDict
          .findAllForPage({ params: Object.assign(this.page, this.formInline) })
          .then(
            response => {
              this.isLoading = false
              this.page.totalElements = response.totalElements
              this.tableData = response.content
            },
            response => {
              console.info('fail')
            }
          )
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      handleSizeChange (val) {
        console.info(val)
      },
      handleCurrentChange (val) {
        this.onSubmit()
      },
      initData () {
        // 加载下拉框数据
        // 所有供应商
        producerDict.findAllNoPage().then(
          response => {
            this.producerDictList = []
            response.map(x => {
              this.producerDictList.push({
                value: x.id,
                label: x.name
              })
            })
          },
          response => {
            console.info(response)
          }
        )
        // 所有器械类型
        instrumentType.findAllNoPage().then(
          response => {
            this.instrumentTypeList = []
            response.map(x => {
              this.instrumentTypeList.push({
                value: x.id,
                label: x.name
              })
            })
          },
          response => {
            console.info(response)
          }
        )
      },
      editBeforeAvatarUpload (file) {
        const isLt2M = file.size / 1024 / 1024 < 0.8
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 800kb!')
        } else {
          this.editForm.image = file
        }
        this.isLt2M = isLt2M
        return isLt2M
      },
      beforeAvatarUpload (file) {
        const isLt2M = file.size / 1024 / 1024 < 0.8
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 800kb!')
        } else {
          this.addForm.image = file
        }
        this.isLt2M = isLt2M
        return isLt2M
      },
      handleAvatarSuccess (file, fileList) {
        if (this.isLt2M) {
          this.imageUrl = URL.createObjectURL(file.raw)
        }
      },
      getImgById (id) {
        instrumentDict.findImgById(id).then(
          response => {},
          response => {
            console.info(response)
          }
        )
        // 所有器械类型
      }
    },
    mounted () {
      this.onSubmit()
      this.initData()
    }
  }
</script>

<style lang="scss">
  .avatar-uploader {
    .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .el-upload:hover {
      border-color: #20a0ff;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      min-width: 178px;
      width: auto;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    .avatar {
      width: auto;
      min-width: 178px;
      height: 178px;
      display: block;
      margin: 10px auto 0px auto;
    }
  }
</style>
