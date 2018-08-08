<template>
  <div class="instrumentLogs">
    <el-col :span="24" class="queryBar">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="名称">
          <el-input :model="formInline.name" placeholder="填写器材名称"></el-input>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker type="datetime" :model="formInline.startTime" placeholder="选择开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker type="datetime" :model="formInline.endTime" placeholder="选择结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item >
          <el-button type="primary" @click="onSubmit">
            查询
          </el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-table :data="tableData" >
      <el-table-column label="序号"  align="center" prop="index"></el-table-column>
      <el-table-column label="器械" prop="index"></el-table-column>
      <el-table-column label="操作类型" prop="index"></el-table-column>
      <el-table-column label="器械柜" prop="index"></el-table-column>
      <el-table-column label="器械包" prop="index"></el-table-column>
      <el-table-column label="手持机" prop="index"></el-table-column>
      <el-table-column label="操作时间" prop="index"></el-table-column>
      <el-table-column label="操作人" prop="index"></el-table-column>
    </el-table>
  </div>
</template>
<script>
import {instrumentLogs} from '../../api/api'
export default {
  data () {
    return {
      formInline: {
        name: '',
        startTime: '',
        endTime: ''
      },
      isLoading: false,
      tableData: [],
      page: {
        page: 1,
        size: 10,
        totalElements: 0
      }
    }
  },
  methods: {
    onSubmit () {
      instrumentLogs.list({ params: Object.assign(this.page, this.formInline) })
      .then(Response => {
        this.isLoading = false
        this.page.totalElements = Response.totalElements
        this.tableData = Response.content
        console.info(JSON.stringify(this.tableData))
      }, Response => {
        console.info('fail')
      })
    }
  },
  mounted () {
    this.onSubmit()
  }
}
</script>
<style>

</style>
