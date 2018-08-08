<template>
  <div class="producerDict">
    <el-col :span="24" class="queryBar">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="字典类型">
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
        <el-form-item label="库房">
          <el-select v-model="formInline.storeId">
            <el-option
              v-for="item in departmentList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
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
      <el-table-column prop="name" label="名称" width="250" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="type" label="类型" width="200" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="productor" label="生产商" width="200" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="spec" label="规格" width="200" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="count" label="数量"  show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <el-col :span="24" class="queryBar">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="page.page" :page-size="page.size" layout="total, prev, pager, next" :total="page.totalElements" style="float: right">
      </el-pagination>
    </el-col>
  </div>
</template>

<script>
import { instruments, instrumentDict, storeRoom } from '../../api/api'
export default {
  data () {
    return {
      // 表格数据
      tableData: [],
      // 器械字典列表
      instrumentDictList: [],
      // 库房列表
      departmentList: [],
      // 显示表格时候是否loading
      isLoading: false,
      // 表格查询条件
      formInline: {
        storeId: null,
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
      instruments.inventory({params: Object.assign(this.page, this.formInline)})
        .then(response => {
          this.isLoading = false
          this.page.totalElements = response.totalElements
          this.tableData = response.content
          console.info(response)
        }, response => {
          console.info('fail')
        })
    },
    handleSelectionChange () {

    },
    handleSizeChange (val) {
      console.info(val)
    },
    handleCurrentChange (val) {
      this.onSubmit()
    },
    initData () {
      // 所有器械
      instrumentDict.findAll()
        .then(response => {
          this.instrumentDictList = [{ id: null, name: '全部' }].concat(response)
        }, response => {
          console.info(response)
        })
      // 所有部门
      storeRoom.findAll()
        .then(response => {
          this.departmentList = [{ id: null, name: '全部' }].concat(response)
        }, response => {
          console.info(response)
        })
    }
  },
  mounted () {
    this.onSubmit()
    this.initData()
  }
}
</script>

<style>
.queryBar {}
</style>
