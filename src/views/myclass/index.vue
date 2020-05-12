<template>
  <div class="my-class">
    <my-nav :avatar="avatar" :nickname="nickname" />
    <router-view
      :avatar="avatar"
      :nickname="nickname"
      :tel="tel"
      :email="email"
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
      avatar: "",
      nickname: "",
      tel: "",
      email: ""
    };
  },
  created() {
    userApi.getUserInfo().then(res => {
      if (res.data.success) {
        const data = res.data.model;
        if (data.avatar) {
          this.avatar =
            "http://livebroadcasting.jinrui.kooboo.site" + data.avatar;
        }
        this.nickname = data.nickname;
        this.tel = data.tel;
        this.email = data.email;
      }
    });
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
