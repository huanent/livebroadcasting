<template>
  <div class="my-class">
    <my-nav :avatar="avatar" :nickname="nickname" />
    <router-view
      @update="handleUserInfoUpdate"
      :userInfo="userInfo"
    ></router-view>
  </div>
</template>

<script>
import MyNav from "./my-nav";
import { mapState, mapMutations } from "vuex";
import userApi from "@api/user";

export default {
  name: "MyClass",
  data() {
    return {};
  },
  computed: {
    ...mapState("account", ["userInfo"]),
    avatar() {
      return this.userInfo && this.userInfo.avatar ? this.userInfo.avatar : "";
    },
    nickname() {
      return this.userInfo && this.userInfo.nickname
        ? this.userInfo.nickname
        : "";
    }
  },
  methods: {
    ...mapMutations("account", ["SET_USER_INFO"]),
    handleUserInfoUpdate() {
      userApi.getUserInfo().then(res => {
        if (res.data.success) {
          this.SET_USER_INFO(res.data.model);
        }
      });
    }
  },
  components: {
    MyNav
  }
};
</script>

<style lang="scss" scoped>
.my-class {
  height: 100%;
  background: #f4f4f4;
}
</style>
