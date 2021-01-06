<template>
  <div class="chatroom-footer">
    <el-input
      type="textarea"
      v-model="message"
      :placeholder="$t('class.message.placeholder')"
      size="small"
      class="mr10"
      @keyup.enter.native="onSubmit"
    ></el-input>
    <div class="buttom-btn">
      <div class="forbidden-wrapper" @click="toggleForbiddenStatus">
        <el-tooltip
          effect="dark"
          :content="forbiddenTips"
          placement="top-end"
          v-if="isTeacher"
        >
          <icon
            name="comment-slash"
            size="16"
            color="#737882"
            @click.native="toggleForbiddenStatus"
            :class="{
              mr5: true,
              forbidden: !globalMessage,
            }"
          />
        </el-tooltip>
        {{ this.forbiddenTips }}
      </div>
      <el-button type="primary" size="small" @click="onSubmit">{{
        $t("button.send")
      }}</el-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from "vuex";

export default {
  name: "ChatroomFooter",
  data() {
    return {
      message: "",
    };
  },
  computed: {
    ...mapState("features", ["globalMessage", "selfMessage"]),
    ...mapGetters("workplace", ["isTeacher"]),
    forbiddenTips() {
      return !this.globalMessage
        ? this.$t("class.message.liftAllBans")
        : this.$t("class.message.openAllMute");
    },
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
    },
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
    },
  },
};
</script>

<style lang="scss" scoped>
.chatroom-footer {
  box-sizing: border-box;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  @include themeify {
    border-top: 1px solid themedOpacity("color_opposite", 0.1);
  }
  .forbidden {
    fill: #dcebeb !important;
  }
  .forbidden-wrapper {
    color: rgba(138, 138, 153, 1);
  }
  .buttom-btn {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: 10px;
  }
  /deep/ .el-textarea__inner {
    background-color: transparent;
    padding: 0;
    color: #8a8a99;
    font-size: 0.875rem;
    border: 0 none;
    min-height: 110px !important;
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
    height: 40px;
  }
}
</style>
