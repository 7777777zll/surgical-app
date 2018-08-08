<template>
  <div class="peopleDetail">
    <div class="fr">
      <el-button type="primary" size="small" @click="enterSubmit">确认</el-button>
        <router-link to="/repairManagement/repairConfirm">
            <el-button  type="primary" size="small">返回</el-button>
        </router-link>
    </div>
    <div class="cb"></div>
    <table class="table-detail table-bordered table-fix-bottom table-fix-top">
      <tbody>
      <tr>
        <td class="title">申请单号</td>
        <td>{{showForm.obbNumber}}</td>
        <td class="title">申请说明</td>
        <td show-overflow-tooltip><div>{{showForm.description}}</div></td>
        <td class="title">申请单状态</td>
        <td>{{showForm.obbStatus | parseRepairType(showForm.approved)}}</td>
      </tr>
      <tr>
        <td class="title">送修人</td>
        <td>{{showForm.applier.name}}</td>
        <td class="title">送修时间</td>
        <td>{{showForm.applyTime}}</td>
        <td class="title">送修说明</td>
        <td>{{showForm.takeDes}}</td>
      </tr>
      </tbody>
    </table>
    <h5 style="color: #925555;font-size: 15px;">工具列表:</h5>
    <el-col :span="24" class="queryBar">
      <el-table  :data="this.showForm.instrument" border tooltip-effect="dark" style="width: 100%" v-loading="isLoading">
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
        </el-table-column>
        <el-table-column prop="insRepairState" label="维修状态" width="200">
          <template slot-scope="scope">
            <el-select v-model="scope.row.insRepairState" placeholder="请选择" size="small">
              <el-option
                v-for="item in insRepairStates"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="repairDescription" label="维修结果描述" width="200">
          <template slot-scope="scope">
            <el-input v-model="scope.row.repairDescription" placeholder="请输入内容"  size="small"></el-input>
          </template>
        </el-table-column>
    </el-table>
  </el-col>

    <el-dialog title="提交申请" :visible.sync="addFormVisible" :close-on-click-modal="false" @close="refDialog('addForm')">
      <el-form :model="showForm" label-width="140px" :rules="addFormRules" ref="addForm">
        <el-form-item label="实际发生费用" prop="expense">
          <el-input v-model="showForm.estimatedExpense" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="执行结果描述" prop="excuteDescription">
          <el-input v-model="showForm.description" type="textarea" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="onSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

  <script>
  import { repair } from '../../api/api'
  export default {
    data () {
      return {
        addFormVisible: false,
        addLoading: false,
        addFormRules: {},
        insRepairStates: [
          {
            value: 0,
            label: '等待维修'
          },
          {
            value: 1,
            label: '损坏过于严重而无法维修'
          },
          {
            value: 2,
            label: '维修成功'
          }
        ],
        // 表格数据
        isLoading: true,
        tableData: [],
        showForm: {
          obbNumber: '',
          description: '',
          applier: {
            name: ''
          },
          applyTime: '',
          applyStatus: '',
          takePeople: '',
          takeTime: '',
          takeDes: ''
        }
      }
    },
    created: function () {
      this.userDetail()
    },
    methods: {
      refDialog (name) {
        this.$refs[name].resetFields()
      },
      userDetail () {
        repair.findOne(this.$route.params.id).then(res => {
          this.showForm = res
          this.isLoading = false
        })
      },
      onSubmit () {
        this.addLoading = true
        let params = Object.assign({}, this.showForm)
        params.obbStatus = 2
        repair.update(params.id, params)
          .then(response => {
            this.$message({
              showClose: true,
              message: '确认成功',
              type: 'success'
            })
            this.addFormVisible = false
            this.addLoading = false
          }, response => {
            this.$message({
              showClose: true,
              message: '确认失败',
              type: 'error'
            })
            this.addLoading = false
          })
      },
      enterSubmit () {
        this.addFormVisible = true
      }
    }
  }
</script>

<style>
  .fr{
    float:right;
  }
  .cb{
    clear: both;
  }
</style>
