<template>
  <div class="producerDict">
    <el-col :span="24" class="queryBar">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="开始时间">         
          <el-date-picker v-model="formInline.startTime" type="datetime" placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间">                  
          <el-date-picker v-model="formInline.endTime" type="datetime" placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>       
        <el-form-item>
          <el-button type="primary" @click="onSubmit" class="demo-form-inline">查询</el-button>
        </el-form-item>  
      </el-form>
    </el-col>
    <el-table border :data="tableData" v-loading="isLoading" border tooltip-effect="dark" element-loading-text="拼命加载中" style="width:100%">
      <el-table-column prop="index" label="序号"  align="center" >
      </el-table-column>
      <el-table-column prop="name" label="名称"  show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="spell" label="拼音"  show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="address" label="地址"  show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="zipCode" label="邮编"  show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="contacts" label="联系人"  show-overflow-tooltip>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import {instrumentAbnormal} from '../../api/api'
export default {
  data () {
    return {
      formInline: {
        startTime: '',
        endTime: ''
      },
      tableData: [],
      isLoading: false,
      page: {
        page: 1,
        size: 10,
        totalElements: 0
      }
    }
  },
  methods: {
    onSubmit () {
      // this.isLoading = true
      instrumentAbnormal.list({ params: Object.assign(this.page, this.formInline) })
        .then(response => {
          this.isLoading = false
          this.page.totalElements = response.totalElements
          this.tableData = response.content
          // console.info(JSON.stringify(this.tableData))
        }, response => {
          console.info('fail')
        })
    }
  },
  mounted () {
    this.onSubmit()
  }
}
</script>
