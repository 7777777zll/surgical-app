<template>
  <div class="producerManage">
  <el-col :span="24" class="queryBar">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="申请单号">
       <el-input :model="formInline.obbNumber"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table border :data="tableData" v-loading="isLoading" border tooltip-effect="dark" element-loading-text="拼命加载中" style="width:100%" class="queryBar">
      <el-table-column type="index" label="序号"  align="center" width="80">
      </el-table-column>
      <el-table-column prop="obbNumber" label="申请单号" width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="description" label="申请说明"  show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="applier.name" label="送修人" width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="applyTime" label="送修时间" width="150" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="申请单状态" width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag  :type="formatStatusStyle(scope.row.obbStatus)">
            {{ formatStatus(scope.row.obbStatus) }}
          </el-tag>
         </template>
      </el-table-column>
      <el-table-column label="操作" width="230">
        <template slot-scope="scope">
          <router-link :to="'/repairApproveDetail/'+scope.row.id">
            <el-button size="small" class="mr-10">详情</el-button>
          </router-link>
          <el-button type="success" class="editBtn" size="small" @click="open(scope.row)">同意</el-button>
          <el-button type="danger" class="editBtn" size="small"  @click="refuse(scope.$index, scope.row)">拒绝</el-button>
        </template>
    </el-table-column>
    </el-table>
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
        obbStatus: 0
      }
    }
  },
  methods: {
    open (row) {
      let params = Object.assign({}, row)
      params.obbStatus = 1
      repair.update(params.id, params)
        .then(response => {
          this.$message({
            showClose: true,
            message: '审核成功',
            type: 'success'
          })
          this.checkList()
        }, response => {
          this.$message({
            showClose: true,
            message: '审核失败',
            type: 'error'
          })
        })
    },
    checkList () {
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
      this.$prompt('请输入拒绝理由', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[\S]{1,20}$/,
        inputErrorMessage: '请输入20个以内的文字'
      }).then(({ value }) => {
        let params = Object.assign({}, row)
        params.obbStatus = 1
        params.approved = false
        params.approverDescription = value
        repair.update(params.id, params)
          .then(response => {
            this.$message({
              showClose: true,
              message: '拒绝成功',
              type: 'success'
            })
            this.checkList()
          }, response => {
            this.$message({
              showClose: true,
              message: '拒绝失败',
              type: 'error'
            })
          })
      })
    },
    onSubmit () {
      this.checkList()
    },
    formatStatus (status) {
      if (status === 0) {
        return '待审核'
      } else if (status === 1) {
        return '待确认'
      } else if (status === 2) {
        return '已确认'
      } else if (status === 3) {
        return '部分确认'
      }
    },
    formatStatusStyle (status) {
      if (status === 2) {
        return 'success'
      } else if (status === -1) {
        return 'danger'
      } else {
        return 'primary'
      }
    }
  },
  created: function () {
    this.checkList()
  }
}
</script>
