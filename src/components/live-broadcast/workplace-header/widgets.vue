<template>
  <div class="widgets">
    <el-dialog
      title="应用中心"
      :visible.sync="widgetVisible"
      :append-to-body="true"
    >
      <ul class="widgets-content">
        <li>
          <a
            @click="
              SET_TIMER_VISIBLE(true);
              widgetVisible = false;
            "
            >定时器</a
          >
        </li>
        <li>
          <a
            @click="
              SET_DICE_VISIBLE(true);
              widgetVisible = false;
            "
            >骰子</a
          >
        </li>
        <li>
          <a
            @click="
              SET_DRAW_VISIBLE(true);
              widgetVisible = false;
            "
            >幸运转盘</a
          >
        </li>
        <li>
          <a
            @click="
              SET_CLICKER_VISIBLE(true);
              widgetVisible = false;
            "
            >随堂测试</a
          >
        </li>
        <li>
          <a
            @click="
              SET_RUSH_VISIBLE(true);
              widgetVisible = false;
            "
            >抢答器</a
          >
        </li>
      </ul>
    </el-dialog>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  name: "Widgets",
  props: {
    visible: Boolean
  },
  methods: {
    ...mapMutations("widget", [
      "SET_TIMER_VISIBLE",
      "SET_DICE_VISIBLE",
      "SET_DRAW_VISIBLE",
      "SET_CLICKER_VISIBLE",
      "SET_RUSH_VISIBLE"
    ]),
    closeWidgets() {
      this.$emit("update:visible", false);
    }
  },
  computed: {
    widgetVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit("update:visible", val);
      }
    }
  }
};
</script>
<style scoped lang="scss">
.widgets-content {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  li {
    flex: 20% 0 0;
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    a {
      width: 80px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: green;
      color: #fff;
      border-radius: 50%;
      cursor: pointer;
    }
  }
}
</style>
