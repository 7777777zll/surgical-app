<template>
  <div class="producerDict">
    <el-col :span="24" class="queryBar">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="formInline.startTime"
            type="date"
            placeholder="选择日期"
            :picker-options="startOption">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="formInline.endTime"
            type="date"
            placeholder="选择日期"
            :picker-options="endOption">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="部门">
          <el-select v-model="formInline.departmentId">
            <el-option
              v-for="item in departmentList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="器械字典">
          <el-select v-model="formInline.dictId">
            <el-option
              v-for="item in instrumentDictList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.spec }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark"  v-loading="isLoading" element-loading-text="拼命加载中">
      <el-table-column
        type="index"
        label="序号"  align="center"
        width="80">
      </el-table-column>
      <el-table-column prop="dict_name" label="名称" width="250" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="dict_spec" label="规格" width="200" show-overflow-tooltip>
      </el-table-column>
            <el-table-column prop="dept_name" label="部门名称" width="200"  show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="loansum" label="借用数量(把/次)" width="200" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="returnsum" label="归还数量(把/次)" width="200"  show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="oversum" label="逾期数量(把/次)" width="200"  show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="badsum" label="损坏数量(把/次)" width="200"  show-overflow-tooltip>
      </el-table-column>

    </el-table>
    <el-col :span="24" class="queryBar">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="page.page" :page-size="page.size" layout="total, prev, pager, next" :total="page.totalElements" style="float: right">
      </el-pagination>
    </el-col>
  </div>
</template>

<script>
  import { report, instrumentDict, department } from '../../api/api'
  export default {
    data () {
      return {
        // 时间选择设置
        startOption: {
          disabledDate (time) {
            return time.getTime() < Date.now() - 8.64e7
          }
        },
        endOption: {
          disabledDate (time) {
            return time.getTime() < Date.now() - 8.64e7
          }
        },
        // 表格数据
        tableData: [],
        // 部门列表
        departmentList: [],
        // 器械类型列表
        instrumentDictList: [],
        // 显示表格时候是否loading
        isLoading: false,
        // 表格查询条件
        formInline: {
          startTime: null,
          endTime: null,
          departmentId: null,
          dictId: null
        },
        // 分页对象
        page: {
          page: 1,
          size: 10,
          totalElements: 0
        }
      }
    },
    methods: {
      refDialog (name) {
        this.$refs[name].resetFields()
      },
      onSubmit () {
        this.isLoading = true
        this.formInline.startTime = this.formInline.startTime
          ? this.moment(this.formInline.startTime)
              .utc(8)
              .format('YYYY-MM-DD')
          : null
        this.formInline.endTime = this.formInline.endTime
          ? this.moment(this.formInline.endTime)
              .utc(8)
              .format('YYYY-MM-DD')
          : null
        report.loan({ params: Object.assign(this.page, this.formInline) }).then(
          response => {
            this.isLoading = false
            this.page.totalElements = response.totalElements
            this.tableData = response.content
            console.info(response)
          },
          response => {
            console.info('fail')
            this.isLoading = false
          }
        )
      },
      handleSelectionChange () {},
      handleSizeChange (val) {
        console.info(val)
      },
      handleCurrentChange (val) {
        this.onSubmit()
      },
      initData () {
        // 所有器械字典
        instrumentDict.findAll().then(
          response => {
            this.instrumentDictList = [{ id: null, name: '全部' }].concat(
              response
            )
          },
          response => {
            console.info(response)
          }
        )
        // 所有部门
        department.findAll().then(
          response => {
            this.departmentList = [{ id: null, name: '全部' }].concat(response)
          },
          response => {
            console.info(response)
          }
        )
      }
    },
    mounted () {
      this.onSubmit()
      this.initData()
    }
  }
</script>

<style>
  .queryBar {
  }
</style>
