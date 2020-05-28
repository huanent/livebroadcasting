<template>
  <div class="chatroom-footer">
    <el-tooltip
      effect="dark"
      :content="forbiddenTips"
      placement="top-end"
      v-if="role === ROLE.TEACHER"
    >
      <icon
        name="comment-slash"
        size="34"
        color="#737882"
        @click.native="toggleForbiddenStatus"
        :class="{
          mr10: true,
          forbidden: noTalking
        }"
      />
    </el-tooltip>
    <el-input
      v-model="message"
      :placeholder="$t('class.message.placeholder')"
      size="small"
      class="mr10"
      @keyup.enter.native="onSubmit"
    ></el-input>
    <el-button type="primary" size="small" @click="onSubmit">{{
      $t("button.send")
    }}</el-button>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { ROLE } from "@/models/role";

export default {
  name: "ChatroomFooter",
  data() {
    return {
      message: ""
    };
  },
  computed: {
    ...mapState("account", ["role"]),
    ...mapState("features", ["noTalking"]),
    forbiddenTips() {
      return this.noTalking
        ? this.$t("class.message.liftAllBans")
        : this.$t("class.message.openAllMute");
    }
  },
  methods: {
    ...mapMutations("features", ["SET_NO_TALKING"]),
    toggleForbiddenStatus() {
      this.SET_NO_TALKING(!this.noTalking);
    },
    onSubmit() {
      if (this.message.trim().length === 0) return;
      if (this.role === ROLE.STUDENT && this.noTalking) {
        this.$message.error(this.$t("class.message.muteTips"));
        return;
      }
      this.$emit("send", this.message);
      this.message = "";
    }
  },
  watch: {
    noTalking(val) {
      const isTeacher = this.role === ROLE.TEACHER;
      const openTips = isTeacher
        ? this.$t("class.message.muteAll")
        : this.$t("class.message.openAllMuteByTeacher");
      const closeTips = isTeacher
        ? this.$t("class.message.liftAllBans")
        : this.$t("class.message.liftAllBansByTeacher");
      if (val) {
        this.$message(openTips);
      } else {
        this.$message(closeTips);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.chatroom-footer {
  box-sizing: border-box;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  padding: 0 15px;
  height: 60px;
  @include themeify {
    border-top: 1px solid themedOpacity("color_opposite", 0.1);
  }
  .forbidden {
    fill: #dcebeb !important;
    // @include themeify {
    //   fill: themed("font_color2");
    // }
  }

  /deep/ .el-input__inner {
    @include themeify {
      border-color: themedOpacity("color_opposite", 0.1);
      background: themedOpacity("color_like", 0.1);
      color: themedOpacity("color_opposite", 0.9);
    }
  }
}
</style>
