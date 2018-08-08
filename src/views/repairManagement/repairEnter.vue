<template>
  <div class="producerManage">
  <el-col :span="24" class="queryBar">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <!--<el-form-item label="RFID编码">-->
          <!--<el-input v-model="formInline.name"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item>-->
          <!--<el-button type="primary" @click="onSubmit">查询</el-button>-->
        <!--</el-form-item>-->
      <el-button class="btn-export" @click="onMaintain">提交</el-button>
    </el-form>
    </el-col>
    <el-table border :data="tableData" v-loading="isLoading" border tooltip-effect="dark" @selection-change="handleSelectionChange" element-loading-text="拼命加载中" style="width:100%" class="queryBar">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column
        type="index"
        label="序号"  align="center"
        width="80">
      </el-table-column>
      <el-table-column prop="instrument.instrumentsCode" label="编码" width="200" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="instrument.rfidCode" label="RFID编码" width="200" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="instrument.instrumentDict.name" label="名称" width="200" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="instrument.instrumentDict.spec" label="规格" width="200" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="instrument.registerTime" label="登记日期" width="200" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="breakdownDescription" label="损坏描述" width="200">
      </el-table-column>
      <el-table-column prop="insRepairState" label="维修状态" width="200">
        <template slot-scope="scope">
          <el-select v-model="scope.row.insRepairState" placeholder="请选择" size="small">
            <el-option
              v-for="item in insRepairStates"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="repairDescription" label="维修结果描述" width="200">
        <template slot-scope="scope">
          <el-input v-model="scope.row.repairDescription" placeholder="请输入内容"  size="small"></el-input>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  import { repair } from '../../api/api'
  export default {
    data () {
      return {
        tableData: [],
        multipleSelection: [],
        isLoading: false,
        // 是否显示添加界面
        addFormVisible: false,
        // 表格查询条件
        formInline: {
          name: '',
          type: ''
        },
        page: {
          page: 1,
          size: 10,
          totalElements: 0
        },
        // 新增界面数据
        addForm: {
          name: '',
          userCode: '',
          department: {
            id: null
          },
          callNumber: '',
          loginName: '',
          password: '',
          stopFlag: true,
          addToolType: '',
          isUse: '',
          date1: '',
          date2: ''
        },
        insRepairStates: [
          {
            value: 0,
            label: '等待维修'
          },
          {
            value: 1,
            label: '损坏过于严重而无法维修'
          },
          {
            value: 2,
            label: '维修成功'
          }
        ]
      }
    },
    methods: {
      addSystem () {
        this.addFormVisible = true
      },
      refDialog (name) {
        this.$refs[name].resetFields()
      },
      onSubmit (rfid) {
        this.isLoading = true
        repair.repairapplys(rfid)
          .then(response => {
            this.isLoading = false
            // 判断是否存在
            if (response) {
              let obj = this.tableData.find(x => {
                return x.id === response.id
              })
              if (obj) {
                this.$message({
                  showClose: true,
                  message: '列表存在该器械',
                  type: 'error'
                })
              } else {
                this.tableData.push(response)
              }
            } else {
              this.$message({
                showClose: true,
                message: '该器械未申请维修',
                type: 'error'
              })
            }
          }, response => {
            console.info('fail')
          })
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      onMaintain () {
        repair.rfidEnter(this.multipleSelection)
          .then(response => {
            this.$message({
              type: 'success',
              message: '维修确认成功'
            })
            this.multipleSelection.map((x) => {
              var index = this.tableData.indexOf(x)
              if (index >= 0) {
                this.tableData.splice(index, 1)
              }
            })
          }, response => {
          })
      },
      handleSizeChange (val) {
        console.info(val)
      },
      handleCurrentChange (val) {
        this.onSubmit()
      }
    },
    mounted () {
      this.nativeFun('startScan')
    },
    beforeDestroy () {
      this.nativeFun('stopScan')
    }
  }
</script>
<style>
  .btn-export{
    float: right;
    margin-left:15px !important;
  }
</style>
