<template>
  <div class="producerManage">
  <el-col :span="24" class="queryBar">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
     <el-form-item label="申请单号">
        <el-input v-model="formInline.scrapNumber"></el-input>
     </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table border :data="tableData" v-loading="isLoading" border tooltip-effect="dark" element-loading-text="拼命加载中" style="width:100%" class="queryBar">
       <el-table-column type="index" label="序号"  align="center" width="80">
      </el-table-column>
      <el-table-column prop="scrapNumber" label="申请单号" width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="applier.name" label="申请人" width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="applyTime" label="申请时间"  width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="description" label="申请说明" width="150" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="approver.name" label="审核人" width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="approverTime" label="审核时间"  width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="approverDescription" label="审核说明" width="150" show-overflow-tooltip>
      </el-table-column>
       <el-table-column label="申请单状态" width="120" fixed="right" show-overflow-tooltip>
         <template slot-scope="scope">
           <el-tag  :type="formatStatusStyle(scope.row.state)">
             {{ formatStatus(scope.row.state) }}
           </el-tag>
         </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template slot-scope="scope">
           <router-link :to="'/rejectConfirmDetail/'+scope.row.id">
            <el-button size="small" class="mr-10">详情</el-button>
          </router-link>
          <el-button type="success" class="editBtn" size="small" @click="open(scope.$index, scope.row)">确认</el-button>
        </template>
    </el-table-column>
    </el-table>
    </el-col>
  </div>
</template>
<script>
import { scrap } from '../../api/api'
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
        scrapNumber: '',
        state: 1
      }
    }
  },
  methods: {
    open (index, row) {
      this.$prompt('请输入确认描述', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[\S]{1,20}$/,
        inputErrorMessage: '请输入20个以内的文字'
      }).then(({ value }) => {
        let params = Object.assign({}, row)
        params.state = 3
        params.excuteDescription = value
        scrap.update(params.id, params)
          .then(response => {
            this.$message({
              showClose: true,
              message: '确认成功',
              type: 'success'
            })
            this.checkList()
          }, response => {
            this.$message({
              showClose: true,
              message: '确认失败',
              type: 'error'
            })
          })
      })
    },
    checkList () {
      this.isLoading = true
      scrap.findByPage({params: Object.assign(this.page, this.formInline)})
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
    formatStatus (status) {
      if (status === 1) {
        return '待确认'
      } else if (status === 2) {
        return '已拒绝'
      } else if (status === 3) {
        return '已通过'
      } else {
        return '待审核'
      }
    },
    formatStatusStyle (status) {
      if (status === 1) {
        return 'success'
      } else if (status === 0) {
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
