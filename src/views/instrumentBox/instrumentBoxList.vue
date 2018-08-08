<template>
  <div class="instrumentBoxList">
    <el-col :span="24" class="queryBar">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="编号">
          <el-input v-model="formInline.name"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="formInline.stopFlag">
            <el-option label="全部" value=""></el-option>
            <el-option label="启用" value="true"></el-option>
            <el-option label="报废" value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <!--<el-button type="success" @click="addSystem">新增</el-button>-->
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
      <el-table-column prop="cabineCode" label="编号" width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="uniquenessCode" label="机器唯一码" width="120" show-overflow-tooltip>
      </el-table-column>
      <!--<el-table-column label="在线状态" width="120" show-overflow-tooltip>-->
        <!--<template slot-scope="scope">{{ formatLine(scope.row.onLineStatus) }}</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column label="RFID状态" width="120" show-overflow-tooltip>-->
        <!--<template slot-scope="scope">{{ formatStatus(scope.row.rfidStatus) }}</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column label="锁状态" width="120" show-overflow-tooltip>-->
        <!--<template slot-scope="scope">{{ formatStatus(scope.row.onOffStatus) }}</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column label="刷卡器状态" width="120" show-overflow-tooltip>-->
        <!--<template slot-scope="scope">{{ formatStatus(scope.row.cardReaderStatus) }}</template>-->
      <!--</el-table-column>-->
      <el-table-column prop="registerDate" label="登记时间" width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="lastChangeTime" label="最近同步时间" width="150" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="同步状态" width="120" show-overflow-tooltip>
        <template slot-scope="scope">{{ formatSync(scope.row.identificationOfChanges) }}</template>
      </el-table-column>
      <el-table-column label="柜子状态" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.cabinetState | parseCabinetStateType }}</template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <router-link :to="'/instrumentBoxDetail/'+scope.row.id">
            <el-button size="small" @click="handleInfo(scope.$index, scope.row)">详情</el-button>
          </router-link>
          <el-button type="warning" class="mr-10" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button v-if="scope.row.stopFlag" type="danger" class="mr-10" size="small" @click="handleChange(scope.$index, scope.row)">报废</el-button>
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

    <!--编辑界面-->
    <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false" @close="refDialog('editForm')">
      <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
        <el-form-item label="编号" prop="cabineCode">
          <el-input v-model="editForm.cabineCode" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">确定</el-button>
      </div>
    </el-dialog>
     <!--新增界面-->
    <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false" @close="refDialog('addForm')">
       <el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm">
        <el-form-item label="编号" prop="name">
          <el-input v-model="addForm.cabineCode" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">确定</el-button>
      </div>
    </el-dialog>
    <!--详情界面-->
    <el-dialog title="详情" :visible.sync="infoFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" ref="editForm" inline label-position="left">
        <el-col :span="8">
          <el-form-item label="编号:">
            {{editForm.cabineCode}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="机器唯一码:">
            {{editForm.uniquenessCode}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="在线状态:">
            {{formatLine(editForm.onLineStatus)}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="RFID状态:">
            {{formatStatus(editForm.rfidStatus)}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="锁状态:">
            {{formatStatus(editForm.onOffStatus)}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="刷卡器状态:">
            {{formatStatus(editForm.cardReaderStatus)}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="登记时间:">
            {{editForm.registerDate}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="同步状态	:">
            {{formatSync(editForm.identificationOfChanges)}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="柜子状态:">
            {{formatStopFlag(editForm.stopFlag)}}
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button>查看器械列表</el-button>
        <el-button>查看操作日志</el-button>
        <el-button @click.native="infoFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { instrumentBoxList } from '../../api/api'
  export default {
    data () {
      return {
        staffList: [
          {
            value: 0,
            label: '员工一号'
          },
          {
            value: 1,
            label: '员工二号'
          }
        ],
        operatingRoomList: [
          {
            value: '0',
            label: '一号手术间'
          },
          {
            value: '1',
            label: '二号手术间'
          }
        ],
        instrumentList: [{
          label: '18cm * 72',
          options: [{
            value: '1',
            label: '刀',
            producer: '美敦力'
          }, {
            value: '2',
            label: '叉',
            producer: '健力宝'
          }]
        }, {
          label: '30cm * 2',
          options: [{
            value: '3',
            label: '刀',
            producer: '德国骨科'
          }, {
            value: 'Shenzhen',
            label: '深圳',
            producer: '德国骨科'
          }, {
            value: 'Guangzhou',
            label: '广州',
            producer: '德国骨科'
          }]
        }],
        // 表格数据
        tableData: [
        ],
        // 显示表格时候是否loading
        isLoading: false,
        // 是否显示添加界面
        addFormVisible: false,
        // 是否显示编辑界面
        editFormVisible: false,
        // 是否显示分配界面
        allotFormVisible: false,
        // 是否显示详情界面
        infoFormVisible: false,
        // 表格查询条件
        formInline: {
          uniquenessCode: ''
        },
        // 分页对象
        page: {
          page: 1,
          size: 10,
          totalElements: 0
        },
        addLoading: false,
        addFormRules: {
        },
        editLoading: false,
        // 编辑界面数据
        editForm: {
          cabineCode: ''
        },
        addForm: {
          cabineCode: ''
        },
        editFormRules: {
          cabineCode: [
            { required: true, message: '请输入编号', trigger: 'blur' }
          ]
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
      allotBox (index, row) {
        this.allotFormVisible = true
        this.allotForm = Object.assign({}, row)
      },
      formatSync (status) {
        return status === 1 ? '有更改' : '无更改'
      },
      formatLine (status) {
        return status === 1 ? '在线' : '离线'
      },
      formatStatus (status) {
        return status === 1 ? '异常' : '正常'
      },
      formatStopFlag (status) {
        return status ? '正常' : '报废'
      },
      handleChange (index, row) {
        this.$confirm('此操作将报废该耗材柜, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = Object.assign({}, row)
          param.stopFlag = !param.stopFlag
          instrumentBoxList.update(param.id, param)
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
      handleEdit (index, row) {
        this.editFormVisible = true
        this.editForm = Object.assign({}, row)
      },
      handleInfo (index, row) {
        console.log('航航' + row.id)
        this.editForm = Object.assign({}, row)
      },
      editSubmit () {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.editLoading = true
            let params = Object.assign({}, this.editForm)
            instrumentBoxList.update(params.id, params)
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
            console.log(params)
            instrumentBoxList.add(params)
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
        instrumentBoxList.findAllByPage({params: Object.assign(this.page, this.formInline)})
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
