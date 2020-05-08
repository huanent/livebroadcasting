<template>
  <div class="my-class-nav">
    <div class="my-class-wrap">
      <div class="logo-wrap">Live broadcast</div>
      <div class="serach-wrap">
        <el-input v-model="value" suffix-icon="el-icon-search"></el-input>
      </div>
      <div class="userinfo-wrap">
        <!-- <div class="my-classroom">我的课堂</div> -->
        <user-info />
      </div>
    </div>
  </div>
</template>

<script>
import userInfo from "./my-class-userinfo";
export default {
  name: "MyClassNav",
  data() {
    return {
      value: ""
    };
  },
  components: {
    userInfo
  }
};
</script>

<style lang="scss" scoped>
.my-class-nav {
  height: 60px;
  color: $white;
  font-size: 14px;
  background-color: #2e333f;
  .my-class-wrap {
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
    }
    .userinfo-wrap {
      display: flex;
      line-height: 60px;
      .my-classroom {
        margin-right: 35px;
      }
    }
  }
}
</style>
