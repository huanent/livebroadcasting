<template>
  <div class="chatroom-footer">
    <el-tooltip
      effect="dark"
      :content="forbiddenTips"
      placement="top-end"
      v-if="isTeacher"
    >
      <icon
        name="comment-slash"
        size="34"
        color="#737882"
        @click.native="toggleForbiddenStatus"
        :class="{
          mr10: true,
          forbidden: !globalMessage
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
import { mapState, mapMutations, mapGetters } from "vuex";

export default {
  name: "ChatroomFooter",
  data() {
    return {
      message: ""
    };
  },
  computed: {
    ...mapState("features", ["globalMessage", "selfMessage"]),
    ...mapGetters("workplace", ["isTeacher"]),
    forbiddenTips() {
      return !this.globalMessage
        ? this.$t("class.message.liftAllBans")
        : this.$t("class.message.openAllMute");
    }
  },
  methods: {
    ...mapMutations("features", ["SET_GLOBAL_MESSAGE"]),
    toggleForbiddenStatus() {
      this.SET_GLOBAL_MESSAGE(!this.globalMessage);
    },
    onSubmit() {
      if (this.message.trim().length === 0) return;
      if (!this.isTeacher && !this.globalMessage) {
        this.$message.error(this.$t("class.message.muteTips"));
        return;
      }
      if (!this.isTeacher && !this.selfMessage) {
        this.$message.error(this.$t("class.message.selfMuteTips"));
        return;
      }
      this.$emit("send", this.message);
      this.message = "";
    }
  },
  watch: {
    globalMessage(val) {
      const openTips = this.isTeacher
        ? this.$t("class.message.muteAll")
        : this.$t("class.message.openAllMuteByTeacher");
      const closeTips = this.isTeacher
        ? this.$t("class.message.liftAllBans")
        : this.$t("class.message.liftAllBansByTeacher");
      if (!val) {
        this.$message(openTips);
      } else {
        this.$message(closeTips);
      }
    },
    selfMessage(val) {
      if (val) {
        this.$message(this.$t("class.message.selfUnmete"));
      } else {
        this.$message(this.$t("class.message.selfMute"));
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
  }

  /deep/ .el-input__inner {
    @include themeify {
      border-color: themedOpacity("color_opposite", 0.1);
      background: themedOpacity("color_like", 0.1);
      color: themedOpacity("color_opposite", 0.9);
    }
  }

  /deep/ .el-button--primary {
    min-width: 72px;
  }
}
</style>
