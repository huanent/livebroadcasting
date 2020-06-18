<template>
  <el-popover placement="left" popper-class="m-control-popover" trigger="hover">
    <div class="icon-group">
      <icon
        name="import_contacts"
        :size="20"
        @click.native="showFilesModal"
      ></icon>
      <icon name="monitor" :size="16" @click.native="TOGGLE_SIDEBAR"></icon>
      <icon name="exit_to_app" :size="20" @click.native="quitLiveRoom"></icon>
    </div>
    <files-modal ref="files-modal" />
    <icon name="settings" size="30" color="#fff" slot="reference"></icon>
  </el-popover>
</template>
<script>
import { mapMutations } from "vuex";
import FilesModal from "./FilesModal";

export default {
  name: "SettingPanel.",
  methods: {
    ...mapMutations("mobile", ["TOGGLE_SIDEBAR"]),
    quitLiveRoom() {
      this.$router.push({ name: "Classlist" });
    },
    showFilesModal() {
      this.$refs["files-modal"].show();
    }
  },
  components: {
    FilesModal
  }
};
</script>
<style lang="scss" scoped>
.icon-group {
  display: flex;
  align-items: center;
  svg {
    margin: 0 0.6rem;
    @include themeify {
      fill: themed("font_color2");
    }
    &:hover {
      @include themeify {
        fill: themed("font_color1");
      }
    }
  }
}
</style>
