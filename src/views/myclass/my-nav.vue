<template>
  <div class="my-nav">
    <div class="nav-wrap">
      <h1 class="logo-wrap">Live broadcast</h1>
      <div class="serach-wrap">
        <el-input v-model="value" suffix-icon="el-icon-search"></el-input>
      </div>
      <my-profile :avatar="avatar" :nickname="nickname" />
    </div>
  </div>
</template>

<script>
import MyProfile from "./my-profile";
export default {
  name: "MyNav",
  props: {
    avatar: String,
    nickname: String
  },
  data() {
    return {
      value: ""
    };
  },
  components: {
    MyProfile
  }
};
</script>

<style lang="scss" scoped>
.my-nav {
  height: 60px;
  color: #ffffff;
  font-size: 14px;
  background-color: #2e333f;
  .nav-wrap {
    width: 1205px;
    height: 100%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    h1 {
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
