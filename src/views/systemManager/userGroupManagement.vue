<template>
  <div class="userGroupManagement">
    <el-col :span="24" class="queryBar">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="名称">
          <el-input v-model="formInline.name"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="formInline.stopFlag">
            <el-option label="全部" value=""></el-option>
            <el-option label="启用" value="true"></el-option>
            <el-option label="停用" value="false"></el-option>
          </el-select>
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
      <el-table-column
        type="index"
        label="序号"  align="center"
        width="80">
      </el-table-column>
      <el-table-column prop="name" label="名称" width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="remark" label="描述" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="stopFlag" label="状态" width="120" :formatter="_formatType" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="isAli" label="系统内置" width="120" :formatter="_formatSystem" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="creater" label="创建人" width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="createrTime" label="创建时间" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button size="small" @click="handleInfo(scope.$index, scope.row)">详情</el-button>
          <el-button type="warning" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleChange(scope.$index, scope.row)">{{ scope.row.stopFlag ? '停用' : '启用' }}</el-button>
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
    <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false" @close="refDialog('addForm')">
      <el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm">
        <el-form-item label="名称" prop="name">
          <el-input v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="addForm.remark" auto-complete="off"></el-input>
        </el-form-item>
        <!--<el-form-item label="菜单">
          <el-tree
            :data="menuList"
            show-checkbox
            :props="treeProps"
            node-key="id"
            class="formTree"
            ref="addFormTree"
          >
          </el-tree>
        </el-form-item>-->
        <el-form-item label="权限">
          <el-transfer
            filterable
            :props="transferProps"
            v-model="addForm.power"
            :titles="['未选择', '已选择']"
            :button-texts="['删除', '添加']"
            :data="powerList">
          </el-transfer>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--编辑界面-->
    <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
        <el-form-item label="名称" prop="name">
          <el-input v-model="editForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="editForm.remark" auto-complete="off"></el-input>
        </el-form-item>
      <!--  <el-form-item label="菜单">
          <el-tree
            :data="menuList"
            show-checkbox
            :props="treeProps"
            :default-checked-keys="editForm.menu"
            node-key="id"
            class="formTree"
            ref="editFormTree"
          >
          </el-tree>
        </el-form-item>-->
        <el-form-item label="权限">
          <el-transfer
            filterable
            :props="transferProps"
            v-model="editForm.power"
            :titles="['未选择', '已选择']"
            :button-texts="['删除', '添加']"
            :data="powerList">
          </el-transfer>
        </el-form-item>
        <el-form-item label="">
          <el-switch v-model="editForm.stopFlag" active-color="#13ce66" inactive-color="#ff4949" active-text="启用" inactive-text="停用" @change="stopFlagChange"></el-switch>
        </el-form-item>
        <el-form-item label="系统内置">
          {{_formatSystem(editForm)}}
        </el-form-item>
        <el-form-item label="创建人">
          {{editForm.creater}}
        </el-form-item>
        <el-form-item label="创建时间">
          {{editForm.createrTime}}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--详情界面-->
    <el-dialog title="详情" :visible.sync="infoFormVisible" :close-on-click-modal="false">
      <table class="table-detail table-bordered">
        <tbody>
          <tr>
            <td class="title">名称</td>
            <td>{{editForm.name}}</td>
            <td class="title">描述</td>
            <td>{{editForm.remark}}</td>
            <td class="title">状态</td>
            <td>{{_formatType(editForm)}}</td>
          </tr>
          <!--<tr>
            <td class="title">菜单</td>
            <td colspan="5">
              <el-tree
                :data="infoMenuList"
                :props="treeProps"
                node-key="id"
                class="formTree"
                empty-text="暂无菜单"
              >
              </el-tree>
            </td>
          </tr>-->
          <tr>
            <td class="title">权限</td>
            <td colspan="5">
              <el-tree
                :data="infoPowerList"
                :props="treeProps"
                node-key="id"
                class="formTree"
                empty-text="暂无权限"
              >
              </el-tree>
            </td>
          </tr>
        </tbody>
      </table>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="infoFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { role, permission } from '../../api/api'
  export default {
    data () {
      return {
        // 树配置
        treeProps: {
          children: 'children',
          label: 'name'
        },
        // 穿梭框设置
        transferProps: {
          key: 'id',
          label: 'name'
        },
        // 权限列表
        permissionList: [],
        // 菜单列表
        menuList: [],
        // 权限列表
        powerList: [],
        // 表格数据
        tableData: [],
        // 显示表格时候是否loading
        isLoading: false,
        // 是否显示添加界面
        addFormVisible: false,
        // 是否显示编辑界面
        editFormVisible: false,
        // 是否显示详情
        infoFormVisible: false,
        // 表格查询条件
        formInline: {
          name: '',
          stopFlag: ''
        },
        // 分页对象
        page: {
          page: 1,
          size: 10,
          totalElements: 0
        },
        // 新增界面数据
        addForm: {
          name: '',
          remark: '',
          menu: [],
          power: [],
          permissions: [],
          stopFlag: true
        },
        addLoading: false,
        addFormRules: {
          name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
        },
        editLoading: false,
        // 编辑界面数据
        editForm: {
          id: null,
          name: '',
          remark: '',
          menu: [],
          power: [],
          permissions: [],
          stopFlag: null
        },
        editFormRules: {
          name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
        },
        infoMenuList: [],
        infoPowerList: []
      }
    },
    methods: {
      refDialog (name) {
        this.$refs[name].resetFields()
      },
      stopFlagChange (val) {
        // 即将进行的操作
        let op = val
        let text = op ? '启用' : '停用'
        this.$confirm('此操作将' + text + '该器械类型, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {})
          .catch(() => {
            this.editForm.stopFlag = !val
          })
      },
      _formatType (row, column) {
        // 序列化类型
        return row.stopFlag ? '启用' : '停用'
      },
      _formatSystem (row, column) {
        // 序列化类型
        return row.isAli ? '是' : '否'
      },
      handleInfo (index, row) {
        this.infoFormVisible = true
        this.editForm = Object.assign({}, row)
        this.infoMenuList = []
        this.infoPowerList = []
        this.editForm.permissions.map(x => {
          if (x.type === 1) {
            // 菜单
            this.infoMenuList.push(x)
          } else {
            this.infoPowerList.push(x)
          }
        })
      },
      handleChange (index, row) {
        let enabled = row.stopFlag
        let text = enabled ? '停用' : '启用'
        this.$confirm('此操作将' + text + '该用户组, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            let param = Object.assign({}, row)
            param.stopFlag = !param.stopFlag
            role.update(param.id, param).then(
              response => {
                this.$message({
                  type: 'success',
                  message: text + '成功!'
                })
                this.onSubmit()
              },
              response => {
                this.$message({
                  type: 'error',
                  message: text + '失败!'
                })
              }
            )
          })
          .catch(() => {
            console.info('关闭停用')
          })
      },
      handleEdit (index, row) {
        this.editFormVisible = true
        this.editForm = Object.assign({power: [], menu: []}, row)
        this.editForm.permissions.map(x => {
          if (x.type === 1) {
            // 菜单
            this.editForm.menu.push(x.id)
          } else {
            this.editForm.power.push(x.id)
          }
        })
      },
      editSubmit () {
        this.$refs.editForm.validate(valid => {
          if (valid) {
            this.editLoading = true
            // 获取树选中的节点
            //  this.editForm.menu = this.$refs.editFormTree.getCheckedKeys()
            // 把permissions转化成对象数组
            this.editForm.permissions = []
            Array.concat(this.editForm.menu, this.editForm.power).map(x => {
              this.editForm.permissions.push(this.getPermission(x))
            })
            let params = Object.assign({}, this.editForm)
            role.update(params.id, params).then(
              response => {
                this.$message({
                  showClose: true,
                  message: '编辑成功',
                  type: 'success'
                })
                this.editLoading = false
                this.editFormVisible = false
                this.onSubmit()
              },
              response => {
                this.$message({
                  showClose: true,
                  message: '编辑失败',
                  type: 'error'
                })
                this.editLoading = false
              }
            )
          } else {
            console.info('error')
          }
        })
      },
      getPermission (id) {
        // 当前所有权限
        return this.permissionList.find(x => x.id === id)
      },
      addSubmit () {
        this.$refs.addForm.validate(valid => {
          if (valid) {
            this.addLoading = true
            // 获取树选中的节点
            //  this.addForm.menu = this.$refs.addFormTree.getCheckedKeys()
            // 把permissions转化成对象数组
            this.addForm.permissions = []
            Array.concat(this.addForm.menu, this.addForm.power).map(x => {
              this.addForm.permissions.push(this.getPermission(x))
            })
            let params = Object.assign({}, this.addForm)
            role.save(params).then(
              response => {
                this.$message({
                  showClose: true,
                  message: '添加成功',
                  type: 'success'
                })
                this.addLoading = false
                this.addFormVisible = false
                this.$refs['addForm'].resetFields()
                this.onSubmit()
              },
              response => {
                this.$message({
                  showClose: true,
                  message: '添加失败',
                  type: 'error'
                })
                this.addLoading = false
              }
            )
          } else {
            console.info('error')
          }
        })
      },
      addSystem () {
        this.addFormVisible = true
      },
      onSubmit () {
        // this.isLoading = true
        role
          .findAllForPage({ params: Object.assign(this.page, this.formInline) })
          .then(
            response => {
              this.isLoading = false
              this.page.totalElements = response.totalElements
              this.tableData = response.content
            },
            response => {
              console.info('fail')
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
      initData () {
        // 加载下拉菜单
        permission.findAll().then(
          response => {
            this.menuList = []
            this.powerList = []
            this.permissionList = response
            response.map(x => {
              if (x.type === 1) {
                // 菜单
                this.menuList.push(x)
              } else {
                this.powerList.push(x)
              }
            })
          },
          response => {
            console.info(response)
          }
        )
      }
    },
    mounted () {
      this.onSubmit()
      this.initData()
    }
  }
</script>

<style>
  .formTree {
    max-height: 200px;
    height: 200px;
    overflow-y: auto;
  }
</style>
