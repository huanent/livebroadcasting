<template>
  <div class="my-class-nav">
    <div class="nav-wrap">
      <div class="logo-wrap">Live broadcast</div>
      <div class="serach-wrap">
        <el-input v-model="value" suffix-icon="el-icon-search"></el-input>
      </div>
      <div>我的课堂</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MyClassNav",
  data() {
    return {
      value: ""
    };
  }
};
</script>

<style lang="scss" scoped>
.my-class-nav {
  height: 60px;
  color: $white;
  font-size: 14px;
  background-color: #2e333f;
  .nav-wrap {
    width: 1205px;
    height: 100%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .logo-wrap {
      font-size: 32px;
    }
    .serach-wrap {
      width: 320px;
      /deep/ .el-input__inner {
        border-radius: 20px;
        background-color: #444444;
        border-color: #444444;
        color: #f5f5f5;
      }
    }
  }
}
</style>
