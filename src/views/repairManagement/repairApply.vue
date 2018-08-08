<template>
    <div class="repairApply">
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
      <el-table  :data="tableData" @selection-change="handleSelectionChange"  border tooltip-effect="dark" style="width: 100%">
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
        <el-table-column prop="breakdownDescription" label="损坏描述" width="200">
          <template slot-scope="scope">
            <el-input v-model="scope.row.breakdownDescription" placeholder="请输入内容"></el-input>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title="提交申请" :visible.sync="addFormVisible" :close-on-click-modal="false" @close="refDialog('addForm')">
        <el-form :model="addForm" label-width="140px" :rules="addFormRules" ref="addForm">
          <el-form-item label="维修类型" prop="repairType">
            <el-select v-model="addForm.repairType" placeholder="请选择">
              <el-option label="内部维修" value="0"></el-option>
              <el-option label="外部维修" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="预计发生费用" prop="estimatedExpense">
            <el-input v-model="addForm.estimatedExpense" auto-complete="off"></el-input>
          </el-form-item>
          <template v-if="addForm.repairType === '1'">
            <el-form-item label="送修单位名称" prop="repairCompany">
              <el-input v-model="addForm.repairCompany" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="送修单位地址" prop="repairCompany">
              <el-input v-model="addForm.repairCompanyLocation" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="送修单位联系人" prop="repairCompany">
              <el-input v-model="addForm.repairCompanyContact" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="送修单位联系人电话" prop="repairCompany">
              <el-input v-model="addForm.repairCompanyPhone" auto-complete="off"></el-input>
            </el-form-item>
          </template>
          <el-form-item label="申请说明" prop="description">
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
  import { instruments, repair } from '../../api/api'
  export default {
    data () {
      return {
        tableData: [],
        // 新增界面数据
        addFormVisible: false,
        addLoading: false,
        addForm: {
          rfidCode: '',
          repairType: null,
          estimatedExpense: 0,
          instrument: [],
          repairCompany: '',
          repairCompanyLocation: '',
          repairCompanyContact: '',
          repairCompanyPhone: '',
          description: ''
        },
        // 表格查询条件
        formInline: {
          typeId: null,
          spec: '',
          distributionStatus: null,
          stopFlag: null
        },
        addFormRules: {
          num: [
            { required: true, message: '请输入申请单号', trigger: 'blur' }
          ],
          desc: [
            { required: true, message: '请输入申请说明', trigger: 'blur' },
            { min: 5, max: 20, message: '请输入5到20个字符', trigger: 'blur' }
          ]
        },
        editForm: {
          id: 0,
          name: '',
          userCode: '',
          department: {
            id: null
          },
          callNumber: '',
          loginName: '',
          password: '',
          stopFlag: null
        }
      }
    },
    methods: {
      refDialog (name) {
        this.$refs[name].resetFields()
      },
      getInstrument (rfid) {
        instruments.findByRfid({params: {rfidCode: rfid}})
          .then(response => {
            let obj = this.tableData.find((x) => {
              return x.instrument.id === response.id
            })
            if (!obj) {
              this.tableData.push({
                instrument: response,
                breakdownDescription: ''
              })
            }
          }, response => {
            console.info('fail')
          })
      },
      handleSelectionChange (val) {
        this.addForm.instrument = []
        val.map((x) => {
          this.addForm.instrument.push(x)
        })
      },
      _formatType (row, column) {
        // 序列化类型
        return row.stopFlag ? '启用' : '停用'
      },
      onSubmit () {
        this.addFormVisible = true
      },
      addSubmit () {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.addLoading = true
            let params = Object.assign({}, this.addForm)
            repair.add(params)
              .then(response => {
                this.$message({
                  showClose: true,
                  message: '添加成功',
                  type: 'success'
                })
                this.addLoading = false
                this.addFormVisible = false
                this.$refs['addForm'].resetFields()
                this.addForm.instrument.map((x) => {
                  var index = this.tableData.indexOf(x)
                  if (index >= 0) {
                    this.tableData.splice(index, 1)
                  }
                })
              }, response => {
                this.addLoading = false
              })
          } else {
            console.info('error')
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .btn-export{
    float: right;
    margin-left:15px !important;
  }
</style>
