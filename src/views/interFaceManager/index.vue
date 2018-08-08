<template>
    <div>
      <el-col :span="24" class="queryBar">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item>
            <el-input v-model="formInline.name" placeholder="名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addSystem">新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" v-loading="isLoading" element-loading-text="拼命加载中">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="名称" width="110" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="interfaceGroup.name" label="所属系统" width="120" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="note" label="接口描述" width="120" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="enabled" label="状态" width="120">
          <template slot-scope="scope">{{ scope.row.enabled ? '停用' : '启用' }}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="small" @click="handleConfigure(scope.$index, scope.row)">配置接口</el-button>
            <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
            <el-button type="warning" size="small" @click="handleChange(scope.$index, scope.row)">{{ scope.row.enabled ? '启用' : '停用' }}</el-button>
            <el-button type="info" size="small" @click="handleResult(scope.$index, scope.row)">采样明细</el-button>
            <el-button type="warning" size="small" @click="handleMarathon(scope.$index, scope.row)">{{ formatStatus(scope.row) }}</el-button>
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

      <!--新增界面-->
      <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false" @close="refDialog('addForm')">
        <el-form :model="addForm" label-width="110px" :rules="addFormRules" ref="addForm">
          <el-form-item label="所属系统" prop="interfaceGroup.id">
            <el-select v-model="addForm.interfaceGroup.id" auto-complete="off" placeholder="请选择所属系统" @change="addInterfaceGroupChange">
              <el-option
                v-for="item in selectSystemData"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="接口名称" prop="name">
            <el-input v-model="addForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="服务名称" prop="serviceName">
            <el-input v-model="addForm.serviceName" auto-complete="off" class="lowerCase"></el-input>
          </el-form-item>
          <el-form-item label="镜像名称" prop="imageName">
            <el-input v-model="addForm.imageName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="镜像版本" prop="imageTag">
            <el-input v-model="addForm.imageTag" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="note">
            <el-input v-model="addForm.note" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="接口类型" prop="type">
            <el-select v-model="addForm.type" auto-complete="off" placeholder="请选择接口类型">
              <el-option
                v-for="item in selectInterFaceType"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="表名称">
            <el-input v-model="addForm.tables" auto-complete="off" placeholder="多表之间用逗号分隔"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
        </div>
      </el-dialog>

      <!--编辑界面-->
      <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
        <el-form :model="editForm" label-width="110px" :rules="editFormRules" ref="editForm">
          <el-form-item label="所属系统" prop="interfaceGroup.id">
            <el-select v-model="editForm.interfaceGroup.id" auto-complete="off" placeholder="请选择所属系统">
              <el-option
                v-for="item in selectSystemData"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="接口名称" prop="name">
            <el-input v-model="editForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="服务名称" prop="serviceName">
            <el-input v-model="editForm.serviceName" auto-complete="off" class="lowerCase"></el-input>
          </el-form-item>
          <el-form-item label="镜像名称" prop="imageName">
            <el-input v-model="editForm.imageName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="镜像版本" prop="imageTag">
            <el-input v-model="editForm.imageTag" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="note">
            <el-input v-model="editForm.note" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="接口类型" prop="type">
            <el-select v-model="editForm.type" auto-complete="off" placeholder="请选择接口类型">
              <el-option
                v-for="item in selectInterFaceType"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="表名称">
            <el-input v-model="editForm.tables" auto-complete="off" placeholder="多表之间用逗号分隔"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="editFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
        </div>
      </el-dialog>

      <!--采样界面-->
      <el-dialog title="采样明细"  v-model="resultVisible" :close-on-click-modal="false" @close="closeResultData">
        <el-table :data="resultDataList" v-loading="resultIsLoading" element-loading-text="拼命加载中">
          <el-table-column
            width="60"
            type="index">
          </el-table-column>
          <el-table-column property="id" label="ID"></el-table-column>
          <el-table-column property="operation_date" label="采样时间"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="info" size="small" @click="resultInfo(scope.$index, scope.row)">查看采样结果</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-col :span="24" class="queryBar">
          <el-button type="info" size="small" @click="getResult">重新采样</el-button>
          <el-pagination
            @current-change="resultInfoCurrentChange"
            :current-page.sync="resultInfoPage.page.page"
            :page-size="resultInfoPage.page.size"
            layout="total, prev, pager, next"
            :total="resultInfoPage.page.totalElements"
            style="float: right">
          </el-pagination>
        </el-col>
      </el-dialog>

      <el-dialog title="采样结果"  v-model="resultInfoVisible" :close-on-click-modal="false">
        <el-table :data="resultData" v-loading="resultInfoIsLoading" element-loading-text="拼命加载中">
          <el-table-column type="expand">
            <template scope="props">
              <el-table :data="props.row.metaData">
                <el-table-column property="columnName" label="字段名称"></el-table-column>
                <el-table-column property="columnTypeName" label="字段类型"></el-table-column>
                <el-table-column property="columnDisplaySize" label="字段长度"></el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column property="tableName" label="表名"></el-table-column>
        </el-table>
      </el-dialog>

      <!--配置接口界面-->
      <el-dialog title="接口配置"  v-model="configureVisible" :close-on-click-modal="false">
        <el-form :model="configureForm" label-width="110px" :rules="configureFormRules" ref="configureForm">
          <template v-if="configureForm.type==2 && configureForm.interfaceGroup==0">
            <el-form-item label="交换机" prop="param.writer[0].exchange">
              <el-input v-model="configureForm.param.writer[configureForm.interfaceGroup].exchange" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="RoutingKey" prop="param.writer[0].routingKey">
              <el-input v-model="configureForm.param.writer[configureForm.interfaceGroup].routingKey" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="队列名称" prop="param.writer[0].queue">
              <el-input v-model="configureForm.param.writer[configureForm.interfaceGroup].queue" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="关联采样记录">
              <el-select v-model="configureForm.param.writer[configureForm.interfaceGroup].cols" placeholder="关联采样记录">
                <el-option
                  v-for="item in interFaceResult"
                  :key="item.id"
                  :label="item.operation_date"
                  :value="item.id">
                  <span style="float: left">{{ item.id }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.operation_date }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <template v-for="(domain, index) in configureForm.param.writer[configureForm.interfaceGroup].writerParam">
              <template v-if="index>0">
                <hr>
              </template>
              <el-form-item label="执行操作" class="switch">
                <el-checkbox-group v-model="domain.checkList">
                  <el-checkbox label="select" @change="configureChange(domain)">查询</el-checkbox>
                  <el-checkbox label="insert" @change="configureChange(domain)">新增</el-checkbox>
                  <el-checkbox label="update" @change="configureChange(domain)">更新</el-checkbox>
                  <el-checkbox label="delete" @change="configureChange(domain)">删除</el-checkbox>
                  <template v-if="index>0">
                    <el-button @click.prevent="removeDomain(domain)" size="small">删除配置</el-button>
                  </template>
                  <template v-else>
                    <el-button @click="addDomain" size="small">增加配置</el-button>
                  </template>
                </el-checkbox-group>
              </el-form-item>
              <template v-if="domain.checkList.indexOf('select') > -1">
                <el-form-item label="查询语句">
                  <el-input v-model="domain.select" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="查询语句参数">
                  <el-input v-model="domain.selectParam" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="selectParamFieldName">
                  <el-input v-model="domain.selectParamFieldName" auto-complete="off"></el-input>
                </el-form-item>
              </template>
              <template v-if="domain.checkList.indexOf('insert') > -1">
                <el-form-item label="新增语句">
                  <el-input v-model="domain.insert" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="新增语句参数">
                  <el-input v-model="domain.insertParam" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="insertParamFieldName">
                  <el-input v-model="domain.insertParamFieldName" auto-complete="off"></el-input>
                </el-form-item>
              </template>
              <template v-if="domain.checkList.indexOf('update') > -1">
                <el-form-item label="更新语句">
                  <el-input v-model="domain.update" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="更新语句参数">
                  <el-input v-model="domain.updateParam" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="updateParamFieldName">
                  <el-input v-model="domain.updateParamFieldName" auto-complete="off"></el-input>
                </el-form-item>
              </template>
              <template v-if="domain.checkList.indexOf('delete') > -1">
                <el-form-item label="删除语句">
                  <el-input v-model="domain.delete" auto-complete="off"></el-input>
                </el-form-item>
              </template>
              <el-form-item label="task">
                <el-select v-model="domain.task" auto-complete="off" placeholder="task">
                  <el-option
                    v-for="item in taskListW"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>

              <!-- 1：没有redis；2：删除redis（备用SQL, 表达式， redisKey）;3:更新redis（备用SQL， redisKey）;4:触发器" -->
              <el-form-item label="表名">
                <el-input v-model="domain.tableName" auto-complete="off"></el-input>
              </el-form-item>
              <template v-if="domain.task > 1">
                <template v-if="domain.task==2 || domain.task==3">
                  <el-form-item label="redisKey">
                    <el-input v-model="domain.redisKey" placeholder="writer和reader中保持一致" auto-complete="off"></el-input>
                  </el-form-item>
                  <template v-if="domain.task==2">
                    <el-form-item label="表达式">
                      <el-input v-model="domain.traceCondition" placeholder="表达式1，字段1..." auto-complete="off"></el-input>
                    </el-form-item>
                  </template>
                </template>
              </template>
            </template>
          </template>
          <template v-if="configureForm.type==1 && configureForm.interfaceGroup==0">
            <el-form-item label="查询语句" prop="param.reader[0].sql">
              <el-input v-model="configureForm.param.reader[configureForm.interfaceGroup].sql" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="调用策略" prop="param.reader[0].schedule">
              <el-input v-model="configureForm.param.reader[configureForm.interfaceGroup].schedule" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="交换机" prop="param.reader[0].exchange">
              <el-input v-model="configureForm.param.reader[configureForm.interfaceGroup].exchange" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="RoutingKey" prop="param.reader[0].routingKey">
              <el-input v-model="configureForm.param.reader[configureForm.interfaceGroup].routingKey" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="task" prop="param.reader[0].task">
              <el-select v-model="configureForm.param.reader[configureForm.interfaceGroup].task" auto-complete="off" placeholder="task">
                <el-option
                  v-for="item in taskList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <!-- 1：没有redis；2：删除redis（备用SQL, 表达式， redisKey）;3:更新redis（备用SQL， redisKey）;4:触发器" -->
            <template v-if="configureForm.param.reader[configureForm.interfaceGroup].task > 1">
              <el-form-item label="表名" prop="param.reader[0].tableName">
                <el-input v-model="configureForm.param.reader[configureForm.interfaceGroup].tableName" auto-complete="off"></el-input>
              </el-form-item>
              <template v-if="configureForm.param.reader[configureForm.interfaceGroup].task==2 || configureForm.param.reader[configureForm.interfaceGroup].task==3">
                <el-form-item label="备用查询语句" prop="param.reader[0].sql2">
                  <el-input v-model="configureForm.param.reader[configureForm.interfaceGroup].sql2" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="redisKey" prop="param.reader[0].redisKey">
                  <el-input v-model="configureForm.param.reader[configureForm.interfaceGroup].redisKey" placeholder="writer和reader中保持一致" auto-complete="off"></el-input>
                </el-form-item>
                <template v-if="configureForm.param.reader[configureForm.interfaceGroup].task==2 || configureForm.param.reader[configureForm.interfaceGroup].task==3">
                  <el-form-item label="表达式" prop="param.reader[0].param">
                    <el-input v-model="configureForm.param.reader[configureForm.interfaceGroup].param" placeholder="表达式1，字段1..." auto-complete="off"></el-input>
                  </el-form-item>
                </template>
              </template>
              <template v-if="configureForm.param.reader[configureForm.interfaceGroup].task==4">
                <template v-for="(domain, index) in configureForm.param.reader[configureForm.interfaceGroup].trigger">
                  <template v-if="index>0">
                    <hr>
                  </template>
                  <el-form-item label="触发条件" class="switch">
                    <el-select v-model="domain.type" placeholder="触发条件">
                      <el-option key="insert" label="新增" value="insert"></el-option>
                      <el-option key="update" label="更新" value="update"></el-option>
                      <el-option key="delete" label="删除" value="delete"></el-option>
                   </el-select>
                    <template v-if="index>0">
                      <el-button @click.prevent="removeTriggerDomain(domain)">删除触发器</el-button>
                    </template>
                    <template v-else>
                      <el-button @click="addTriggerDomain">增加触发器</el-button>
                    </template>
                  </el-form-item>
                  <el-form-item label="表达式" prop="param.reader[0].expression">
                    <el-input v-model="domain.expression" auto-complete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="执行完操作">
                    <el-select v-model="domain.process" placeholder="触发条件">
                      <el-option key="1" label="新增" value="1"></el-option>
                      <el-option key="2" label="更新" value="2"></el-option>
                      <el-option key="3" label="删除" value="3"></el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </template>
            </template>
          </template>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="configureVisible = false">取消</el-button>
          <el-button type="primary" @click.native="configureSubmit" :loading="configureLoading">提交</el-button>
        </div>
      </el-dialog>

    </div>
</template>

<script>
    import { InterFaces, InterfaceGroups, SamplingRecord, Marathon } from '../../api/api'
    import moment from 'moment/moment'
    export default {
      data () {
        return {
          resultVisible: false,
          resultInfoVisible: false,
          // 添加接口时的采样结果
          interFaceResult: [
          ],
          // 采样结果明细
          resultDataList: [
          ],
          // 采样结果
          resultData: [
          ],
          // 下拉框数据
          selectSystemData: [
          ],
          selectInterFaceType: [
            { value: 1, label: 'Reader' },
            { value: 2, label: 'Writer' }
          ],
          // task下拉
          taskList: [
            { value: 1, label: '无redis' },
            { value: 2, label: '删除redis' },
            { value: 3, label: '更新redis' },
            { value: 4, label: '触发器' }
          ],
          // task下拉
          taskListW: [
            { value: 1, label: '无redis' },
            { value: 2, label: '删除redis' },
            { value: 4, label: '触发器' }
          ],
          // 表格数据
          tableData: [
          ],
          resultInfoIsLoading: false,
          // 采样结果获取
          resultIsLoading: false,
          // 显示表格时候是否loading
          isLoading: false,
          // 配置接口是否loading
          configureLoading: false,
          // 是否显示添加界面
          addFormVisible: false,
          // 是否显示编辑界面
          editFormVisible: false,
          // 是否显示接口配置界面
          configureVisible: false,
          // 表格查询条件
          formInline: {
            name: ''
          },
          // 分页对象
          page: {
            page: 1,
            size: 10,
            totalElements: 0
          },
          // 采样明细分页对象
          resultInfoPage: {
            row: null,
            page: {
              page: 1,
              size: 10,
              totalElements: 0
            }
          },
          // 新增界面数据
          addForm: {
            interfaceGroup: {
              id: null,
              type: null
            },
            name: '',
            note: '',
            serviceName: '',
            imageName: '',
            imageTag: '',
            type: null,
            tables: ''
          },
          addLoading: false,
          addFormRules: {
            'interfaceGroup.id': [
              { required: true, type: 'number', message: '请选择所属系统', trigger: 'blur' }
            ],
            name: [
              { required: true, message: '请输入接口名称', trigger: 'blur' }
            ],
            serviceName: [
              { required: true, message: '请输入服务名称', trigger: 'blur' }
            ],
            imageName: [
              { required: true, message: '请输入镜像名称', trigger: 'blur' }
            ],
            imageTag: [
              { required: true, message: '请输入镜像版本', trigger: 'blur' }
            ],
            type: [
              { required: true, type: 'number', message: '请选择接口类型', trigger: 'blur' }
            ]
          },
          editLoading: false,
          // 编辑界面数据
          editForm: {
            id: 0,
            interfaceGroup: {
              id: null
            },
            name: '',
            note: '',
            serviceName: '',
            imageName: '',
            imageTag: '',
            type: null,
            tables: ''
          },
          editFormRules: {
            'interfaceGroup.id': [
              { required: true, type: 'number', message: '请选择所属系统', trigger: 'blur' }
            ],
            name: [
              { required: true, message: '请输入接口名称', trigger: 'blur' }
            ],
            serviceName: [
              { required: true, message: '请输入服务名称', trigger: 'blur' }
            ],
            imageName: [
              { required: true, message: '请输入镜像名称', trigger: 'blur' }
            ],
            imageTag: [
              { required: true, message: '请输入镜像版本', trigger: 'blur' }
            ],
            type: [
              { required: true, type: 'number', message: '请选择接口类型', trigger: 'blur' }
            ]
          },
          configureForm: {
            // 添加字段的同时记得维护refConfigureForm
            id: null,
            type: null,
            interfaceGroup: null,
            param: {
              writer: [
                {
                  exchange: '',
                  routingKey: '',
                  queue: '',
                  cols: '',
                  writerParam: [
                    {
                      checkList: [],
                      insert: '',
                      insertParam: '',
                      insertParamFieldName: '',
                      update: '',
                      updateParam: '',
                      updateParamFieldName: '',
                      select: '',
                      selectParam: '',
                      selectParamFieldName: '',
                      delete: '',
                      tableName: '',
                      task: 1,
                      redisKey: '',
                      traceCondition: ''
                    }
                  ]
                }
              ],
              reader: [
                {
                  // 数据库的reader
                  sql: '',
                  sql2: '',
                  schedule: '',
                  exchange: '',
                  routingKey: '',
                  param: '',
                  redisKey: '',
                  task: 1,
                  trigger: [
                    {
                      type: 'insert',
                      expression: '',
                      process: 1
                    }
                  ]
                }
              ]
            }
          },
          refConfigureForm: {
            id: null,
            type: null,
            interfaceGroup: null,
            param: {
              writer: [
                {
                  exchange: '',
                  routingKey: '',
                  queue: '',
                  cols: '',
                  writerParam: [
                    {
                      checkList: [],
                      insert: '',
                      insertParam: '',
                      insertParamFieldName: '',
                      update: '',
                      updateParam: '',
                      updateParamFieldName: '',
                      select: '',
                      selectParam: '',
                      selectParamFieldName: '',
                      delete: '',
                      tableName: '',
                      task: 1,
                      redisKey: '',
                      traceCondition: ''
                    }
                  ]
                }
              ],
              reader: [
                {
                  // 数据库的reader
                  sql: '',
                  sql2: '',
                  schedule: '',
                  exchange: '',
                  routingKey: '',
                  param: '',
                  redisKey: '',
                  task: 1,
                  trigger: [
                    {
                      type: 'insert',
                      expression: '',
                      process: 1
                    }
                  ]
                }
              ]
            }
          },
          configureFormRules: {
            'param.writer[0].exchange': [
              { required: true, message: '请输入交换机', trigger: 'blur' }
            ],
            'param.writer[0].routingKey': [
              { required: true, message: '请输入RoutingKey', trigger: 'blur' }
            ],
            'param.writer[0].queue': [
              { required: true, message: '请输入队列名称', trigger: 'blur' }
            ],
            'param.reader[0].sql': [
              { required: true, message: '请输入查询语句', trigger: 'blur' }
            ],
            'param.reader[0].schedule': [
              { required: true, message: '请输入调用策略', trigger: 'blur' }
            ],
            'param.reader[0].exchange': [
              { required: true, message: '请输入交换机', trigger: 'blur' }
            ],
            'param.reader[0].routingKey': [
              { required: true, message: '请输入RoutingKey', trigger: 'blur' }
            ]
          }
        }
      },
      methods: {
        configureChange (item) {
          // 因为这里获取的值不是立马生效, 故setTimeout
          setTimeout(function () {
            if (!(item.checkList.indexOf('select') > -1)) {
              item.select = ''
              item.selectParam = ''
            }
            if (!(item.checkList.indexOf('insert') > -1)) {
              item.insert = ''
              item.insertParam = ''
            }
            if (!(item.checkList.indexOf('update') > -1)) {
              item.update = ''
              item.updateParam = ''
            }
            if (!(item.checkList.indexOf('delete') > -1)) {
              item.delete = ''
            }
          }, 0)
        },
        configureSubmit () {
          this.$refs.configureForm.validate((valid) => {
            // 类型名称
            let typeName = this.selectInterFaceType.find((v) => { return v.value === Number.parseInt(this.configureForm.type) }).label.toLowerCase()
            let param = this.configureForm.param[typeName][this.configureForm.interfaceGroup]
            let paramObj = Object.assign({id: this.configureForm.id}, {param: JSON.stringify(param)})
            this.configureLoading = true
            InterFaces.update(paramObj)
            .then(response => {
              this.$message({
                showClose: true,
                message: '配置成功',
                type: 'success'
              })
              this.configureLoading = false
              this.configureVisible = false
              this.onSubmit()
            }, response => {
              this.$message({
                showClose: true,
                message: '配置失败',
                type: 'error'
              })
              this.configureLoading = false
            })
          })
        },
        addDomain () {
          this.configureForm.param.writer[this.configureForm.interfaceGroup].writerParam.push({
            checkList: [],
            insert: '',
            insertParam: '',
            insertParamFieldName: '',
            update: '',
            updateParam: '',
            updateParamFieldName: '',
            select: '',
            selectParam: '',
            selectParamFieldName: '',
            delete: '',
            tableName: '',
            task: 1,
            redisKey: '',
            traceCondition: ''
          })
        },
        removeDomain (item) {
          var index = this.configureForm.param.writer[this.configureForm.interfaceGroup].writerParam.indexOf(item)
          if (index !== 0) {
            this.configureForm.param.writer[this.configureForm.interfaceGroup].writerParam.splice(index, 1)
          }
        },
        addTriggerDomain () {
          this.configureForm.param.reader[this.configureForm.interfaceGroup].trigger.push({
            type: 'insert',
            expression: '',
            process: 1
          })
        },
        removeTriggerDomain (item) {
          var index = this.configureForm.param.reader[this.configureForm.interfaceGroup].trigger.indexOf(item)
          if (index !== 0) {
            this.configureForm.param.reader[this.configureForm.interfaceGroup].trigger.splice(index, 1)
          }
        },
        handleConfigure (index, row) {
          this.configureVisible = true
          // 配置接口属性
          // 获取接口类型, 是write, 还是reader
          this.configureForm.type = row.type
          // 获取系统类型
          this.configureForm.interfaceGroup = row.interfaceGroup.type
          // 获取id
          this.configureForm.id = row.id
          let param = row.param
          // 判断是初次还是编辑, 初次的话  直接当json序列化会报错
          // 类型名称
          let typeName = this.getTypeName(row.type)
          if (param) {
            param = JSON.parse(param)
          } else {
            param = JSON.parse(JSON.stringify(this.refConfigureForm.param[typeName][row.interfaceGroup.type]))
          }
          this.configureForm.param[typeName].splice(row.interfaceGroup.type, 1, param)
          // 加载明细
          SamplingRecord.queryByInterfaces(row.id)
          .then(response => {
            this.interFaceResult = []
            response.map((x) => {
              x.operation_date = moment(x.operation_date).format('YYYY-MM-DD HH:ss:mm')
              this.interFaceResult.push(x)
            })
          }, response => {
            console.info(response)
          })
        },
        handleMarathon (index, row) {
          let rid = row.id
          if (row.marathon) {
            // 停止
            Marathon.delete(rid)
            .then(response => {
              this.$message({
                showClose: true,
                message: '停止成功',
                type: 'success'
              })
              row.marathon = null
            }, response => {
              this.$message({
                showClose: true,
                message: '停止失败',
                type: 'error'
              })
            })
          } else {
            // 需要创建
            Marathon.add(rid)
            .then(response => {
              this.$message({
                showClose: true,
                message: '创建成功',
                type: 'success'
              })
              row.marathon = 'staged'
            }, response => {
              this.$message({
                showClose: true,
                message: '创建失败',
                type: 'error'
              })
            })
          }
        },
        formatStatus (row, column) {
          let typeName = this.getTypeName(row.type)
          let name = 'Marathon'
          if (typeName === 'reader') {
            name = 'Chronos'
          }
          return row.marathon === 'running' || row.marathon === 'staged' ? '停止' + name : '创建' + name
        },
        refDialog (name) {
          this.$refs[name].resetFields()
        },
        closeResultData () {
          // 初始化分页
          this.resultInfoPage = {
            row: null,
            page: {
              page: 1,
              size: 10,
              totalElements: 0
            }
          }
        },
        addInterfaceGroupChange (id) {
          // 新增界面系统变更方法
          if (id) {
            this.addForm.interfaceGroup.type = this.getSystem(id).type
          } else {
            this.addForm.interfaceGroup.type = null
          }
        },
        getResult () {
          this.resultInfoVisible = true
          this.resultInfoIsLoading = true
          SamplingRecord.add(this.resultInfoPage.row)
          .then(response => {
            this.$message({
              showClose: true,
              message: '采样成功',
              type: 'success'
            })
            this.resultInfoIsLoading = false
            try {
              this.resultData = JSON.parse(response.result)
            } catch (err) {
              console.info(err)
              this.resultData = []
            }
            this.handleResult(null, this.resultInfoPage.row)
          }, response => {
            this.$message({
              showClose: true,
              message: '采样失败',
              type: 'error'
            })
          })
        },
        resultInfo (index, row) {
          this.resultInfoVisible = true
          let result = JSON.parse(row.result)
          this.resultData = result
        },
        handleResult (index, row) {
          this.resultIsLoading = true
          this.resultVisible = true
          this.resultInfoPage.row = row
          SamplingRecord.findByInterfaces(this.resultInfoPage.row.id, {params: this.resultInfoPage.page})
          .then(response => {
            this.resultDataList = []
            response.content.map((x) => {
              x.operation_date = moment(x.operation_date).format('YYYY-MM-DD HH:ss:mm')
              this.resultDataList.push(x)
            })
            this.resultInfoPage.page.totalElements = response.totalElements
            this.resultIsLoading = false
          }, response => {
            console.info(response)
          })
        },
        handleChange (index, row) {
          let enabled = row.enabled
          let text = enabled ? '启用' : '停用'
          this.$confirm('此操作将' + text + '该接口, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let param = Object.assign({}, row)
            param.enabled = !param.enabled
            InterFaces.update(param)
            .then(response => {
              this.$message({
                type: 'success',
                message: text + '成功!'
              })
              this.onSubmit()
            }, response => {
              console.info('fail')
            })
          }).catch(() => {
            console.info('关闭停用')
          })
        },
        handleEdit (index, row) {
          this.editFormVisible = true
          let obj = Object.assign({}, row)
//          let param = JSON.parse(obj.param)
//          // 类型名称
//          let typeName = this.selectInterFaceType.find((v) => { return v.value === Number.parseInt(obj.type) }).label.toLowerCase()
//          this.editForm.param[typeName][obj.interfaceGroup.type] = param
//          delete obj.param
          this.editForm = Object.assign({}, this.editForm, obj)
        },
        handleDel (index, row) {
          this.$confirm('此操作将永久删除该接口, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            InterFaces.delete(row.id)
            .then(response => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.onSubmit()
            }, response => {
              console.info('fail')
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        },
        editSubmit () {
          this.$refs.editForm.validate((valid) => {
            if (valid) {
              this.editLoading = true
              let params = Object.assign({}, this.editForm)
//              params.param = JSON.stringify(params.param[this.selectInterFaceType.find((v) => { return v.value === this.editForm.type }).label.toLowerCase()][this.editForm.interfaceGroup.type])
              InterFaces.update(params)
              .then(response => {
                this.$message({
                  showClose: true,
                  message: '编辑成功',
                  type: 'success'
                })
                this.editLoading = false
                this.editFormVisible = false
                this.onSubmit()
              }, response => {
                this.$message({
                  showClose: true,
                  message: '编辑失败',
                  type: 'error'
                })
                this.editLoading = false
              })
            } else {
              console.info('error')
            }
          })
        },
        addSubmit () {
          this.$refs.addForm.validate((valid) => {
            if (valid) {
              this.addLoading = true
              let params = Object.assign({}, this.addForm)
              InterFaces.add(params)
              .then(response => {
                this.$message({
                  showClose: true,
                  message: '添加成功',
                  type: 'success'
                })
                this.addLoading = false
                this.addFormVisible = false
                this.$refs['addForm'].resetFields()
                this.onSubmit()
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
        addSystem () {
          this.addFormVisible = true
        },
        onSubmit () {
          this.isLoading = true
          InterFaces.list({params: Object.assign(this.page, this.formInline)})
          .then(response => {
            this.isLoading = false
            this.page.totalElements = response.totalElements
            response.content.map((x) => {
              // 用作后续更新marathon按钮
              x.marathon = null
            })
            this.tableData = response.content
            // 这个时候再发请求获取
            this.renderMarathon()
          }, response => {
            console.info('fail')
          })
        },
        renderMarathon () {
          Marathon.list()
          .then(response => {
            this.tableData.map((x) => {
              // 先于marathon对比
              let typeName = this.getTypeName(x.type)
              let marathon = response.marathon.find((m) => {
                  // 对比状态与系统类型, marathon应该是writer
                return (m.name === x.serviceName && typeName === 'writer')
              })
              if (marathon) {
                x.marathon = marathon.status
              }
              let chronos = response.chronos.find((m) => {
                  // 对比状态与系统类型, chronos应该是reader
                return (m.name === x.serviceName && typeName === 'reader')
              })
              console.info(chronos)
              // chronos很猥琐... 存在这个数组.. 就认为是running..
              if (chronos) {
                x.marathon = 'running'
              }
            })
          }, response => {
            // 跟当前做比对
            console.info('--获取marathon失败--')
          })
        },
        handleSelectionChange () {

        },
        handleSizeChange (val) {
          console.info(val)
        },
        handleCurrentChange (val) {
          this.onSubmit()
        },
        resultInfoCurrentChange (val) {
          if (this.resultInfoPage.row) {
            this.handleResult(null, this.resultInfoPage.row)
          }
        },
        initData () {
          // 加载下拉框数据
          InterfaceGroups.listAll()
          .then(response => {
            this.selectSystemData = response
          }, response => {
            console.info(response)
          })
        },
        getSystem (id) {
          // 根据系统ID获取系统
          // 获取系统类型 0.数据库 1.webService 2.MQ
          return this.selectSystemData.find((obj) => {
            return obj.id === id
          })
        },
        getTypeName (type) {
          let typeName = this.selectInterFaceType.find((v) => { return v.value === Number.parseInt(type) }).label.toLowerCase()
          return typeName
        }
      },
      mounted () {
        this.initData()
        this.onSubmit()
        // 定时获取marathon状态
        this.currInterval = setInterval(() => { this.renderMarathon() }, 10000)
      },
      beforeDestroy () {
        // 销毁定时器
        clearInterval(this.currInterval)
      }
    }
</script>

<style lang="scss">
  .switch{
    button{
      margin-left: 10px;
    }
  }
  hr{
    margin: 10px 0px;
    color: #eaeefb;
  }
  .el-table__expanded-cell{
    padding: 0px !important;
  }
  .lowerCase input{
    text-transform: lowercase;
  }
</style>
