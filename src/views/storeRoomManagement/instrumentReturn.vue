<template>
  <div class="producerManage">
  <el-col :span="24" class="queryBar">
    <el-form :inline="true" :model="addForm" class="demo-form-inline">
      <el-form-item label="器械编号">
        <el-input v-model="rfidCode"> <el-button slot="append" icon="el-icon-search" @click="getInstrumentLoan(rfidCode)"></el-button></el-input>
      </el-form-item>
      <el-form-item label="归还人">
        <el-input v-model="addForm.returnPerson.name"></el-input>
      </el-form-item>
       <!--<el-form-item>-->
        <!--<el-button type="primary" @click="onSubmit">查询</el-button>-->
      <!--</el-form-item>-->
      <el-form-item>
        <el-button type="primary" @click="onSubmit">归还</el-button>
      </el-form-item>
    </el-form>
    <el-table @selection-change="handleSelectionChange" border :data="instrumentList" border tooltip-effect="dark" element-loading-text="拼命加载中" style="width:100%" class="queryBar">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column type="index" label="序号"  align="center" width="80">
      </el-table-column>
      <el-table-column prop="loanTime" label="器械库房"  width="150" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="instrument.rfidCode" label="编号" width="150" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="instrument.instrumentDict.name" label="名称" width="150" show-overflow-tooltip>
      </el-table-column>
            <el-table-column prop="instrument.instrumentDict.spec" label="型号" width="150" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="instrument.instrumentDict.instrumentType.name" label="类型" width="150" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="instrument.instrumentDict.producerDict.name" label="生产商" width="150" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="isOverTime" label="是否逾期"  width="100" show-overflow-tooltip>
         <template slot-scope="scope">
          <el-tag  :type="formatStatusStyle(scope.row.overdue)">
            {{ formatStatus(scope.row.overdue) }}
          </el-tag>
         </template>
      </el-table-column>
       <el-table-column prop="returnState" label="归还描述"  width="200" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-select v-model="scope.row.returnState" placeholder="请选择">
            <el-option
              v-for="item in returnState"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
         </template>
      </el-table-column>
      <!--<el-table-column fixed="right" label="操作">-->
        <!--<template slot-scope="scope">-->
           <!--<router-link :to="'/instrumentReturnDetail/'+scope.row.id">-->
              <!--<el-button size="small" @click="handleInfo(scope.$index, scope.row)">详情</el-button>-->
           <!--</router-link>-->
        <!--</template>-->
      <!--</el-table-column>-->
    </el-table>
    </el-col>
  </div>
</template>
<script>
import { user, instrumentloan } from '../../api/api'
export default {
  data () {
    return {
      returnState: [
        {
          value: 0,
          label: '丢失'
        },
        {
          value: 1,
          label: '部分损坏'
        },
        {
          value: 2,
          label: '完全损坏'
        },
        {
          value: 3,
          label: '其他情况'
        }
      ],
      rfidCode: '',
      instrumentList: [],
      // 新增界面数据
      addForm: {
        multipleSelection: [],
        returnPerson: {
          id: null
        }
      }
    }
  },
  methods: {
    addSystem () {
      this.addFormVisible = true
    },
    addSubmit () {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          console.info('ok')
        } else {
          console.info('error')
        }
      })
    },
    refDialog (name) {
      this.$refs[name].resetFields()
    },
    onSubmit () {
      this.addForm.multipleSelection.map((x) => {
        x.returnPerson = this.addForm.returnPerson
      })
      instrumentloan.back(this.addForm.multipleSelection)
        .then(response => {
          this.addForm.multipleSelection.map((x) => {
            var index = this.instrumentList.indexOf(x)
            if (index >= 0) {
              this.instrumentList.splice(index, 1)
            }
          })
        }, response => {
          console.info('fail')
        })
    },
    getUser (id) {
      user.findOne(id)
        .then(response => {
          this.addForm.returnPerson = response
        }, response => {
          console.info('fail')
        })
    },
    getInstrumentLoan (rfid) {
      if (!rfid) {
        this.$message({
          message: '请输入器械编号',
          type: 'warning'
        })
      } else {
        instrumentloan.findByRfid({params: {rfidCode: rfid}})
          .then(response => {
            let obj = this.instrumentList.find((x) => {
              return x.id === response.id
            })
            if (!obj && response) {
              this.instrumentList.push(response)
              this.rfidCode = ''
            }
          }, response => {
            console.info('fail')
          })
      }
    },
    handleSelectionChange (val) {
      this.addForm.multipleSelection = val
    },
    formatStatus (status) {
      return status ? '已逾期' : '未逾期'
    },
    formatStatusCpl (status) {
      return status ? '是' : '否'
    },
    formatStatusStyle (status) {
      return status ? 'danger' : 'success'
    }
  },
  mounted () {
    this.getUser(2)
  }
}
</script>
