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
      <div class="dice">
        <div class="content">
          <div class="luck-item-wrapper">
            <ul id="luck-items" :class="{ animating: animating }">
              <li v-for="(item, index) in draw.list" :key="index">
                <div class="stu_name">{{ item }}</div>
              </li>
            </ul>
            <div class="line"></div>
          </div>
        </div>
        <div class="beginBtn">
          <el-button
            v-if="isTeacher && !drawing"
            size="mini "
            type="primary"
            @click="start"
            class="btn"
            >开始</el-button
          >
        </div>
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
      animating: false
    };
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
      this.animating = false;

      if (this.isTeacher) {
        this.SET_DRAW_LIST(
          this.featuresList.map(m => m.__nickName || m.__primaryKey)
        );
      }
      this.STAR_DRAW(true);
      setTimeout(() => {
        this.animating = true;
      }, 100);
    }
  },
  watch: {
    "draw.visible"(value) {
      this.drawing = false;
      if (!value) {
        this.animating = false;
      }
      if (this.isTeacher) {
        this.SET_DRAW_LIST(
          this.featuresList.map(m => m.__nickName || m.__primaryKey)
        );
      }
    },
    "draw.started"(value) {
      if (!value) return;

      this.$forceUpdate();
      this.start();
      this.drawing = true;
      setTimeout(() => {
        this.drawing = false;
        this.STAR_DRAW(false);
      }, 2000);
    }
  }
};
</script>
<style lang="scss" scoped>
.content {
  width: 200px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}
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
  font-weight: 500;
  color: #000;
  border-radius: 2px;
  background: #eee;
  text-align: center;
  overflow: hidden;
  width: 120px;
  height: 30px;
  display: inline-block;
}

.luck-item-wrapper {
  height: 30px;
  position: relative;
  overflow: hidden;
  text-align: center;
}
.luck-item-wrapper ul {
  list-style: none;
  margin-top: 0;
}
.luck-item-wrapper li {
  font-size: 20px;
  height: 30px;
  width: 100%;
}
.animating {
  animation: rotate 2s normal ease-in-out forwards;
}

@keyframes rotate {
  0% {
    margin-top: 0;
  }
  100% {
    margin-top: -570px;
  }
}
</style>
