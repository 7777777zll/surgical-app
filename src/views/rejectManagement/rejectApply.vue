<template>
  <div class="rejectApply">
    <el-col :span="24" class="queryBar">
      <el-form :model="addForm" ref="addForm" :rules="addFormRules" :inline="true" class="demo-form-inline">
        <el-form-item label="RFID">
          <el-input v-model="addForm.rfidCode"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getInstrument(addForm.rfidCode)">查询</el-button>
        </el-form-item>
        <el-button class="btn-export" @click="onSubmit">提交</el-button>
      </el-form>
    </el-col>
    <el-table  :data="tableData" @selection-change="handleSelectionChange" border tooltip-effect="dark" style="width: 100%">
      <el-table-column type="selection" width="55" fixed="left"></el-table-column>
      <el-table-column
        type="index"
        label="序号"  align="center"
        width="80">
      </el-table-column>
      <el-table-column prop="instrument.instrumentsCode" label="编码" width="200" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="instrument.rfidCode" label="RFID编码" width="200" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="instrument.instrumentDict.name" label="名称" width="200" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="instrument.instrumentDict.spec" label="规格" width="200" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="instrument.registerTime" label="登记日期" width="200" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="scrapReason" label="报废原因" width="200">
        <template slot-scope="scope">
          <el-select v-model="scope.row.scrapReason" placeholder="请选择" size="small">
            <el-option
              v-for="item in scrapReasons"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
  </el-table>
    <el-dialog title="提交申请" :visible.sync="addFormVisible" :close-on-click-modal="false" @close="refDialog('addForm')">
      <el-form :model="addForm" label-width="140px" :rules="addFormRules" ref="addForm">
        <el-form-item label="报废说明" prop="description">
          <el-input v-model="addForm.description" type="textarea" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

  <script>
  import { instruments, scrap } from '../../api/api'
  export default {
    data () {
      return {
        tableData: [],
        scrapReasons: [
          {
            value: 0,
            label: '损坏'
          },
          {
            value: 1,
            label: '丢失'
          },
          {
            value: 2,
            label: '到达报废期限'
          }
        ],
        // 是否显示添加界面
        addFormVisible: false,
        addLoading: false,
        // 新增界面数据
        addForm: {
          description: '',
          instruemtnts: []
        },
        addFormRules: {
          num: [{ required: true, message: '请输入申请单号', trigger: 'blur' }],
          desc: [
            { required: true, message: '请输入申请说明', trigger: 'blur' },
            { min: 5, max: 20, message: '请输入5到20个字符', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      refDialog (name) {
        this.$refs[name].resetFields()
      },
      onSubmit () {
        this.addFormVisible = true
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      getInstrument (rfid) {
        instruments.findByRfid({ params: { rfidCode: rfid } }).then(
          response => {
            let obj = this.tableData.find(x => {
              return x.instrument.id === response.id
            })
            if (!obj) {
              this.tableData.push({
                instrument: response,
                scrapReason: 0
              })
            }
          },
          response => {
            console.info('fail')
          }
        )
      },
      handleSelectionChange (value) {
        this.addForm.instruemtnts = []
        value.map(x => {
          this.addForm.instruemtnts.push(x)
        })
      },
      addSubmit () {
        this.$refs.addForm.validate(valid => {
          if (valid) {
            this.addLoading = true
            let params = Object.assign({}, this.addForm)
            scrap.add(params).then(
              response => {
                this.$message({
                  showClose: true,
                  message: '添加成功',
                  type: 'success'
                })
                this.addLoading = false
                this.addFormVisible = false
                this.$refs['addForm'].resetFields()
                this.addForm.instruemtnts.map(x => {
                  var index = this.tableData.indexOf(x)
                  if (index >= 0) {
                    this.tableData.splice(index, 1)
                  }
                })
              },
              response => {
                this.addLoading = false
              }
            )
          } else {
            console.info('error')
          }
        })
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
  .btn-export {
    float: right;
    margin-left: 15px !important;
  }
</style>
