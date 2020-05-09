<template>
  <div class="profile-wrap">
    <div class="profile-username">ykt22537555661078570</div>

    <div class="profile-avatar">
      <el-popover
        trigger="hover"
        placement="bottom-end"
        v-model="visible"
        popper-class="profile-popover"
        :offset="-7"
      >
        <ul class="menu">
          <router-link :to="{ name: 'Setting' }" tag="li">设置</router-link>
          <router-link :to="{ name: 'Login' }" tag="li" class="u-menu-bottom"
            >退出</router-link
          >
        </ul>
        <img
          slot="reference"
          src="//s.stu.126.net/res/images/headImg/small.jpg"
        />
      </el-popover>
    </div>
  </div>
</template>

<script>
export default {
  name: "MyProfile",
  data() {
    return {
      visible: false
    };
  }
};
</script>

<style lang="scss" scoped>
.profile-wrap {
  position: relative;
  cursor: pointer;
  .profile-username {
    padding-right: 15px;
    max-width: 102px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .profile-avatar {
    position: absolute;
    top: 22%;
    right: -20%;
    color: #999;
    text-align: right;
    margin: 0 0 0 4px;
    width: 32px;
    height: 32px;
    line-height: 30px;
    // border: 1px solid red;
    box-sizing: border-box;
    border-radius: 50%;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
}
</style>
