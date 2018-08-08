<template>
  <div class="producerDict">
    <el-col :span="24" class="queryBar">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="类型">
          <el-select v-model="formInline.typeId">
            <el-option
              v-for="item in instrumentTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分配状态">
          <el-select v-model="formInline.distributionStatus">
            <el-option label="全部" value=""></el-option>
            <el-option label="器械柜" value="0"></el-option>
            <el-option label="库房" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="formInline.term" placeholder="RFID/名称/拼音/规格/编码 "></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-dropdown class="btn-export" @command="exportExcl">
          <el-button class="exportBtn">
            导出Excl<i class="el-icon-caret-bottom el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="0">导出全部</el-dropdown-item>
            <el-dropdown-item command="1">导出选中</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- <div style="float:right">
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addSystem">新增</el-button>
          </el-form-item>
        </div> -->
      </el-form>
    </el-col>
    <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" v-loading="isLoading" element-loading-text="拼命加载中">
      <el-table-column type="selection" width="55" fixed="left"></el-table-column>
      <el-table-column
        type="index"
        label="序号"  align="center"
        width="80"
        fixed="left">
      </el-table-column>
      <el-table-column prop="instrumentDict.name" label="名称" width="200" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="instrumentDict.spec" label="规格" width="200" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="instrumentsCode" label="编码" width="200" fixed="left" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="rfidCode" label="RFID编码" width="200" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="name" label="分配状态" width="200" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.distributionStatus === 0 ? '器械柜' : scope.row.distributionStatus === 1 ? '库房' : '未知' }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="所属位置" width="200" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.cabinet ? '' : ''}}
          {{ scope.row.store ? scope.row.store.name : ''}}
        </template>
      </el-table-column>
      <el-table-column prop="registerTime" label="登记日期" width="200" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="stopFlag" label="状态" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.state | parseInstrumentStatus }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template slot-scope="scope">
          <router-link :to="'/instrumentDetail/'+scope.row.id">
            <el-button size="small">详情</el-button>
          </router-link>
          <el-button size="small" type="warning" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <!--<el-button size="small" @click="handleInfo(scope.$index, scope.row)">详情</el-button>-->
          <el-button v-if="scope.row.stopFlag" type="danger" size="small" @click="handleChange(scope.$index, scope.row)">报废</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-col :span="24" class="queryBar">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="page.page" :page-size="page.size" layout="total, prev, pager, next" :total="page.totalElements" style="float: right">
      </el-pagination>
    </el-col>

    <!--编辑界面-->
    <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
        <el-form-item label="RFID编码" prop="rfidCode">
          <el-input v-model="editForm.rfidCode" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="器械类型">
          <el-select v-model="editForm.instrumentDict.id" filterable>
            <el-option
              v-for="item in instrumentDictList"
              :key="item.id"
              :label="item.name + ' - ' + item.spec"
              :value="item.id">
              <span style="float: left">{{ item.name + ' - ' + item.spec }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.producerDict.name }}</span>
            </el-option>
          </el-select>
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
          <el-form-item label="编码:">
            {{editForm.instrumentsCode}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="RFID编码:">
            {{editForm.rfidCode}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="名称:">
            {{editForm.instrumentDict.name}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="规格:">
            {{editForm.instrumentDict.spec}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="分配设备:">
            {{ editForm.distributionStatus === 0 ? '器械柜' : editForm.distributionStatus === 1 ? '库房' : '未知' }}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="设备编码:">
            {{ editForm.cabine ? editForm.cabine.cabineCode : ''}}
            {{ editForm.bag ? editForm.bag.bagCode : ''}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="本次柜外时间:">
            {{ editForm.outCabineTime }}分
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="总计柜外时间:">
            {{ editForm.outCabineTimeCount }}分
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="最近检修时间:">
            {{ editForm.maintenanceTime }}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="检修状态:">
            {{ editForm.maintenanceType == 0 ? '未检修' : editForm.maintenanceType == 1 ? '准备检修' : '完成检修'}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="登记人:">
            {{ editForm.InstrumentRegistor }}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="登记时间:">
            {{ editForm.registerTime }}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态:">
            {{ editForm.state | parseInstrumentStatus }}
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="infoFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { instruments, instrumentType, instrumentDict } from '../../api/api'
  export default {
    data () {
      return {
        // 表格数据
        tableData: [],
        // 器械类型数据
        instrumentTypeList: [],
        // 器械规格列表, 跟随类型联动
        instrumentSpecList: [],
        // 器械字典列表
        instrumentDictList: [],
        // 显示表格时候是否loading
        isLoading: false,
        // 是否显示编辑界面
        editFormVisible: false,
        // 是否显示详情界面
        infoFormVisible: false,
        // 表格查询条件
        formInline: {
          typeId: null,
          spec: '',
          distributionStatus: null,
          stopFlag: null
        },
        // 分页对象
        page: {
          page: 1,
          size: 10,
          totalElements: 0
        },
        editLoading: false,
        // 编辑界面数据
        editForm: {
          id: null,
          rfidCode: '',
          instrumentDict: {
            id: null
          }
        },
        editFormRules: {
          name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
          type: [
            {
              required: true,
              type: 'number',
              message: '请选择系统类型',
              trigger: 'blur'
            }
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
      handleChange (index, row) {
        let text = '报废'
        this.$confirm('此操作将报废该器械, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            let param = Object.assign({}, row)
            param.stopFlag = !param.stopFlag
            instruments.update(param).then(
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
      handleInfo (index, row) {
        this.infoFormVisible = true
        this.editForm = Object.assign({}, row)
      },
      handleEdit (index, row) {
        this.editFormVisible = true
        this.editForm = Object.assign({}, row)
      },
      editSubmit () {
        this.$refs.editForm.validate(valid => {
          if (valid) {
            this.editLoading = true
            let params = Object.assign({}, this.editForm)
            instruments.update(params.id, params).then(
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
      exportExcl (e) {
        // 0 打印全部 , 1打印选中
        if (e) {
          // 打印选中
          console.info(this.multipleSelection)
        } else {
          // 打印全部
        }
        console.info(this.multipleSelection)
      },
      onSubmit () {
        this.isLoading = true
        instruments
          .list({ params: Object.assign(this.page, this.formInline) })
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
      handleSelectionChange () {},
      handleSizeChange (val) {
        console.info(val)
      },
      handleCurrentChange (val) {
        this.onSubmit()
      },
      TypeChange (val) {
        // 当前选中, 根据耗材类型ＩＤ获取规格列表
        instrumentDict.findByType(val).then(
          response => {
            this.instrumentSpecList = []
            this.formInline.spec = null
            response.map(x => {
              // 先判断是否存在
              if (this.instrumentSpecList.indexOf(x.spec) < 0) {
                this.instrumentSpecList.push({
                  value: x.spec,
                  label: x.spec
                })
              }
            })
          },
          response => {
            console.info(response)
          }
        )
      },
      initData () {
        // 所有器械
        instrumentDict.findAll().then(
          response => {
            this.instrumentDictList = response
          },
          response => {
            console.info(response)
          }
        )
        // 加载所有器械类型
        instrumentType.findAllNoPage().then(
          response => {
            this.instrumentTypeList = [
              {
                value: '',
                label: '全部'
              }
            ]
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
      }
    },
    mounted () {
      this.onSubmit()
      this.initData()
    }
  }
</script>

<style>
  .queryBar {
  }
</style>
