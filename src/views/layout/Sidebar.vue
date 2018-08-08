<template>
  <el-menu default-active="$route.path" :collapse="isCollapse" router unique-opened>
    <template v-for="item in permission_routers">
      <template v-if="!item.hidden && item.notSon && item.children.length>0">
        <el-menu-item :index="item.path + '/' + item.children[0].path ">
          <i :class="item.icon"></i>
          <span slot="title">{{item.name}}</span>
        </el-menu-item>
      </template>
      <template v-if="!item.notSon && !item.hidden && item.children.length>0">
        <el-submenu :index="item.path">
          <template slot="title">
            <i :class="item.icon"></i>
            <span slot="title">{{item.name}}</span>
          </template>
          <template v-for="child in item.children" v-if='!child.hidden'>
            <el-menu-item :index="item.path + '/' + child.path">
              <span slot="title">{{child.name}}</span>
            </el-menu-item>
          </template>
        </el-submenu>
      </template>
    </template>
  </el-menu>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'sidebar',
    computed: {
      ...mapGetters([
        'permission_routers',
        'sidebar'
      ]),
      isCollapse () {
        console.info(this.permission_routers)
        return !this.sidebar
      }
    }
  }
</script>
