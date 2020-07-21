<template>
  <div>
    <widget-window
      @close="SET_DRAW_VISIBLE(false)"
      nameWidget="幸运转盘"
      :position="draw.position"
      v-if="draw.visible"
      @moved="UPDATE_POSITION({ name: 'draw', position: $event })"
      :class="{ 'mobile-scale': isMobile }"
    >
      <div class="contain">
        <div class="content">
          <div class="line"></div>
          <ul ref="ul" :style="{ 'margin-top': styleData.transformX + 'px' }">
            <li v-for="(item, index) in draw.list" :key="index">
              <div class="stu_name">{{ item }}</div>
            </li>
          </ul>
        </div>
      </div>
      <div class="btnClick">
        <el-button
          v-if="isTeacher && !drawing"
          size="mini "
          type="primary"
          @click="start"
          class="btn"
          >开始</el-button
        >
      </div>
    </widget-window>
  </div>
</template>
<script>
import WidgetWindow from "../WidgetWindow";
import { mapState, mapMutations, mapGetters } from "vuex";

import BezierAnimation from "../../../../../core/common/animation/animation";

export default {
  name: "LuckDraw",
  data() {
    return {
      drawing: false,
      isanimate: false,
      animation: undefined,
      styleData: { transformX: 0 }
    };
  },
  mounted() {
    this.animation = new BezierAnimation(2, "ease", (i1, i2) => {
      this.styleData.transformX = i2 * -1 * (this.draw.list.length - 1) * 30;
    });
  },
  components: {
    WidgetWindow
  },
  computed: {
    ...mapState("widget", ["draw"]),
    ...mapState("device", ["isMobile"]),
    ...mapState("workplace", ["featuresList"]),
    ...mapGetters("workplace", ["isTeacher"])
  },
  methods: {
    ...mapMutations("widget", [
      "SET_DRAW_VISIBLE",
      "UPDATE_POSITION",
      "SET_DRAW_LIST",
      "STAR_DRAW"
    ]),
    start() {
      this.SET_DRAW_LIST(
        this.featuresList.map(m => m.__nickName || m.__primaryKey)
      );
      this.STAR_DRAW(true);
    }
  },
  watch: {
    "draw.visible"(value) {
      this.drawing = false;
      this.isanimate = false;
      if (this.isTeacher) {
        this.SET_DRAW_LIST(
          this.featuresList.map(m => m.__nickName || m.__primaryKey)
        );
      }
    },
    "draw.started"(value) {
      if (!value) return;
      this.$forceUpdate();
      this.isanimate = false;
      setTimeout(() => {
        this.animation.play();
      }, 100);
      this.drawing = true;
      setTimeout(() => {
        this.drawing = false;
        this.STAR_DRAW(false);
      }, 2500);
    }
  }
};
</script>
<style lang="scss" scoped>
.contain {
  width: 200px;
  height: 100px;
  background: #54555d;
  position: relative;
  box-sizing: border-box;
  padding-top: 36px;
  .content {
    height: 30px;
    font-weight: 500;
    background: #54555d;
    color: #000;
    position: relative;
    overflow: hidden;
    text-align: center;
    .line {
      width: 120px;
      left: 0;
      right: 0;
      position: absolute;
      height: 1px;
      top: 0;
      bottom: 0;
      margin: auto;
      opacity: 0.2;
      background: #000;
    }
    .stu_name {
      border-radius: 2px;
      background: #eee;
      text-align: center;
      overflow: hidden;
      width: 120px;
      height: 30px;
      display: inline-block;
    }
  }
}

ul {
  height: 30px;
  list-style: none;
  margin: 0;
  padding: 0;
  li {
    font-size: 20px;
    height: 30px;
    width: 100%;
  }
}

.btnClick {
  text-align: center;
  background: #54555d;
  padding-bottom: 10px;
  .el-button {
    background: #018a8c;
    width: 160px;
    padding-bottom: 5px;
    font-size: 14px;
  }
}
</style>
