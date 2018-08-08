<template>
  <div class="producerManage">
  <el-col :span="24" class="queryBar">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="状态">
          <el-select v-model="formInline.state">
            <el-option label="全部" value=""></el-option>
            <el-option label="已借出" value="1"></el-option>
            <el-option label="未归还" value="2"></el-option>
            <el-option label="逾期" value="3"></el-option>
            <el-option label="丢失" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
    </el-form>
    <el-table border :data="tableData" v-loading="isLoading" border tooltip-effect="dark" element-loading-text="拼命加载中" style="width:100%" class="queryBar">
      <el-table-column type="index" label="序号"  align="center" width="80">
      </el-table-column>
     <el-table-column prop="instrumentRoom" label="器械库房"  width="150" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="instrument.rfidCode" label="编号" width="150" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="instrument.instrumentDict.name" label="器械名称" width="150" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="loanTime" label="借出时间" width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="loanPerson.name" label="借用人" width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="loadDept.name" label="借用人单位"  width="150" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="loanHandler.name" label="借用经手人" width="150" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="expectedTime" label="预计归还时间" width="150" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="returnTime" label="归还时间" width="150" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="returnHandler.name" label="归还经手人" width="150" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="overdue" label="是否逾期" width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.overdue ? '是' : '否'}}
        </template>
      </el-table-column>
       <el-table-column prop="returnState" :formatter="_formatType" label="归还情况" width="150" show-overflow-tooltip>
      </el-table-column>
      <!--<el-table-column fixed="right" label="操作">-->
        <!--<template slot-scope="scope">-->
           <!--<router-link :to="'/instrumentListDetail/'+scope.row.id">-->
              <!--<el-button size="small" @click="handleInfo(scope.$index, scope.row)">详情</el-button>-->
           <!--</router-link>-->
        <!--</template>-->
      <!--</el-table-column>-->
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
import { instrumentloan } from '../../api/api'
export default {
  data () {
    return {
      tableData: [],
      isLoading: false,
      isShowCell: true,
      // 是否显示添加界面
      addFormVisible: false,
      page: {
        page: 1,
        size: 10,
        totalElements: 0
      },
      // 表格查询条件
      formInline: {
        state: ''
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
        date1: '',
        date2: ''
      }
    }
  },
  methods: {
    addSystem () {
      this.addFormVisible = true
    },
    onSubmit () {
      // this.isLoading = true
      instrumentloan.findByPage({params: Object.assign(this.page, this.formInline)})
        .then(response => {
          this.isLoading = false
          this.page.totalElements = response.totalElements
          this.tableData = response.content
        }, response => {
          console.info('fail')
        })
    },
    isShow (status) {
      if (status === 0) {
        this.isShowCell = false
        return false
      } else {
        this.isShowCell = true
        return true
      }
    },
    handleCurrentChange (val) {
      this.onSubmit()
    },
    handleSizeChange (val) {
      console.info(val)
    },
    _formatType (row, column) {
      // 序列化类型
      var reason = ['丢失', '部分损坏', '完全损坏', '其他']
      return reason[row.returnState]
    }
  },
  mounted () {
    this.onSubmit()
  }
}
</script>
