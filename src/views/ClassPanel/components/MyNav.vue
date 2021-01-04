<template>
  <div class="my-nav">
    <div class="nav-wrap">
      <router-link tag="h1" to="/">Live broadcast</router-link>
      <!-- <div class="serach-wrap">
        <el-input v-model="value" suffix-icon="el-icon-search"></el-input>
      </div> -->
      <my-profile :avatar="avatar" :nickname="nickname" />
    </div>
  </div>
</template>

<script>
import MyProfile from "./MyProfile";
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
  background-color: #506EFA;
  .nav-wrap {
    width: 1205px;
    padding: 0 15px;
    height: 100%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    @media screen and (max-width: 1200px) {
      width: auto;
    }
    h1 {
      font-size: 32px;
      cursor: pointer;
      white-space: nowrap;
      @media screen and (max-width: 575px) {
        font-size: 24px;
      }
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
