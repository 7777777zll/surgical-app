<template>
    <div class="peopleDetail">
      <div class="fr">
        <el-button type="success" size="small" @click="open()">同意</el-button>
        <el-button type="danger" size="small"  @click="refuse()">拒绝</el-button>
        <router-link to="/repairManagement/repairApprove" style="margin-left: 10px;">
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
            <el-table-column prop="breakdownDescription" label="损坏描述" width="200">
            </el-table-column>
          </el-table>
        </el-col>
        <!-- <el-col :span="24" class="queryBar">
          <el-button type="success" size="small" @click="open">同意</el-button>
          <el-button type="danger"  size="small"  @click="refuse(scope.$index, scope.row)">拒绝</el-button>
        </el-col> -->
  </div>
</template>

  <script>
  import { repair } from '../../api/api'
  export default {
    data () {
      return {
        // 表格数据
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
          this.tableData = res.instrument
        })
      },
      open () {
        let _this = this
        let params = Object.assign({}, this.showForm)
        params.obbStatus = 1
        repair.update(params.id, params)
          .then(response => {
            this.$message({
              showClose: true,
              message: '审核成功',
              type: 'success'
            })
            setTimeout(function () {
              _this.$router.go(-1)
            }, 1000)
          }, response => {
            this.$message({
              showClose: true,
              message: '审核失败',
              type: 'error'
            })
          })
      },
      refuse () {
        let _this = this
        this.$prompt('请输入拒绝理由', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[\S]{1,20}$/,
          inputErrorMessage: '请输入20个以内的文字'
        }).then(({value}) => {
          let params = Object.assign({}, this.showForm)
          params.obbStatus = 1
          params.approved = false
          params.approverDescription = value
          repair.update(params.id, params)
            .then(response => {
              this.$message({
                showClose: true,
                message: '拒绝成功',
                type: 'success'
              })
              setTimeout(function () {
                _this.$router.go(-1)
              }, 1000)
            }, response => {
              this.$message({
                showClose: true,
                message: '拒绝失败',
                type: 'error'
              })
            })
        })
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
