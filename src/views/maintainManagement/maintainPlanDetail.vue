<template>
    <div class="peopleDetail">
      <div class="fr">
          <router-link to="/maintainManagement/maintainPlan">
              <el-button  type="primary" size="small">返回</el-button>
          </router-link>
      </div>
      <div class="cb"></div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="计划信息" name="first">
          <table class="table-detail table-bordered">
            <tbody>
              <tr>
                <td class="title">名称</td>
                <td>{{showForm.instrumentDict.name}}</td>
                <td class="title">类型</td>
                <td>{{showForm.instrumentDict.instrumentType.name}}</td>
                <td class="title">规格</td>
                <td>{{showForm.instrumentDict.spec}}</td>
              </tr>
              <tr>
                <td class="title">生产商</td>
                <td>{{showForm.instrumentDict.producerDict.name}}</td>
                <td class="title">保养类型/级别</td>
                <td>{{showForm.maintainType | parseMaintainType}}</td>
                <td class="title">保养周期</td>
                <td>{{_formatUnit(showForm)}}</td>
              </tr>
              <tr>
                <td class="title">保养阈值（天）</td>
                <td>{{showForm.threshold}}</td>
                <td class="title">保养警戒值（天）</td>
                <td>{{showForm.warnind}}</td>
                <td class="title">维修后是否重置</td>
                <td>{{showForm.repairReset ? '是': '否'}}</td>
              </tr>
            </tbody>
          </table>
        </el-tab-pane>
        <el-tab-pane label="器械列表" name="second">
          <el-table :data="tableData" border tooltip-effect="dark" v-loading="isLoading" style="width: 100%" id="tableData1">
            <el-table-column
              type="index"
              label="序号"  align="center"
              width="80">
            </el-table-column>
            <el-table-column prop="instrumentsCode" label="编码" width="200" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="rfidCode" label="RFID编码" width="200" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="instrumentDict.name" label="名称" width="200" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="instrumentDict.spec" label="规格" width="200" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="name" label="分配设备" width="200" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row.distributionStatus === 0 ? '器械柜' : scope.row.distributionStatus === 1 ? '库房' : '未知' }}
              </template>
            </el-table-column>
            <el-table-column prop="name" label="设备编码" width="200" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row.cabinet ? scope.row.cabinet.cabineCode : ''}}
                {{ scope.row.store ? scope.row.store.name : ''}}
              </template>
            </el-table-column>
            <el-table-column prop="registerTime" label="登记日期" width="200" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="nextMainTime" label="下次保养时间" width="200" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="stopFlag" label="状态" width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row.state | parseInstrumentStatus }}
              </template>
            </el-table-column>
          </el-table>
          <el-col :span="24" class="queryBar">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="page.page"
              :page-size="page.size"
              layout="total, prev, pager, next"
              :total="page.totalElements"
              style="float: right">
            </el-pagination>
          </el-col>
        </el-tab-pane>
      </el-tabs>
  </div>
</template>

  <script>
  import { maintain, instrumentDict } from '../../api/api'
  export default {
    data () {
      return {
        // 表格数据
        tableData: [],
        maintainTypes: [
          {
            label: '计划1',
            value: 0
          },
          {
            label: '计划2',
            value: 1
          },
          {
            label: '计划3',
            value: 2
          }
        ],
        periodUnits: [
          {
            label: '天',
            value: 0
          },
          {
            label: '周',
            value: 1
          },
          {
            label: '月',
            value: 2
          },
          {
            label: '年',
            value: 3
          }
        ],
        activeName: 'first',
        addLoading: false,
        // 是否显示添加界面
        addFormVisible: false,
        // 显示表格时候是否loading
        isLoading: false,
        // 分页对象
        page: {
          page: 1,
          size: 10,
          totalElements: 0
        },
        showForm: {
          instrumentDict: {
            id: null,
            name: '',
            spec: '',
            producerDict: {
              name: ''
            },
            instrumentType: {
              name: ''
            }
          },
          threshold: '',
          warnind: '',
          repairReset: ''
        }
      }
    },
    created: function () {
      this.maintainPlanDetail()
    },
    methods: {
      handleSizeChange (val) {
        console.info(val)
      },
      handleCurrentChange (val) {
        this.maintainDicDetail()
      },
      _formatState (row, column) {
        // 序列化类型
        return row.useable ? '启用' : '停用'
      },
      _formatType (row, column) {
        // 序列化类型
        let obj = this.maintainTypes.find((x) => {
          return x.value === row.maintainType
        })
        return obj ? obj.label : '未知'
      },
      _formatUnit (row, column) {
        // 序列化类型
        let obj = this.periodUnits.find((x) => {
          return x.value === row.periodUnit
        })
        return row.period + obj ? obj.label : '未知'
      },
      refDialog (name) {
        this.$refs[name].resetFields()
      },
      handleClick (tab, event) {
        this.isLoading = false
        if (tab.index === '1') {
          this.maintainDicDetail()
        } else if (tab.index === '0') {
          this.maintainPlanDetail()
        }
      },
      pswResetForm () {
        this.$refs.passwordForm.resetFields()
      },
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
      maintainDicDetail () {
        this.isLoading = true
        let params = Object.assign(this.page)
        instrumentDict.findByDictId(this.showForm.instrumentDict.id, {params: params})
          .then(response => {
            this.isLoading = false
            this.page.totalElements = response.totalElements
            this.tableData = response.content
          }, response => {
            console.info('fail')
          })
      },
      maintainPlanDetail () {
        maintain.findOne(this.$route.params.id).then(res => {
          this.showForm = res
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
