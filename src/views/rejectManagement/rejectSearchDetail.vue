<template>
    <div class="peopleDetail">
      <div class="fr">
          <router-link to="/rejectManagement/rejectSearch">
              <el-button type="primary" size="small">返回</el-button>
          </router-link>
      </div>
      <div class="cb"></div>

      <table class="table-detail table-bordered table-fix-bottom table-fix-top">
        <tbody>
        <tr>
          <td class="title">申请单号</td>
          <td>{{showForm.scrapNumber}}</td>
          <td class="title">申请人</td>
          <td>{{showForm.applier.name}}</td>
          <td class="title">申请时间</td>
          <td>{{showForm.applyTime}}</td>
        </tr>
        <tr>
          <td class="title">申请说明</td>
          <td>{{showForm.description}}</td>
          <td class="title">审批人</td>
          <td>{{showForm.approver.name}}</td>
          <td class="title">审批时间</td>
          <td>{{showForm.approverTime}}</td>
        </tr>
        <tr>
          <td class="title">审批说明</td>
          <td>{{showForm.approverDescription}}</td>
          <td class="title">执行人</td>
          <td>{{showForm.excuter ? showForm.excuter.name : ''}}</td>
          <td class="title">执行时间</td>
          <td>{{showForm.excuteTime}}</td>
        </tr>
        <tr>
          <td class="title">执行说明</td>
          <td colspan="5">{{showForm.excuteDescription}}</td>
        </tr>
        </tbody>
      </table>
          <h5 style="color: #925555;font-size: 15px;">工具列表:</h5>
          <el-col :span="24" class="queryBar">
            <el-table  :data="tableData" border tooltip-effect="dark" style="width: 100%">
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
              <el-table-column prop="state" label="报废原因" width="200" :formatter="_formatType">
              </el-table-column>
          </el-table>
        </el-col>
  </div>
</template>

  <script>
  import { scrap } from '../../api/api'
  export default {
    data () {
      return {
        // 表格数据
        tableData: [],
        showForm: {
          Id: '',
          name: '',
          userCode: '',
          pinyin: '',
          password: '',
          department: '',
          phone: '',
          isLoginBypsw: '',
          isUse: '',
          isLock: ''
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
        scrap.findOne(this.$route.params.id).then(res => {
          this.showForm = res
          this.tableData = res.instruemtnts
        })
      },
      _formatType (row, column) {
        // 序列化类型
        var reason = ['损坏', '丢失', '到达报废期限', '其他']
        return reason[row.scrapReason]
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
