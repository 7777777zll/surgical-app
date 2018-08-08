<template>
  <div class="instrumentBoxStatus">
    <el-row>
      <el-col :span="6" v-for="(item, index) in instrumentBoxList" class="BoxContainer" :key="index">
        <div class="BoxItem" v-bind:class="[item.status === 0 ? 'succ' : 'error']">
          <div class="BoxTitle">
            <p><i class="fa fa-archive"></i>   {{ item.uniquenessCode }}</p>
          </div>
          <div class="BoxLabel">
            <h5>工具数量: {{ item.count }}</h5>
            <h5>状态: {{item.onLineStatus === 0 ? '离线': '在线'}}</h5>
            <h5>分配人: {{ item.operator }}</h5>
            <h5>最后日志时间: {{ item.lastSyncTime }}</h5>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { instrumentBoxList } from '../../api/api'
  export default {
    data () {
      return {
        instrumentBoxList: [],
        isActive: true,
        hasError: false
      }
    },
    methods: {
      initData () {
        instrumentBoxList.findAll()
          .then(response => {
            this.instrumentBoxList = response
            console.info(this.instrumentBoxList)
          }, response => {
            console.info('fail')
          })
      }
    },
    mounted () {
      this.initData()
    }
  }
</script>

<style lang="scss">
  .instrumentBoxStatus{
    padding-top: 10px;
    min-width: 1079px;
    .BoxContainer{
      padding-right: 5px;
      padding-left: 5px;
      padding-bottom: 10px;
    }
    .right{
      padding-right: 0px !important;
    }
    .succ{
      .BoxTitle{
        background-color: #a6a6a6;
      }
      border: 1px solid #a6a6a6;
    }
    .error{
      .BoxTitle{
        background-color: #eb5d5d;
      }
      border: 1px solid #eb5d5d;
    }
    .BoxTitle{
      padding: 5px;
      line-height: 20px;
      border-radius: 3px 3px 0px 0px;
      font-weight: 600;
    }
    .BoxItem{
      border-radius: 5px;
    }
    .BoxIcon {
      vertical-align: middle;
      text-align: center;
      border-radius: 100%;
      i{
        color: #ffffff;
        font-size: 100px;
        transform: translate(0%, 30%);
      }
    }
    .BoxIcon:before{
      content: '';
      display: inline-block;
      padding-bottom: 100%;
      vertical-align: middle;
      width: .1px;
    }
    .BoxLabel{
      text-align: left;
      padding: 5px;
      h5{
        white-space: nowrap;
      }
    }
  }
</style>
