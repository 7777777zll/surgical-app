<template>
  <div class="userManagement">
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
        <el-button type="primary" class="btn-export" @click="upLoadExcl">导入Excl</el-button>
        <el-dropdown class="btn-export" @command="exportExcl">
          <el-button type="primary">
            导出Excl<i class="el-icon-caret-bottom el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="0">导出全部</el-dropdown-item>
            <el-dropdown-item command="1">导出选中</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-form>
    </el-col>
    <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" v-loading="isLoading" element-loading-text="拼命加载中">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column
        type="index"
        label="序号"  align="center"
        width="80">
      </el-table-column>
      <el-table-column prop="userCode" label="工号" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="120" show-overflow-tooltip>
      </el-table-column>
          <el-table-column prop="loginName" label="登录名" width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="department.name" label="所属部门" width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="callNumber" label="电话" width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="isLock" label="是否锁定" width="120" :formatter="_formatLock" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="stopFlag" label="状态" width="120" :formatter="_formatType" show-overflow-tooltip>
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
    <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false" @close="refDialog('addForm')">
      <el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm">
               <el-form-item label="工号" prop="userCode">
          <el-input v-model="addForm.userCode" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
                <el-form-item label="登录名" prop="loginName">
          <el-input v-model="addForm.loginName" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="所属部门" prop="department.id">
          <el-select v-model="addForm.department.id" auto-complete="off">
            <el-option
              v-for="item in departmentList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电话" prop="callNumber">
          <el-input v-model="addForm.callNumber" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addForm.password" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--编辑界面-->
    <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
         <el-form-item label="工号" prop="userCode">
          <el-input v-model="editForm.userCode" auto-complete="off"></el-input>
        </el-form-item>
         <el-form-item label="名称" prop="name">
          <el-input v-model="editForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="登录名" prop="loginName">
          <el-input v-model="editForm.loginName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属部门" prop="department.id">
          <el-select v-model="editForm.department.id" auto-complete="off">
            <el-option
              v-for="item in departmentList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电话" prop="callNumber">
          <el-input v-model="editForm.callNumber" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="editForm.stopFlag" on-color="#13ce66" off-color="#ff4949" on-text="启用" off-text="停用" @change="stopFlagChange"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--详情界面-->
    <el-dialog title="详情" v-model="infoFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" ref="editForm" inline label-position="left">
        <el-col :span="8">
          <el-form-item label="工号:">
            {{editForm.userCode}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="姓名:">
            {{editForm.name}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="登录名:">
            {{editForm.loginName}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="所属部门:">
            {{editForm.department.name}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="电话:">
            {{editForm.callNumber}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态:">
            {{_formatType(editForm)}}
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="infoFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>

    <!--上传界面-->
    <el-dialog title="导入Excl" v-model="upLoadFormVisible" :close-on-click-modal="false">
      <el-upload
        class="upload-demo"
        ref="upload"
        action="https://jsonplaceholder.typicode.com/posts/"
        :file-list="fileList"
        :on-progress="progress"
        :auto-upload="false">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </el-dialog>

  </div>
</template>

<script>
  import { department, user } from "../../api/api";
  export default {
    data() {
      return {
        // 表格数据
        tableData: [],
        // 部门列表
        departmentList: [],
        // 表格选中列表
        multipleSelection: [],
        // 显示表格时候是否loading
        isLoading: false,
        // 是否显示添加界面
        addFormVisible: false,
        // 是否显示编辑界面
        editFormVisible: false,
        // 是否显示导入界面
        upLoadFormVisible: false,
        // 是否显示详情
        infoFormVisible: false,
        // 导入列表
        fileList: [],
        // 表格查询条件
        formInline: {
          name: "",
          stopFlag: ""
        },
        // 分页对象
        page: {
          page: 1,
          size: 10,
          totalElements: 0
        },
        // 新增界面数据
        addForm: {
          name: "",
          userCode: "",
          department: {
            id: null
          },
          callNumber: "",
          loginName: "",
          password: "",
          stopFlag: true
        },
        addLoading: false,
        addFormRules: {
          name: [{ required: true, message: "请输入名称", trigger: "blur" }]
        },
        editLoading: false,
        // 编辑界面数据
        editForm: {
          id: 0,
          name: "",
          userCode: "",
          department: {
            id: null
          },
          callNumber: "",
          loginName: "",
          password: "",
          stopFlag: null
        },
        editFormRules: {
          name: [{ required: true, message: "请输入名称", trigger: "blur" }]
        }
      };
    },
    methods: {
      refDialog(name) {
        this.$refs[name].resetFields();
      },
      stopFlagChange(val) {
        // 即将进行的操作
        let op = val;
        let text = op ? "启用" : "停用";
        this.$confirm("此操作将" + text + "该用户, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {})
          .catch(() => {
            this.editForm.stopFlag = !val;
          });
      },
      exportExcl(e) {
        // 0 打印全部 , 1打印选中
        if (e) {
          // 打印选中
          console.info(this.multipleSelection);
        } else {
          // 打印全部
        }
        console.info(this.multipleSelection);
      },
      progress(event, file, fileList) {
        console.info(event);
      },
      submitUpload() {
        this.$refs.upload.submit();
      },
      upLoadExcl() {
        this.upLoadFormVisible = true;
      },
      _formatPassword(row, column) {
        return row.canPassword ? "是" : "否";
      },
      _formatLock(row, column) {
        return row.isLock ? "是" : "否";
      },
      _formatType(row, column) {
        // 序列化类型
        return row.stopFlag ? "启用" : "停用";
      },
      handleInfo(index, row) {
        this.infoFormVisible = true;
        this.editForm = Object.assign({}, row);
      },
      handleChange(index, row) {
        let enabled = row.stopFlag;
        let text = enabled ? "停用" : "启用";
        this.$confirm("此操作将" + text + "该器械类型, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let param = Object.assign({}, row);
            param.stopFlag = !param.stopFlag;
            user.update(param).then(
              response => {
                this.$message({
                  type: "success",
                  message: text + "成功!"
                });
                this.onSubmit();
              },
              response => {
                this.$message({
                  type: "error",
                  message: text + "失败!"
                });
              }
            );
          })
          .catch(() => {
            console.info("关闭停用");
          });
      },
      handleEdit(index, row) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
      },
      editSubmit() {
        this.$refs.editForm.validate(valid => {
          if (valid) {
            this.editLoading = true;
            let params = Object.assign({}, this.editForm);
            user.update(params).then(
              response => {
                this.$message({
                  showClose: true,
                  message: "编辑成功",
                  type: "success"
                });
                this.editLoading = false;
                this.editFormVisible = false;
                this.onSubmit();
              },
              response => {
                this.$message({
                  showClose: true,
                  message: "编辑失败",
                  type: "error"
                });
                this.editLoading = false;
              }
            );
          } else {
            console.info("error");
          }
        });
      },
      addSubmit() {
        this.$refs.addForm.validate(valid => {
          if (valid) {
            this.addLoading = true;
            let params = Object.assign({}, this.addForm);
            user.add(params).then(
              response => {
                this.$message({
                  showClose: true,
                  message: "添加成功",
                  type: "success"
                });
                this.addLoading = false;
                this.addFormVisible = false;
                this.$refs["addForm"].resetFields();
                this.onSubmit();
              },
              response => {
                this.$message({
                  showClose: true,
                  message: "添加失败",
                  type: "error"
                });
                this.addLoading = false;
              }
            );
          } else {
            console.info("error");
          }
        });
      },
      addSystem() {
        this.addFormVisible = true;
      },
      onSubmit() {
        // this.isLoading = true
        user
          .findAllForPage({ params: Object.assign(this.page, this.formInline) })
          .then(
            response => {
              this.isLoading = false;
              this.page.totalElements = response.totalElements;
              this.tableData = response.content;
            },
            response => {
              console.info("fail");
            }
          );
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleSizeChange(val) {
        console.info(val);
      },
      handleCurrentChange(val) {
        this.onSubmit();
      },
      initData() {
        // 所有部门
        department.findAll().then(
          response => {
            this.departmentList = [];
            response.map(x => {
              this.departmentList.push({
                value: x.id,
                label: x.name
              });
            });
          },
          response => {
            console.info(response);
          }
        );
      }
    },
    mounted() {
      this.onSubmit();
      this.initData();
    }
  };
</script>

<style>
  .queryBar {
  }
</style>
