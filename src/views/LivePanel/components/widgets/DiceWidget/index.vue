<template>
  <widget-window
    @close="SET_DICE_VISIBLE(false)"
    nameWidget="骰子"
    :position="dice.position"
    v-if="dice.visible"
    @moved="UPDATE_POSITION({ name: 'dice', position: $event })"
  >
    <div class="contain">
      <div
        class="dice"
        :class="animationClass"
        ref="dice"
        @click="isTeacher && start()"
      >
        <div
          v-for="(group, key, index) in pointerList"
          class="side"
          :class="'side-' + (index + 1)"
          :key="index"
        >
          <div class="pointer-group" v-for="group in pointerList[key]">
            <div class="pointer-wrapper" v-for="p in group">
              <div
                class="pointer"
                :style="{
                  'background-color': p.color && p.color,
                  height: p.size ? p.size + 'px' : '15px',
                  width: p.size ? p.size + 'px' : '15px',
                  'border-radius': p.size ? p.size / 2 + 'px' : '50%',
                }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="beginBtn" v-if="isTeacher">
      <el-button size="mini" type="primary" @click="start">开始</el-button>
    </div>
  </widget-window>
</template>
<script>
import WidgetWindow from "../WidgetWindow";
import { mapState, mapMutations, mapGetters } from "vuex";
import BezierAnimation from "../../../../../core/common/animation/animation";
import { ROLE } from "../../../../../models/role";
var vm;
export default {
  name: "DiceWidget",
  components: {
    WidgetWindow,
  },
  data() {
    vm = this;
    return {
      pointerList: {},
      animationClass: "",
    };
  },
  mounted() {
    this.initPointerList();
  },

  computed: {
    ...mapState("widget", ["dice"]),
    ...mapState("device", ["isMobile"]),
    ...mapGetters("workplace", ["isTeacher"]),
  },
  methods: {
    ...mapMutations("widget", [
      "UPDATE_POSITION",
      "SET_DICE_VALUE",
      "SET_DICE_VISIBLE",
      "SET_DICE_START",
    ]),
    getSize(p) {
      if (p.size) return p.size + "rpx";
      return "";
    },
    initPointerList() {
      let red = "#b10501";
      let blue = "#1021b7";
      this.pointerList = {
        1: [[{ name: "" }, { name: "1", color: red, size: 27 }, { name: "" }]],
        2: [
          [
            { name: "1", color: blue },
            { name: "" },
            { name: "2", color: blue },
          ],
        ],
        3: [
          [{ name: "1", color: blue }, { name: "" }, { name: "" }],
          [{ name: "" }, { name: "2", color: blue }, { name: "" }],
          [{ name: "" }, { name: "" }, { name: "3", color: blue }],
        ],
        4: [
          [
            { name: "1", color: red },
            { name: "2", color: red },
          ],
          [
            { name: "3", color: red },
            { name: "4", color: red },
          ],
        ],
        5: [
          [
            { name: "1", color: blue },
            { name: "" },
            { name: "2", color: blue },
          ],
          [{ name: "" }, { name: "3", color: blue }, { name: "" }],
          [
            { name: "4", color: blue },
            { name: "" },
            { name: "5", color: blue },
          ],
        ],
        6: [
          [
            { name: "1", color: blue },
            { name: "" },
            { name: "2", color: blue },
          ],
          [
            { name: "3", color: blue },
            { name: "" },
            { name: "4", color: blue },
          ],
          [
            { name: "5", color: blue },
            { name: "" },
            { name: "6", color: blue },
          ],
        ],
      };
    },
    start() {
      if (this.dice.start) return;
      let num = parseInt(1 + Math.random() * 6);
      this.SET_DICE_VALUE(num);

      this.SET_DICE_START(true);
      setTimeout(() => {
        this.SET_DICE_START(false);
      }, 2000);
    },
  },
  watch: {
    "dice.start": function (value) {
      if (value) {
        this.animationClass = "pointer-" + this.dice.value + " animation";
      } else {
        this.animationClass = "pointer-" + this.dice.value;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.contain {
  width: 210px;
  height: 160px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: -24px auto 0;
}
.dice {
  height: 80px;
  width: 80px;
  /**/

  /*left: 50%;*/
  /*top: 50%;*/
  transform-style: preserve-3d;
  position: relative;
  transform-origin: 50% 50% 100%;
  animation-duration: 0s;
  animation-fill-mode: forwards;
}

.side {
  height: 80px;
  width: 80px;
  display: flex;
  background: #fff;
  border-radius: 10px;
  border: 1px solid #e0e0e0;
  box-shadow: inset 0 0 10px #ccc;
  flex-direction: column;
  position: absolute;
  left: 0;
  top: 0;
  padding: 13px;
}
.pointer-group {
  display: flex;
  flex: 1;
  justify-content: space-around;
  flex-direction: row;
  align-items: center;
}
.pointer {
  text-align: center;
}
.pointer-wrapper {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
}

.side-1 {
  transform: rotateX(90deg) translateZ(40px);
}

.side-2 {
  transform: translateZ(40px);
}

.side-5 {
  transform: rotateY(90deg) translateZ(40px);
}

.side-4 {
  transform: rotateY(180deg) translateZ(40px);
}

.side-3 {
  transform: rotateY(-90deg) translateZ(40px);
}

.side-6 {
  transform: rotateX(-90deg) translateZ(40px);
}

@keyframes move1 {
  0% {
    transform: rotateY(45deg) rotateX(-45deg) rotateZ(45deg);
  }

  100% {
    transform: rotateY(1800deg) rotateX(-90deg);
  }
}
@keyframes move2 {
  0% {
    transform: rotateY(45deg) rotateX(-45deg) rotateZ(45deg);
  }
  100% {
    transform: rotateY(1800deg);
  }
}

@keyframes move3 {
  0% {
    transform: rotateY(45deg) rotateX(-45deg) rotateZ(45deg);
  }

  100% {
    transform: rotateY(1890deg);
  }
}

@keyframes move4 {
  0% {
    transform: rotateY(45deg) rotateX(-45deg) rotateZ(45deg);
  }

  100% {
    transform: rotateY(1800deg) rotateX(-180deg);
  }
}

@keyframes move5 {
  0% {
    transform: rotateY(45deg) rotateX(-45deg) rotateZ(45deg);
  }

  100% {
    transform: rotateY(1710deg);
  }
}

@keyframes move6 {
  0% {
    transform: rotateY(45deg) rotateX(-45deg) rotateZ(45deg);
  }

  100% {
    transform: rotateY(1800deg) rotateX(90deg);
  }
}
.pointer-1 {
  animation-name: move1;
}
.pointer-2 {
  animation-name: move2;
}
.pointer-3 {
  animation-name: move3;
}
.pointer-4 {
  animation-name: move4;
}
.pointer-5 {
  animation-name: move5;
}
.pointer-6 {
  animation-name: move6;
}
.animation {
  animation-duration: 2s;
  animation-timing-function: ease-in-out;
}
</style>
