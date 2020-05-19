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
          <router-link :to="{ name: 'Setting' }" tag="li">设置</router-link>
          <router-link :to="{ name: 'Login' }" tag="li" class="u-menu-bottom"
            >退出</router-link
          >
        </ul>
        <img
          v-if="avatar"
          slot="reference"
          :src="'http://livebroadcasting.jinrui.kooboo.site' + avatar"
        />
        <img v-else slot="reference" src="../../assets/images/avatar.jpg" />
      </el-popover>
    </div>
  </div>
</template>

<script>
export default {
  name: "MyProfile",
  props: {
    avatar: String,
    nickname: String
  },
  data() {
    return {
      visible: false
    };
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
