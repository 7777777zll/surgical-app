<template>
  <div class="producerManage">
    <el-col :span="24" class="queryBar">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="借用人">
          <el-input v-model="formInline.loanPerson.name" disabled></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table border :data="tableData" v-loading="isLoading" border tooltip-effect="dark" element-loading-text="拼命加载中" style="width:100%" class="queryBar">
        <el-table-column type="index" label="序号"  align="center" width="80">
        </el-table-column>
       <el-table-column prop="instrument.store.name" label="器械库房"  width="150" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="instrument.instrumentDict.name" label="器械名称" width="150" show-overflow-tooltip>
        </el-table-column>
         <el-table-column prop="instrument.instrumentDict.spec" label="器械名称" width="150" show-overflow-tooltip>
        </el-table-column>
                <el-table-column prop="instrument.rfidCode" label="编号" width="150" show-overflow-tooltip>
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
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button size="small" @click="handleInfo(scope.$index, scope.row)">确认丢失</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </div>
</template>
<script>
  import { instrumentloan, user } from '../../api/api'
  export default {
    data () {
      return {
        tableData: [],
        isLoading: false,
        // 表格查询条件
        formInline: {
          loanPerson: {
            id: null,
            name: ''
          }
        }
      }
    },
    methods: {
      addSystem () {
        this.addFormVisible = true
      },
      handleInfo (index, row) {
        let param = Object.assign({}, row)
        param.returnState = 0
        param.returnPerson = this.formInline.loanPerson
        instrumentloan.lost([param]).then(
          response => {
            this.$message({
              showClose: true,
              message: '补录成功',
              type: 'success'
            })
            this.onSubmit()
          },
          response => {
            console.info('fail')
          }
        )
      },
      getUser (id) {
        if (id) {
          user.findOne(id).then(
            response => {
              this.formInline.loanPerson = response
            },
            response => {
              console.info('fail')
            }
          )
        }
      },
      onSubmit () {
        if (!this.formInline.loanPerson || !this.formInline.loanPerson.id) {
          this.$message({
            showClose: true,
            message: '请进行指纹验证',
            type: 'error'
          })
          return false
        }
        this.isLoading = true
        instrumentloan.findByUserId(this.formInline.loanPerson.id).then(
          response => {
            this.tableData = response
            this.isLoading = false
          },
          response => {
            console.info('fail')
            this.isLoading = false
          }
        )
      }
    },
    mounted () {}
  }
</script>
