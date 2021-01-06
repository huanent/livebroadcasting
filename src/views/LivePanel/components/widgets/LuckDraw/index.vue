<template>
  <div>
    <widget-window
      class="luck-window"
      @close="SET_DRAW_VISIBLE(false)"
      nameWidget="幸运大转盘"
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
      animating: false,
    };
  },
  components: {
    WidgetWindow,
  },
  computed: {
    ...mapState("widget", ["draw"]),
    ...mapState("device", ["isMobile"]),
    ...mapState("workplace", ["featuresList"]),
    ...mapGetters("workplace", ["isTeacher"]),
  },
  methods: {
    ...mapMutations("widget", [
      "SET_DRAW_VISIBLE",
      "UPDATE_POSITION",
      "SET_DRAW_LIST",
      "STAR_DRAW",
    ]),
    start() {
      this.animating = false;

      if (this.isTeacher) {
        this.SET_DRAW_LIST(
          this.featuresList.map((m) => m.__nickName || m.__primaryKey)
        );
      }
      this.STAR_DRAW(true);
      setTimeout(() => {
        this.animating = true;
      }, 100);
    },
  },
  watch: {
    "draw.visible"(value) {
      this.drawing = false;
      if (!value) {
        this.animating = false;
      }
      if (this.isTeacher) {
        this.SET_DRAW_LIST(
          this.featuresList.map((m) => m.__nickName || m.__primaryKey)
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
    },
  },
};
</script>
<style lang="scss" scoped>
.luck-window {
  width: 300px;
}
.content {
  width: 250px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  border-radius: 4px;
  overflow: hidden;
}
.line {
  &:before,
  &:after {
    content: '';
    widows: 100%;
    left: 0;
    right: 0;
    position: absolute;
    opacity: 0.4;
    background: #000;
    height: 80px;
    margin: auto;
  }
  &:before {
    top: 0;
  }
  &:after {
    bottom: 0;
  }
}
.stu_name {
  font-weight: 400;
  color: #ffffff;
  background: #506efa;
  text-align: center;
  overflow: hidden;
  height: 40px;
  display: block;
}

.luck-item-wrapper {
  height: 200px;
  position: relative;
  overflow: hidden;
  text-align: center;
  width: 100%;
}
.luck-item-wrapper ul {
  list-style: none;
  margin-top: 0;
}
.luck-item-wrapper li {
  font-size: 0.875rem;
  font-weight: 400;
  color: #ffffff;
  height: 40px;
  line-height: 40px;
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
    margin-top: -600px;
  }
}
</style>
