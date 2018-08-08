<template>
  <div class="producerManage">
  <el-col :span="24" class="queryBar">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="编码">
          <el-input v-model="formInline.rfidCode"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
    </el-form>
    <el-table border :data="tableData" v-loading="isLoading" border tooltip-effect="dark" element-loading-text="拼命加载中" style="width:100%" class="queryBar">
      <el-table-column type="index" label="序号"  align="center" width="80">
      </el-table-column>
      <el-table-column prop="instrument.rfidCode" label="RFID编码"  width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="" label="编码"  width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="instrument.instrumentDict.name" label="名称" width="100"  show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="instrument.instrumentDict.instrumentType.name" label="类型" width="100"  show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="instrument.instrumentDict.spec" label="规格" width="100"  show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="zipCode" label="状态" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.instrument.state | parseInstrumentStatus }}
        </template>
      </el-table-column>
      <el-table-column prop="maintainTime" label="最近保养时间" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="maintainTime" label="保养类型" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.maintainType | parseMaintainType }}
        </template>
      </el-table-column>
    </el-table>
    </el-col>
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
  </div>
</template>
<script>
import { maintainlogs } from '../../api/api'
export default {
  data () {
    return {
      tableData: [],
      isLoading: false,
      // 是否显示添加界面
      addFormVisible: false,
      // 表格查询条件
      formInline: {
        rfidCode: ''
      },
      page: {
        page: 1,
        size: 10,
        totalElements: 0
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
      maintainlogs.findByPage({params: Object.assign(this.page, this.formInline)})
        .then(response => {
          this.isLoading = false
          this.page.totalElements = response.totalElements
          this.tableData = response.content
        }, response => {
          console.info('fail')
        })
    },
    handleSizeChange (val) {
      console.info(val)
    },
    handleCurrentChange (val) {
      this.onSubmit()
    }
  }
}
</script>
