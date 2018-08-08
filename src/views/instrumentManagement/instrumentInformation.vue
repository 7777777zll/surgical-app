<template>
  <div class="intrustInfo">
    <el-col :span="24" class="queryBar">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="分配至:">
          <el-select v-model="addForm.container" placeholder="请选择">
            <el-option-group
              v-for="group in containerList"
              :key="group.label"
              :label="group.label">
              <el-option
                v-for="item in group.options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="onSubmit">登记</el-button>
        <el-button type="success" class="btn-export" @click="addSystem">新增</el-button>
      </el-form>
    </el-col>
    <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" v-loading="isLoading" element-loading-text="拼命加载中">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="rfidCode" label="编号" width="240" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="instrumentDict.name" label="名称" show-overflow-tooltip>
      </el-table-column>
      <!--<el-table-column prop="instrumentDict.pinyin" label="拼音" width="120" show-overflow-tooltip>-->
      <!--</el-table-column>-->
      <el-table-column prop="instrumentDict.instrumentType.name" label="类型" width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="instrumentDict.producerDict.name" label="生产商" width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="instrumentDict.spec" label="规格" width="120" show-overflow-tooltip>
      </el-table-column>
    </el-table>

    <!--新增界面-->
      <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false" @close="refDialog('addForm')" width="60%">
        <el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm">
          <el-form-item label="器械" prop="instructDict" >
            <el-select  @change="dictChange" v-model="addForm.instructDict" filterable auto-complete="off" filterable>
              <el-option
                v-for="item in instrumentList"
                :key="item.id"
                :label="item.name + ' - ' + item.spec"
                :value="item.id">
                <span style="float: left">{{ item.name + ' - ' + item.spec }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.producerDict.name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <table class="table-detail table-bordered table-fix-bottom">
            <tbody>
              <tr>
                <td class="title">名称</td>
                <td>{{selDict.name}}</td>
                <td class="title">类型</td>
                <td>{{selDict.instrumentType.name}}</td>
                <td class="title">生产商</td>
                <td>{{selDict.producerDict.name}}</td>
              </tr>
              <tr>
                <td class="title">规格</td>
                <td>{{selDict.spec}}</td>
                <td class="title">图例</td>
                <td><img v-if="selDict.url" :src="selDict.url" class="avatar"></td>
                <td class="title"></td>
                <td></td>
              </tr>
            </tbody>
          </table>
          <el-form-item label="标签原始RFID码">
            <el-input v-model="rfidCode" placeholder="请将待登记的器械放置在工作台上" disabled>
              <el-button slot="append" icon="el-icon-refresh" @click="refreshEpc"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="新RFID码" prop="rfidCode" >
            <el-input v-model="addForm.rfidCode" placeholder="请输入内容" disabled></el-input>
          </el-form-item>
          <el-form-item label="出厂编码" prop="instrumentsCode" >
            <el-input v-model="addForm.instrumentsCode" placeholder="请输入出厂编码"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="addSubmit" :loading="addLoading">确定</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
  import {
    instruments,
    instrumentDict,
    instrumentBoxList,
    storeRoom,
    epcHelper
  } from '../../api/api'
  export default {
    data () {
      return {
        // 下拉框数据
        containerList: [
          {
            label: '柜子',
            options: [
              {
                label: '柜子',
                value: 'box,'
              }
            ]
          },
          {
            label: '库房',
            options: []
          }
        ],
        // 当前选择的字典
        selDict: {
          name: '',
          spec: '',
          instrumentType: {
            name: ''
          },
          producerDict: {
            name: ''
          },
          url: ''
        },
        instrumentList: [],
        rfidCode: '',
        // 表格数据
        tableData: [],
        // 显示表格时候是否loading
        isLoading: false,
        infoFormVisible2: false,
        // 是否显示添加界面
        addFormVisible: false,
        formInline: {
          name: '',
          instrumentValue: '',
          vendorValue: '',
          dict: ''
        },
        multipleSelection: [],
        // 新增界面数据
        addForm: {
          instructDict: null,
          rfidCode: '110120119',
          instrumentsCode: '',
          container: null
        },
        addLoading: false,
        addFormRules: {
          instructDict: [
            { required: true, message: '请选择器械', trigger: 'blur' }
          ],
          rfidCode: [
            { required: true, message: 'Rfid码不能为空', trigger: 'blur' }
          ],
          instrumentsCode: [
            { required: true, message: '请输入出厂编码', trigger: 'blur' }
          ],
          beforeRfid: [
            { required: true, message: '请扫描原Rfid码', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      dictChange (val) {
        let obj = this.instrumentList.find(x => {
          return x.id === val
        })
        let baseUrl = self.location.protocol + '//' + self.location.hostname
        if (self.location.port !== '') {
          baseUrl = baseUrl + ':' + self.location.port
        }
        this.selDict = obj
        this.selDict.url = `${baseUrl}/api/instrumentdicts/${obj.code}/image`
      },
      handleInfo (index, row) {
        this.infoFormVisible2 = true
      },
      refDialog (name) {
        this.$refs[name].resetFields()
      },
      addSystem () {
        epcHelper.getEpc().then(
          response => {
            this.addFormVisible = true
            this.addForm.rfidCode = response
            this.rfidCode = ''
            this.nativeFun('resetEpcPoll')
          },
          response => {}
        )
      },
      refreshEpc () {
        this.nativeFun('resetEpcPoll')
      },
      addSubmit () {
        this.$refs.addForm.validate(valid => {
          if (valid) {
            let dictId = this.addForm.instructDict
            let instrumentDict = this.instrumentList.find(x => {
              return x.id === dictId
            })
            // 判断是否存在
            let obj = this.tableData.find(x => {
              return x.rfidCode === this.addForm.rfidCode
            })
            if (obj) {
              this.$message({
                showClose: true,
                message: '列表中存在该rfid码',
                type: 'error'
              })
            } else {
              // 判断是否存在原rfid
              if (!this.rfidCode) {
                this.$message({
                  showClose: true,
                  message: '请扫描原Rfid码',
                  type: 'error'
                })
                return false
              } else {
                instruments.findByRfidCode(this.rfidCode).then(
                  response => {
                    if (response) {
                      this.$message({
                        showClose: true,
                        message: '原rfid码已存在',
                        type: 'error'
                      })
                      return false
                    } else {
                      // 调用写入方法
                      let writeRes = this.nativeFun(
                        'writeEpc',
                        this.rfidCode,
                        this.addForm.rfidCode
                      )
                      if (writeRes) {
                        // 提交
                        let params = Object.assign({}, this.addForm)
                        params.instrumentDict = instrumentDict
                        instruments.save([params]).then(
                          response => {
                            this.$message({
                              showClose: true,
                              message: '登记成功',
                              type: 'success'
                            })
                            this.tableData.push(response[0])
                            // 获取新EPC 重置表单 重置EPC池
                            epcHelper.getEpc().then(
                              response => {
                                this.addForm.rfidCode = response
                                this.rfidCode = ''
                                this.addForm.instrumentsCode = ''
                                this.nativeFun('resetEpcPoll')
                              },
                              response => {}
                            )
                            // this.addFormVisible = false
                          },
                          response => {}
                        )
                      } else {
                        this.$message({
                          showClose: true,
                          message: '写入rfid码失败，请重试',
                          type: 'error'
                        })
                      }
                    }
                  },
                  response => {}
                )
              }
            }
          } else {
            console.info('error')
          }
        })
      },
      onSubmit () {
        let params = this.multipleSelection.slice()
        // 判断是柜子还是库房
        let type = this.addForm.container.split(',')[0]
        let id = this.addForm.container.split(',')[1]
        let obj = { id: Number.parseInt(id) }
        params.map(x => {
          if (type === 'store') {
            x.store = obj
          } else {
            x.distributionStatus = 0
          }
        })
        instruments.updateList(params).then(
          response => {
            this.$message({
              showClose: true,
              message: '登记成功',
              type: 'success'
            })
            this.multipleSelection.map(x => {
              var index = this.tableData.indexOf(x)
              if (index >= 0) {
                this.tableData.splice(index, 1)
              }
            })
          },
          response => {
            //          this.$message({
            //            showClose: true,
            //            message: '登记失败',
            //            type: 'error'
            //          })
          }
        )
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      handleSizeChange (val) {
        console.info(val)
      },
      handleCurrentChange (val) {
        this.onSubmit()
      },
      pushRfid (rfidCode) {
        // 判断是否已经存在rfid
        this.rfidCode = rfidCode
      },
      initData () {
        // 所有器械
        instrumentDict.findAll().then(
          response => {
            this.instrumentList = response
          },
          response => {
            console.info(response)
          }
        )
        // 所有柜子
        instrumentBoxList.findAll().then(
          response => {
            //          this.containerList[0].options = []
            response.map(x => {
              //            this.containerList[0].options.push({
              //              label: x.uniquenessCode,
              //              value: 'box,' + x.id
              //            })
            })
          },
          response => {
            console.info(response)
          }
        )
        // 所有库房
        storeRoom.findAll().then(
          response => {
            this.containerList[1].options = []
            response.map(x => {
              this.containerList[1].options.push({
                label: x.name,
                value: 'store,' + x.id
              })
            })
          },
          response => {
            console.info(response)
          }
        )
      }
    },
    mounted () {
      this.initData()
      this.nativeFun('startScan')
    },
    beforeDestroy () {
      this.nativeFun('stopScan')
    }
  }
</script>

<style>
  .avatar {
    width: auto;
    min-width: 178px;
    height: 178px;
    display: block;
  }
</style>
