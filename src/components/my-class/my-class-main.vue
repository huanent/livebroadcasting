<template>
  <div class="my-class-main">
    <div class="main-head">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="我的课堂" name="student"></el-tab-pane>
        <el-tab-pane label="我的开课" name="teacher"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="main-area">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import ClassList from "./classlist/classlist";
export default {
  name: "MyClassMian",
  data() {
    return {
      value: "",
      activeName: "student"
    };
  },
  components: {
    ClassList
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    }
  }
};
</script>

<style lang="scss" scoped>
.my-class-main {
  background: #fff;
  margin-bottom: 40px;
  border-bottom: 1px solid #ddd;
  height: 60px;
  text-align: left;
  .main-head {
    width: 1205px;
    margin: 0 auto;
    /deep/ .el-tabs__item {
      height: 60px;
      line-height: 60px;
      font-size: 18px;
    }
    /deep/ .el-tabs__nav-wrap::after {
      background-color: transparent;
    }
  }
  .main-area {
    background-color: #f4f4f4;
    width: 1205px;
    margin: 0 auto;
  }
}
</style>
