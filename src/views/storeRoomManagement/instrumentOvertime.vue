<template>
  <div class="producerManage">
  <el-col :span="24" class="queryBar">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="借用单位">
          <el-select v-model="formInline.departmentId" filterable placeholder="请选择">
            <el-option
              v-for="item in departmentList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
    </el-form>
    <el-table border :data="tableData" v-loading="isLoading" border tooltip-effect="dark" element-loading-text="拼命加载中" style="width:100%" class="queryBar">
      <el-table-column type="index" label="序号"  align="center" width="80">
      </el-table-column>
      <el-table-column prop="instrument.instrumentDict.name" label="名称" width="150" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="instrument.instrumentDict.instrumentType.name" label="规格" width="150" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="instrument.instrumentsCode" label="编号" width="150" show-overflow-tooltip>
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
    </el-col>
  </div>
</template>
<script>
import { instrumentloan, department } from '../../api/api'
export default {
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
      departmentList: [],
      // 表格查询条件
      formInline: {
        departmentId: null
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
    initData () {
      // 所有部门
      department.findAll()
        .then(response => {
          this.departmentList = [{value: null, label: '全部'}]
          response.map((x) => {
            this.departmentList.push({
              value: x.id,
              label: x.name
            })
          })
        }, response => {
          console.info(response)
        })
    },
    addSystem () {
      this.addFormVisible = true
    },
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
    this.initData()
    this.onSubmit()
  }
}
</script>
