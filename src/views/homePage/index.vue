<template>
  <div class="hello">
    <div class="queryBar el-col el-col-24">
      <h3>逾期提醒</h3>
      <el-table border :data="tableData" v-loading="isLoading" border tooltip-effect="dark" element-loading-text="拼命加载中" style="width:100%" class="queryBar">
        <el-table-column type="index" label="序号"  align="center" width="80">
        </el-table-column>
        <el-table-column prop="instrument.instrumentDict.name" label="器械名称" width="150" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="instrument.instrumentDict.instrumentType.name" label="规格" width="150" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="instrument.instrumentsCode" label="出厂编号" width="150" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="instrument.store.name" label="器械库房"  width="150" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="loanTime" label="借出时间" width="180" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="loanPerson.name" label="借用人" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="loadDept.name" label="借用人单位"  show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="loanHandler.name" label="借用经手人" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="expectedTime" label="预计归还时间" width="110" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.expectedTime | parseDate}}
          </template>
        </el-table-column>
        <!--<el-table-column fixed="right" label="操作" width="100">-->
        <!--<template slot-scope="scope">-->
        <!--<router-link :to="'/instrumentOvertimeDetail/'+scope.row.id">-->
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
    </div>
  </div>
</template>

<script>
  import { instrumentloan } from '../../api/api'
  export default {
    name: 'hello',
    data () {
      return {
        tableData: [],
        isLoading: false,
        // 是否显示添加界面
        addFormVisible: false,
        page: {
          page: 1,
          size: 10,
          totalElements: 0
        },
        formInline: {
          departmentId: null
        }
      }
    },
    methods: {
      onSubmit () {
        // this.isLoading = true
        instrumentloan.getoverdue({params: Object.assign(this.page, this.formInline)})
          .then(response => {
            this.isLoading = false
            this.page.totalElements = response.totalElements
            this.tableData = response.content
          }, response => {
            console.info('fail')
          })
      },
      handleCurrentChange (val) {
        this.onSubmit()
      },
      handleSizeChange (val) {
        console.info(val)
      }
    },
    mounted () {
      this.onSubmit()
    }
  }
</script>
