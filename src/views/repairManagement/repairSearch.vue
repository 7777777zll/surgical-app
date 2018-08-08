<template>
  <div class="producerManage">
  <el-col :span="24" class="queryBar">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="申请单号">
        <el-input v-model="formInline.obbNumber"></el-input>
      </el-form-item>
      <el-form-item label="时间选择">
        <el-date-picker
          v-model="formInline.TimeArr"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table border :data="tableData" v-loading="isLoading" border tooltip-effect="dark" element-loading-text="拼命加载中" style="width:100%" class="queryBar">
      <el-table-column type="index" label="序号"  align="center"  width="80">
      </el-table-column>
      <el-table-column prop="obbNumber" label="申请单号" width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="description" label="申请说明"  width="150" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="approver.name" label="审批人" width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="approverTime" label="审批时间" width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="approverDescription" label="审批说明"  width="150" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="excuter.name" label="执行人" width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="excuteTime" label="执行时间" width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="excuteDescription" label="执行说明" width="150" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作" width="100" fixed="right">
        <template slot-scope="scope">
           <router-link :to="'/repairSearchDetail/'+scope.row.id">
            <el-button size="small" class="mr-10" >详情</el-button>
          </router-link>
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
import { repair } from '../../api/api'
export default {
  data () {
    return {
      tableData: [],
      isLoading: false,
      page: {
        page: 1,
        size: 10,
        totalElements: 0
      },
      // 表格查询条件
      formInline: {
        obbNumber: '',
        TimeArr: []
      }
    }
  },
  methods: {
    open () {
      this.$message('已确认')
    },
    checkList () {
      console.info(JSON.stringify(this.formInline))
      if (this.formInline.TimeArr && this.formInline.TimeArr.length === 2) {
        this.formInline.startTime = this.formInline.TimeArr[0]
        this.formInline.endTime = this.formInline.TimeArr[1]
      }
      this.isLoading = true
      repair.findByPage({params: Object.assign(this.page, this.formInline)})
        .then(response => {
          this.isLoading = false
          this.page.totalElements = response.totalElements
          this.tableData = response.content
          console.log(this.tableData)
        }, response => {
          console.info('fail')
        })
    },
    refuse (index, row) {
      console.log(index, row)
      this.$prompt('请输入拒绝理由', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[\S]{1,20}$/,
        inputErrorMessage: '请输入20个以内的文字'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '已拒绝!'
        })
      })
    },
    onSubmit () {
      this.checkList()
    },
    handleSizeChange (val) {
      console.info(val)
    },
    handleCurrentChange (val) {
      this.checkList()
    }
  },
  mounted: function () {
    this.checkList()
  }
}
</script>
