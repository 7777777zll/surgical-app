<template class="maintainPlan">
  <div class="maintainPlan">
  <el-col :span="24" class="queryBar">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <!--<el-form-item label="工具类型">-->
          <!--<el-select v-model="formInline.type">-->
            <!--<el-option label="全部" value=""></el-option>-->
            <!--<el-option label="启用" value="true"></el-option>-->
            <!--<el-option label="停用" value="false"></el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item>
          <el-button type="success" @click="addSystem">新增</el-button>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
    </el-form>
    <el-table border :data="tableData1" v-loading="isLoading" border tooltip-effect="dark" element-loading-text="拼命加载中" style="width:100%" class="queryBar">
      <el-table-column type="index" label="序号"  align="center" width="80">
      </el-table-column>
      <el-table-column prop="instrumentDict.name" label="名称" width="150" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="instrumentDict.instrumentType.name" label="类型" width="150" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="instrumentDict.spec" label="规格" width="150" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="instrumentDict.producerDict.name" label="生产商" width="150" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="maintainType" :formatter="_formatType" label="保养类型/级别" width="150" show-overflow-tooltip>
      </el-table-column>
       <el-table-column prop="periodUnit" :formatter="_formatUnit" label="保养周期" width="100" show-overflow-tooltip>
      </el-table-column>
       <el-table-column prop="threshold" label="保养阈值（天）" width="140" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="warnind" label="保养警戒值（天）" width="150" show-overflow-tooltip>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <!--<el-button type="warning" class="editBtn mr-10" size="small" @click="handleAddDic(scope.$index, scope.row)">编辑</el-button>-->
          <router-link :to="'/maintainPlanDetail/'+scope.row.id">
            <el-button size="small" @click="handleInfo(scope.$index, scope.row)">详情</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    </el-col>

    <!--计划新增界面-->
    <el-dialog title="新增计划" :visible.sync="planAddFormVisible" :close-on-click-modal="false" @close="refDialog('addForm')">
      <el-form :model="addForm" label-width="140px" ref="addForm" :rules="planAddRules">
        <el-form-item label="器械字典" prop="instrumentDict">
          <el-select v-model="addFormids" multiple filterable placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in instrumentDict"
              :key="item.id"
              :label="item.name + ' - ' + item.spec"
              :value="item.id">
              <span style="float: left">{{ item.name + ' - ' + item.spec }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.producerDict.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="保养类型/级别" prop="maintainType">
          <el-select v-model="addForm.maintainType" placeholder="请选择">
            <el-option
              v-for="item in maintainTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="保养周期" prop="">
          <el-input placeholder="请输入内容" v-model="addForm.period">
            <el-select v-model="addForm.periodUnit" slot="append" placeholder="请选择" style="width: 60px">
              <el-option
                v-for="item in periodUnits"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="保养阈值" prop="threshold">
          <el-input  v-model="addForm.threshold" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="保养警戒值" prop="warnind">
          <el-input v-model="addForm.warnind" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="维修后是否重置" prop="repairReset">
          <el-select v-model="addForm.repairReset" auto-complete="off">
            <el-option
              v-for="item in repairResets"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="planAddFormVisible = false">取消</el-button>
        <el-button type="primary" @click="addPlanCheck" :loading="addLoading">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { maintain, instrumentDict } from '../../api/api'
export default {
  data () {
    return {
      tableData1: [],
      instrumentDict: [],
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
      repairResets: [
        {
          label: '是',
          value: true
        },
        {
          label: '否',
          value: false
        }
      ],
      isLoading: false,
      // 是否显示添加界面
      planAddFormVisible: false,
      addLoading: false,
      // 表格查询条件
      formInline: {
        name: '',
        type: ''
      },
      // 分页对象
      page: {
        page: 1,
        size: 10,
        totalElements: 0
      },
      addFormids: [],
      // 新增计划界面数据
      addForm: {
        instrumentDict: {
          id: null
        },
        maintainType: 0,
        periodUnit: 0,
        period: 3,
        threshold: 0,
        warnind: 0,
        repairReset: false
      },
      // 编辑界面数据
      editForm: {
        name: '',
        Id: '',
        maintainType: '',
        maintainCycle: '',
        unit: '',
        warning: '',
        isUse: '',
        createP: '',
        date1: '',
        date2: ''
      },
      planAddRules: {
        instrumentDict: [
          { required: true, message: '请选择器械字典', trigger: 'blur' }
        ],
        maintainType: [
          { required: true, message: '请选择保养级别', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
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
    handleAddDic (index, row) {
      this.dicAddFormVisible = true
    },
    handleInfo (index, row) {
      this.editForm = Object.assign({}, row)
    },
    addSystem () {
      this.planAddFormVisible = true
    },
    refDialog (name) {
      this.$refs[name].resetFields()
    },
    addPlanCheck () {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.addLoading = true
          // 此处改为了批量添加, 需遍历
          let objs = []
          this.addFormids.forEach((item, index, array) => {
            let id = item
            let params = Object.assign({}, this.addForm)
            params.instrumentDict = Object.assign({}, {
              id: id
            })
            objs.push(params)
          })
//          console.info(objs)
          maintain.add(objs)
            .then(response => {
              this.$message({
                showClose: true,
                message: '添加成功',
                type: 'success'
              })
              this.addLoading = false
              this.planAddFormVisible = false
              this.$refs['addForm'].resetFields()
              this.maintainPlanList()
            }, response => {
              this.$message({
                showClose: true,
                message: '添加失败',
                type: 'error'
              })
              this.addLoading = false
            })
        } else {
          console.info('error')
        }
      })
    },
    addDicCheck () {
      this.$refs.dicAddForm.validate((valid) => {
        if (valid) {
          console.info('ok')
        } else {
          console.info('error')
        }
      })
    },
    onSubmit () {
      this.maintainPlanList()
    },
    maintainPlanList () {
      this.isLoading = true
      maintain.findByPage({params: Object.assign(this.page, this.formInline)})
        .then(response => {
          this.isLoading = false
          this.page.totalElements = response.totalElements
          this.tableData1 = response.content
          console.log('this.tableData1')
        }, response => {
          console.info('fail')
        })
    },
    initData () {
      instrumentDict.findAll()
        .then(response => {
          this.instrumentDict = response
        }, response => {
          console.info(response)
        })
    }
  },
  created: function () {
    this.maintainPlanList()
    this.initData()
  }
}
</script>
<style lang="scss">
  /*.maintainPlan .demo-table-expand {*/
    /*font-size: 0;*/
  /*}*/
  /*.maintainPlan .demo-table-expand label {*/
    /*width: 90px;*/
    /*color: #99a9bf;*/
  /*}*/
  /*.maintainPlan .demo-table-expand .el-form-item {*/
    /*margin-right: 0;*/
    /*margin-bottom: 0;*/
    /*width: 50%;*/
  /*}*/
  /*.maintainPlan .el-dialog--small{*/
    /*width: 60%!important;*/
  /*}*/
  /*.maintainPlan .el-input__inner {*/
    /*width: 200px!important;*/
  /*}*/
  /*.maintainPlan .titleName{*/
    /*color: #1f2d3d;*/
    /*padding: 5px;*/
    /*width: 60px;*/
    /*background: #f7ba2a;*/
  /*}*/
</style>
