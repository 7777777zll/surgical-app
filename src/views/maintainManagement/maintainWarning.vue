<template>
  <div class="producerManage">
  <el-col :span="24" class="queryBar">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <!--<el-form-item label="器械编码">-->
          <!--<el-input v-model="formInline.name"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      <el-button class="btn-export" @click="onMaintain">提交</el-button>
    </el-form>
    <el-table border :data="tableData" v-loading="isLoading" border tooltip-effect="dark" @selection-change="handleSelectionChange" element-loading-text="拼命加载中" style="width:100%" class="queryBar">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column type="index" label="序号"  align="center" width="80">
      </el-table-column>
      <el-table-column prop="instrument.instrumentDict.name" label="名称" width="150" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="instrument.rfidCode" label="RFID编码"  width="200" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="instrument.instrumentDict.instrumentType.name" label="类型" width="150" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="instrument.instrumentDict.spec" label="规格" width="150" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="instrument.instrumentDict.producerDict.name" label="生产商" width="150" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="maintainType" label="保养类型" width="150" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="instrument.nextMainTime" label="保养时间" width="150" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="danger" size="small" @click="handleChange(scope.$index, scope.row)">保养</el-button>
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
    </el-col>
  </div>
</template>
<script>
  import { mainNotify } from '../../api/api'
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
        }
      }
    },
    methods: {
      addSystem () {
        this.addFormVisible = true
      },
      refDialog (name) {
        this.$refs[name].resetFields()
      },
      onSubmit () {
        this.isLoading = true
        mainNotify.findByPage({params: Object.assign(this.page, this.formInline)})
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
      onMaintain () {
        mainNotify.update(this.multipleSelection)
          .then(response => {
            this.$message({
              type: 'success',
              message: '保养成功'
            })
            this.onSubmit()
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
      this.onSubmit()
    }
  }
</script>
<style>
  .btn-export{
    float: right;
    margin-left:15px !important;
  }
</style>
