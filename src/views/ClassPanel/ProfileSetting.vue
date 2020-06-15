<template>
  <div class="setting-wrap">
    <el-page-header
      class="mb20"
      @back="toHomePage"
      :content="$t('setting.settingPage')"
    ></el-page-header>
    <el-tabs type="border-card" class="setting-tabs">
      <el-tab-pane :label="$t('setting.personInfoEdit')">
        <person-info-edit @update="update" :userInfo="userInfo" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import PersonInfoEdit from "./components/PersonInfoEdit";

export default {
  name: "ProfileSetting",
  props: {
    userInfo: Object
  },
  methods: {
    update(data) {
      this.$emit("update");
    },
    toHomePage() {
      this.$router.push({ name: "Home" });
    }
  },
  components: {
    PersonInfoEdit
  }
};
</script>

<style lang="scss" scoped>
.setting-wrap {
  width: 1205px;
  margin: 20px auto;
  @media screen and (max-width: 1200px) {
    width: auto;
  }
  .setting-tabs {
    /deep/ .el-tabs__item {
      height: 44px;
      line-height: 44px;
      font-size: 15px;
    }
    /deep/ .el-tabs__nav-wrap::after {
      background-color: transparent;
    }
  }
}
</style>
