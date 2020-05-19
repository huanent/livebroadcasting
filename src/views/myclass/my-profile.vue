<template>
  <div class="profile-wrap">
    <div class="profile-username">{{ nickname }}</div>
    <div class="profile-avatar">
      <el-popover
        trigger="hover"
        placement="bottom"
        :offset="-7"
        v-model="visible"
        popper-class="profile-popover"
      >
        <ul class="menu">
          <router-link :to="{ name: 'Setting' }" tag="li">{{
            $t("setting")
          }}</router-link>
          <li class="u-menu-bottom" @click="handleLogout">
            {{ $t("logout") }}
          </li>
        </ul>
        <img slot="reference" :src="avatarUrl" :alt="$t('class.avatar')" />
      </el-popover>
    </div>
  </div>
</template>

<script>
import avatarImg from "../../assets/images/avatar.jpg";
import { mapMutations } from "vuex";

export default {
  name: "MyProfile",
  props: {
    avatar: String,
    nickname: String
  },
  computed: {
    avatarUrl() {
      return this.avatar || avatarImg;
    }
  },
  data() {
    return {
      visible: false
    };
  },
  methods: {
    ...mapMutations("account", [
      "SET_LB_TOKEN",
      "SET_LB_EXPIRES",
      "SET_TX_USERID",
      "SET_USER_INFO"
    ]),
    handleLogout() {
      this.SET_LB_TOKEN("");
      this.SET_LB_EXPIRES("");
      this.SET_TX_USERID("");
      this.SET_USER_INFO(null);
      this.$router.push({ name: "Login" });
    }
  }
};
</script>

<style lang="scss" scoped>
.profile-wrap {
  display: flex;
  line-height: 60px;
  align-items: center;
  position: relative;
  cursor: pointer;
  .profile-username {
    margin-right: 17px;
    min-width: 40px;
    max-width: 102px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
    // box-sizing: border-box;
    &:hover {
      color: #6dbcc2;
      // color: #10ae58;
    }
  }
  .profile-avatar {
    color: #999;
    text-align: right;
    margin-left: 4px;
    width: 32px;
    height: 32px;
    line-height: 30px;
    box-sizing: border-box;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
}
</style>
