<template>
  <div class="producerDict">
    <el-col :span="24" class="queryBar">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label= "查询条件">
          <el-select v-model="formInline.term" auto-complete="off" placeholder="请选择">
            <el-option v-for="item in selectTermsDate" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item> 
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" v-loading="isLoading" element-loading-text="拼命加载中">
      <el-table-column prop="index" label="序号"  align="center" width="120">
      </el-table-column>
      <el-table-column prop="name" label="名称" width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="spell" label="拼音" width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="address" label="地址" width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="zipCode" label="邮编" width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="contacts" label="联系人" width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="contactNumber" label="联系电话" width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="email" label="E-mail" width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="zipCode" label="创建人" width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="zipCode" label="创建时间" width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="zipCode" label="更新人" width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="zipCode" label="更新时间" width="120" show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <el-col :span="24" class="queryBar">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="page.page" :page-size="page.size" layout="total, prev, pager, next" :total="page.totalElements" style="float: right">
      </el-pagination>
    </el-col>
  
    <!--新增界面-->
    <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false" @close="refDialog('addForm')">
      <el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm">
        <el-form-item label="名称" prop="name">
          <el-input v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="addForm.address" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮编" prop="zipCode">
          <el-input v-model="addForm.zipCode" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="zipCode">
          <el-input v-model="addForm.contacts" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="zipCode">
          <el-input v-model="addForm.contactNumber" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="E-mail" prop="zipCode">
          <el-input v-model="addForm.email" auto-complete="off"></el-input>
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
        <el-form-item label="名称" prop="name">
          <el-input v-model="editForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="editForm.address" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮编" prop="zipCode">
          <el-input v-model="editForm.zipCode" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="zipCode">
          <el-input v-model="editForm.contacts" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="zipCode">
          <el-input v-model="editForm.contactNumber" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="E-mail" prop="zipCode">
          <el-input v-model="editForm.email" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { producerDict } from '../../api/api'
export default {
  data () {
    return {
      // 下拉框数据
      selectTypeData: [
        { value: 0, label: '数据库' },
        { value: 1, label: 'webService' },
        { value: 2, label: 'MQ' }
      ],
      selectDbData: [
        { value: 'com.mysql.jdbc.Driver', label: 'mysql' },
        { value: 'oracle.jdbc.driver.OracleDriver', label: 'oracle' },
        { value: 'com.microsoft.sqlserver.jdbc.SQLServerDriver', label: 'sqlserver' }
      ],
      // 查询条件下拉框
      selectTermsDate: [
        {value: '-1', label: '最近需检修'},
        {value: '0', label: '正在检修'},
        {value: '1', label: '检修完成'}
      ],
      // 显示表格时候是否loading
      isLoading: false,
      // 是否显示添加界面
      addFormVisible: false,
      // 是否显示编辑界面
      editFormVisible: false,
      // 表格查询条件
      formInline: {
        term: ''
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
        address: '',
        zipCode: '',
        contacts: '',
        contactNumber: '',
        email: ''
      },
      addLoading: false,
      addFormRules: {
      },
      editLoading: false,
      // 编辑界面数据
      editForm: {
        id: 0,
        name: '',
        address: '',
        zipCode: '',
        contacts: '',
        contactNumber: '',
        email: ''
      },
      editFormRules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        type: [
          { required: true, type: 'number', message: '请选择系统类型', trigger: 'blur' }
        ],
        'param.className': [
          { required: true, message: '请选择数据库类型', trigger: 'blur' }
        ],
        'param.host': [
          { required: true, message: '请输入IP地址', trigger: 'blur' }
        ],
        'param.port': [
          { required: true, message: '请输入端口号', trigger: 'blur' }
        ],
        'param.name': [
          { required: true, message: '请输入数据库名称', trigger: 'blur' }
        ],
        'param.username': [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        'param.password': [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    refDialog (name) {
      this.$refs[name].resetFields()
    },
    /* _QueryVendor: function () {
      var _this = this;
      _this.$http({
        method: 'GET',
        url: 'http://192.168.30.235:9999/rest/knowledge/list',
        data: { 'websiteId': 2, 'pageSize': 20, 'pageNo': 1, 'isTop': 0 },
        headers: { "X-Requested-With": "XMLHttpRequest" },
        emulateJSON: true
      })
      $.getJSON(app.buildUrl('vendordict/findVendorList?stopFlag=0'), {}, function (json) {
        var arr = [{ id: -1, text: '全部' }];
        for (var i = 0; i < json.length; i++) {
          arr.push({
            id: json[i].id,
            text: json[i].vendorName
          });
        }
        _this.selectTypeData = arr
      });
    }, */
    handleEdit (index, row) {
      this.editFormVisible = true
      this.editForm = Object.assign({}, row)
    },
    onSubmit () {
      // this.isLoading = true
      producerDict.list({ params: Object.assign(this.page, this.formInline) })
        .then(response => {
          this.isLoading = false
          this.page.totalElements = response.totalElements
          this.tableData = response.content
        }, response => {
          console.info('fail')
        })
    },
    handleSelectionChange () {

    },
    handleSizeChange (val) {
      console.info(val)
    },
    handleCurrentChange (val) {
      this.onSubmit()
    }
  },
  mounted () {
    this.onSubmit()
  }
}
</script>

<style>
.queryBar {}
</style>
