<template>
    <div class="peopleDetail">
      <div class="fr">
          <router-link to="/repairManagement/repairSearch">
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
        <tr>
          <td class="title">审批人</td>
          <td>{{showForm.approver ? showForm.approver.name : ''}}</td>
          <td class="title">审批时间</td>
          <td>{{showForm.approverTime}}</td>
          <td class="title">审批说明</td>
          <td>{{showForm.approverDescription}}</td>
        </tr>
        <tr>
          <td class="title">执行人</td>
          <td>{{showForm.excuter ? showForm.excuter.name : ''}}</td>
          <td class="title">执行时间</td>
          <td>{{showForm.excuteTime}}</td>
          <td class="title">执行说明</td>
          <td>{{showForm.excuteDescription}}</td>
        </tr>
        </tbody>
      </table>
          <h5 style="color: #925555;font-size: 15px;">工具列表:</h5>
          <el-col :span="24" class="queryBar">
            <el-table  :data="showForm.instrument" border tooltip-effect="dark" style="width: 100%" v-loading="isLoading">
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
              <el-table-column prop="insRepairState" :formatter="_formatType" label="维修状态" width="200">
              </el-table-column>
              <el-table-column prop="repairDescription" label="维修结果描述" width="200">
              </el-table-column>
          </el-table>
        </el-col>
<!--         <el-col :span="24" class="queryBar">
          <el-button type="success" class="editBtn" size="small" @click="open">确认</el-button>
        </el-col> -->
  </div>
</template>

  <script>
  import { repair } from '../../api/api'
  export default {
    data () {
      return {
        // 表格数据
        isLoading: true,
        showForm: {
          obbNumber: '',
          description: '',
          applier: {
            name: ''
          },
          approver: {
            name: ''
          },
          approverTime: '',
          approverDescription: '',
          excuter: {
            name: ''
          },
          excuteTime: '',
          excuteDescription: '',
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
      _formatType (row, column) {
        // 序列化类型
        return row.insRepairState === 0 ? '等待维修' : row.insRepairState === 1 ? '损坏过于严重而无法维修' : '维修成功'
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
