<template>
    <div class="clientDevice">
      <el-form ref="addForm" :model="addForm" label-width="200px">
        <el-form-item
          v-for="(domain, index) in addForm.Content"
          :label="domain.Description"
          :key="domain.Key"
        >
          <el-select v-model="domain.Value" filterable placeholder="请选择">
            <el-option
              v-for="item in checkList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">配置串口</el-button>
        </el-form-item>
      </el-form>
      <!--新增界面-->
    <!--<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false" @close="refDialog('addForm')">-->
      <!--<el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm">-->
        <!--<el-form-item label="设备ID:" prop="Id">-->
          <!--<el-input v-model="addForm.Id" auto-complete="off"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="名称:" prop="name">-->
          <!--<el-select placeholder="电脑" v-model="addForm.name">-->
            <!--<el-option label="电脑" value="电脑"></el-option>-->
            <!--<el-option label="手机" value="手机"></el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="配置字符串:" prop="addString" required>-->
          <!--<el-input v-model="addForm.addString" auto-complete="off"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="描述:" prop="addDes">-->
          <!--<el-input v-model="addForm.desc" auto-complete="off"></el-input>-->
        <!--</el-form-item>-->
      <!--</el-form>-->
      <!--<div slot="footer" class="dialog-footer">-->
        <!--<el-button @click.native="addFormVisible = false">取消</el-button>-->
        <!--<el-button type="primary" @click.native="addSubmit" :loading="addLoading">确认</el-button>-->
      <!--</div>-->
    <!--</el-dialog>-->
     <!--&lt;!&ndash;编辑界面&ndash;&gt;-->
    <!--<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false" @close="refDialog('editForm')">-->
      <!--<el-form :model="editForm" label-width="100px" ref="editForm">-->
        <!--<el-form-item label="设备ID:" prop="addId">-->
          <!--{{editForm.Id}}-->
        <!--</el-form-item>-->
        <!--<el-form-item label="名称:" prop="name">-->
          <!--<el-select placeholder="电脑" v-model="editForm.name">-->
            <!--<el-option label="电脑" value="电脑"></el-option>-->
            <!--<el-option label="手机" value="手机"></el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="配置字符串:" prop="addString" required>-->
          <!--<el-input v-model="editForm.addString" auto-complete="off"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="描述:" prop="addDes">-->
          <!--<el-input v-model="editForm.desc" auto-complete="off"></el-input>-->
        <!--</el-form-item>-->
      <!--</el-form>-->
      <!--<div slot="footer" class="dialog-footer">-->
        <!--<el-button @click.native="editFormVisible = false">取消</el-button>-->
        <!--<el-button type="primary" @click.native="editForm" :loading="editLoading">确认</el-button>-->
      <!--</div>-->
    <!--</el-dialog>-->
    </div>
</template>

  <script>
  export default {
    data () {
      return {
        addForm: {
          Content: []
        },
        checkList: []
      }
    },
    created: function () {
      new Array(16).fill(1).forEach((v, i) => {
        this.checkList.push({
          label: 'com' + (i + 1),
          value: 'com' + (i + 1)
        })
      })
      this.clientList()
    },
    methods: {
//      handleClick (tab, event) {
//        console.log(tab, event)
//      },
//      addSystem () {
//        this.addFormVisible = true
//      },
//      handleEdit (index, row) {
//        this.editFormVisible = true
//        this.editForm = Object.assign({}, row)
//      },
      onSubmit () {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            let params = Object.assign({}, this.addForm)
            this.nativeFun('setLocalSetting', JSON.stringify(params))
          } else {
            console.info('error')
          }
        })
      },
      clientList () {
        let obj = this.nativeFun('getLocalSetting')
        if (obj) {
          this.addForm = JSON.parse(obj)
        }
      }
    }
  }
</script>

<style lang="scss">
  .clientDevice{
    .el-input__inner{
      width: 300px;
    }
  }
</style>
