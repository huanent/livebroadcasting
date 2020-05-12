<template>
  <div class="my-class">
    <my-nav :avatar="userInfo.avatar" :nickname="userInfo.nickname" />
    <router-view
      @update="handleUserInfoUpdate"
      :userInfo="userInfo"
    ></router-view>
  </div>
</template>

<script>
import MyNav from "./my-nav";
import userApi from "@api/user";

export default {
  name: "MyClass",
  data() {
    return {
      userInfo: {
        avatar: "",
        nickname: "",
        tel: "",
        email: ""
      }
    };
  },
  created() {
    userApi.getUserInfo().then(res => {
      if (res.data.success) {
        const data = res.data.model;
        if (data.avatar) {
          this.userInfo.avatar =
            "http://livebroadcasting.jinrui.kooboo.site" + data.avatar;
        }
        this.userInfo.nickname = data.nickname;
        this.userInfo.tel = data.tel;
        this.userInfo.email = data.email;
      }
    });
  },
  methods: {
    handleUserInfoUpdate(data) {
      this.userInfo.avatar =
        "http://livebroadcasting.jinrui.kooboo.site" + data.avatar;
      this.userInfo.email = data.email;
      this.userInfo.tel = data.email;
      this.userInfo.nickname = data.nickname;
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
