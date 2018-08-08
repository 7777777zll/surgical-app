<template>
  <div class="useStatus">
    <el-col :span="24" class="queryBar">
      <el-radio-group class="check-radio" v-model="activeName">
        <el-radio-button label="first">借用</el-radio-button>
        <el-radio-button label="second">归还</el-radio-button>
      </el-radio-group>
      <el-form v-if="activeName === 'first'" :inline="true" :model="loanForm" class="demo-form-inline">
        <!--<el-form-item label="器械编号">-->
          <!--<el-input v-model="rfidCode"> <el-button slot="append" icon="el-icon-search" @click="getInstrument(rfidCode)"></el-button></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="库房">
          <el-select v-model="storeId">
            <el-option
              v-for="item in storeList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="借用人">
          <el-input v-model="loanForm.loanPerson.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="归还时间">
          <el-date-picker
            v-model="loanForm.expectedTime"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onLoanSubmit">借用</el-button>
          <el-button type="primary" @click="resetScan">重新扫描</el-button>
        </el-form-item>
      </el-form>
      <el-form v-if="activeName === 'second'" :inline="true" :model="returnForm" class="demo-form-inline">
        <!--<el-form-item label="器械编号">-->
          <!--<el-input v-model="rfidCode"> <el-button slot="append" icon="el-icon-search" @click="getInstrument(rfidCode)"></el-button></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="库房">
          <el-select v-model="storeId">
            <el-option
              v-for="item in storeList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="归还人">
          <el-input v-model="returnForm.returnPerson.name" disabled></el-input>
        </el-form-item>
        <!--<el-form-item>-->
        <!--<el-button type="primary" @click="onSubmit">查询</el-button>-->
        <!--</el-form-item>-->
        <el-form-item>
          <el-button type="primary" @click="onReturnSubmit">归还</el-button>
        </el-form-item>
        <el-button type="primary" @click="resetScan">重新扫描</el-button>
      </el-form>
      <div v-show="activeName === 'first'">
        <el-table :row-class-name="tableRowClassName" @selection-change="handleSelectionChangeForLoan" border :data="loanInstrumentList"  tooltip-effect="dark" element-loading-text="拼命加载中" class="queryBar">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            type="index"
            label="序号"  align="center"
            width="80">
          </el-table-column>
          <el-table-column prop="instrumentDict.name" label="名称" width="200" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="instrumentDict.spec" label="规格" width="150" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="instrumentsCode" label="编号" width="150" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="instrumentDict.producerDict.name" label="生产商" width="150" show-overflow-tooltip>
          </el-table-column>
          <!--<el-table-column fixed="right" label="操作" width="100">-->
          <!--<template slot-scope="scope">-->
          <!--<router-link :to="'/instrumentBorrowDetail/'+scope.row.id">-->
          <!--<el-button size="small" @click="handleInfo(scope.$index, scope.row)">详情</el-button>-->
          <!--</router-link>-->
          <!--</template>-->
          <!--</el-table-column>-->
        </el-table>
      </div>
      <div v-show="activeName === 'second'">
        <el-table @selection-change="handleSelectionChangeForReturn" border :data="returnInstrumentList" tooltip-effect="dark" element-loading-text="拼命加载中" class="queryBar">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column type="index" label="序号"  align="center" width="80">
          </el-table-column>
          <el-table-column prop="instrument.instrumentDict.name" label="名称" width="150" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="instrument.instrumentDict.spec" label="规格" width="150" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="instrument.instrumentsCode" label="编号" width="150" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="instrument.instrumentDict.producerDict.name" label="生产商" width="150" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="instrument.store.name" label="器械库房"  width="150" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="loanTime" label="借用时间"  width="150" show-overflow-tooltip>
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
        </el-table>
      </div>
    </el-col>
  </div>
</template>
<script>
import { user, instruments, instrumentloan, storeRoom } from '../../api/api'
export default {
  data () {
    return {
      storeId: null,
      storeList: [],
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
      activeName: 'first',
      // 借用集合
      loanInstrumentList: [],
      // 归还集合
      returnInstrumentList: [],
      rfidCode: '',
      loanForm: {
        multipleSelection: [],
        loanPerson: {
          id: null
        },
        instrumentList: [],
        expectedTime: this.moment().day(7)
      },
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      returnForm: {
        multipleSelection: [],
        returnPerson: {
          id: null
        }
      }
    }
  },
  methods: {
    tableRowClassName ({row, rowIndex}) {
      console.info(row)
      if (row.store && row.store.id !== this.storeId) {
        return 'warning-row'
      }
      return ''
    },
    fingerErr () {
      this.$message({
        showClose: true,
        message: '指纹验证失败,请确认该指纹已注册',
        type: 'error'
      })
    },
    resetScan () {
      if (this.activeName === 'first') {
        this.loanInstrumentList = []
      } else if (this.activeName === 'second') {
        this.returnInstrumentList = []
      }
      this.nativeFun('resetEpcPoll')
    },
    refDialog (name) {
      this.$refs[name].resetFields()
    },
    getUser (id) {
      if (id) {
        user.findOne(id)
          .then(response => {
            this.loanForm.loanPerson = response
            this.returnForm.returnPerson = response
          }, response => {
            console.info('fail')
          })
      }
    },
    getInstrument (rfid) {
      if (!rfid) {
        this.$message({
          message: '请输入器械编号',
          type: 'warning'
        })
      } else {
        instruments.findByRfid({params: {rfidCode: rfid}})
          .then(response => {
            // 判断状态
            if (response.state === 2) {
              // 归还
              let obj = this.returnInstrumentList.find((x) => {
                return x.instrument.id === response.id
              })
              if (!obj && response) {
                // 再次请求
                instrumentloan.findByRfid({params: {rfidCode: rfid}})
                  .then(response => {
                    this.returnInstrumentList.push(response)
                  }, response => {
                    console.info('fail')
                  })
              }
            } else {
              let obj = this.loanInstrumentList.find((x) => {
                return x.id === response.id
              })
              if (!obj && response) {
                this.loanInstrumentList.push(response)
              }
            }
            this.rfidCode = ''
          }, response => {
            console.info('fail')
          })
      }
    },
    handleSelectionChangeForLoan (val) {
      this.loanForm.multipleSelection = val
    },
    onLoanSubmit () {
      let params = []
      if (!this.loanForm.loanPerson || !this.loanForm.loanPerson.id) {
        this.$message({
          message: '借用人不能为空',
          type: 'warning'
        })
        return false
      }
      if (!this.loanForm.expectedTime) {
        this.$message({
          message: '请填写预计归还时间',
          type: 'warning'
        })
      } else {
        this.loanForm.multipleSelection.map((x) => {
          params.push({
            loanPerson: this.loanForm.loanPerson,
            expectedTime: this.moment(this.loanForm.expectedTime).format('YYYY-MM-DD'),
            instrument: x
          })
        })
        instrumentloan.loan(this.storeId, params)
          .then(response => {
            this.$message({
              message: '借用成功',
              type: 'success'
            })
            this.loanForm.multipleSelection.map((x) => {
              var index = this.loanInstrumentList.indexOf(x)
              if (index >= 0) {
                this.loanInstrumentList.splice(index, 1)
              }
            })
          }, response => {
            console.info('fail')
          })
      }
      console.info(this.moment(this.loanForm.expectedTime).utc().format('YYYY-MM-DD'))
    },
    onReturnSubmit () {
      if (!this.returnForm.returnPerson || !this.returnForm.returnPerson.id) {
        this.$message({
          message: '归还人不能为空',
          type: 'warning'
        })
        return false
      }
      this.returnForm.multipleSelection.map((x) => {
        x.returnPerson = this.returnForm.returnPerson
      })
      instrumentloan.back(this.storeId, this.returnForm.multipleSelection)
        .then(response => {
          this.$message({
            message: '归还成功',
            type: 'success'
          })
          this.returnForm.multipleSelection.map((x) => {
            var index = this.returnInstrumentList.indexOf(x)
            if (index >= 0) {
              this.returnInstrumentList.splice(index, 1)
            }
          })
        }, response => {
          console.info('fail')
        })
    },
    handleSelectionChangeForReturn (val) {
      this.returnForm.multipleSelection = val
    },
    handleClick (tab, event) {
      let index = tab.index
      if (index === '0') {
        // 清空借用
        this.loanInstrumentList = []
        this.loanForm.loanPerson = {id: null}
      } else if (index === '1') {
        // 清空归还
        this.returnInstrumentList = []
        this.returnForm.returnPerson = {id: null}
      }
      this.nativeFun('resetEpcPoll')
    },
    formatStatus (status) {
      return status ? '已逾期' : '未逾期'
    },
    formatStatusStyle (status) {
      return status ? 'danger' : 'success'
    },
    initData () {
      // 所有库房
      storeRoom.findAll()
        .then(response => {
          this.storeList = [].concat(response)
          if (this.storeList.length > 0) {
            this.storeId = this.storeList[0].id
          }
        }, response => {
          console.info(response)
        })
    }
  },
  mounted () {
    // 开启RFID扫描
    this.nativeFun('startScan')
    this.initData()
  },
  beforeDestroy () {
    this.nativeFun('stopScan')
  }
}
</script>
<style lang="scss">
  .useStatus{
    .warning-row{
      background: oldlace;
    }
    .el-dialog .el-input__inner{
      width: 320px!important;
    }
    .check-radio{
      margin-bottom: 20px;
    }
  }
</style>
