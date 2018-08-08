<template>
  <div class="producerDict">
    <el-col :span="24" class="queryBar">
      <el-form :inline="true" class="demo-form-inline">
        <!--<el-form-item label="器械编号">-->
          <!--<el-input v-model="rfidCode"> <el-button slot="append" icon="el-icon-search" @click="getInstrument(rfidCode)"></el-button></el-input>-->
        <!--</el-form-item>-->
        <el-form-item>
          <el-button type="primary" @click="resetList">重新扫描</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-table ref="multipleTable" :data="instrumentList" border tooltip-effect="dark">
      <el-table-column
        type="index"
        label="序号"  align="center"
        width="80"
        fixed="left">
      </el-table-column>
      <el-table-column prop="instrumentDict.name" label="名称" width="200" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="instrumentDict.spec" label="规格" width="200" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="instrumentsCode" label="编码" width="200" fixed="left" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="rfidCode" label="RFID编码" width="200" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="name" label="分配状态" width="200" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.distributionStatus === 0 ? '器械柜' : scope.row.distributionStatus === 1 ? '库房' : '未知' }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="所属位置" width="200" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.cabinet ? '' : ''}}
          {{ scope.row.store ? scope.row.store.name : ''}}
        </template>
      </el-table-column>
      <el-table-column prop="registerTime" label="登记日期" width="200" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="stopFlag" label="状态" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.state | parseInstrumentStatus }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import { instruments } from '../../api/api'
  export default {
    data () {
      return {
        // 表格数据
        instrumentList: [],
        // 表格查询条件
        rfidCode: ''
      }
    },
    methods: {
      refDialog (name) {
        this.$refs[name].resetFields()
      },
      getInstrument (rfid) {
        if (!rfid) {
          this.$message({
            message: '请输入器械编号',
            type: 'warning'
          })
        } else {
          instruments.findByRfid({ params: { rfidCode: rfid } }).then(
            response => {
              let obj = this.instrumentList.find(x => {
                return x.id === response.id
              })
              if (!obj && response) {
                this.instrumentList.push(response)
              }
              this.rfidCode = ''
            },
            response => {
              console.info('fail')
            }
          )
        }
      },
      resetList () {
        this.instrumentList = []
        this.nativeFun('resetEpcPoll')
      }
    },
    mounted () {
      this.nativeFun('startScan')
    },
    beforeDestroy () {
      this.nativeFun('stopScan')
    }
  }
</script>

<style>
  .queryBar {
  }
</style>
