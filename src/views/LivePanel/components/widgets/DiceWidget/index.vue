<template>
  <widget-window
    @close="SET_DICE_VISIBLE(false)"
    nameWidget="骰子"
    :position="dice.position"
    v-if="dice.visible"
    @moved="UPDATE_POSITION({ name: 'dice', position: $event })"
  >
    <div class="contain">
      <div class="dice" ref="dice" @click="start">
        <div
          class="side"
          v-for="(group, key, index) in pointerList"
          :key="index"
          v-if="key === pointer"
        >
          <div class="pointer-group" v-for="group in pointerList[key]">
            <div class="pointer-wrapper" v-for="p in group">
              <div
                class="pointer"
                :style="{
                  'background-color': p.color && p.color,
                  height: p.size ? p.size + 'px' : '22px',
                  width: p.size ? p.size + 'px' : '22px',
                  'border-radius': p.size ? p.size / 2 + 'px' : '11px'
                }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </widget-window>
</template>
<script>
import WidgetWindow from "../WidgetWindow";
import { mapState, mapMutations, mapGetters } from "vuex";
import BezierAnimation from "../../../../../core/common/animation/animation";
var vm;
export default {
  name: "DiceWidget",
  components: {
    WidgetWindow
  },
  data() {
    vm = this;
    return {
      pointer: "1",
      pointerList: {},
      animation: undefined
    };
  },
  mounted() {
    this.initPointerList();
    this.pointer = this.dice.value + "";
  },

  computed: {
    ...mapState("widget", ["dice"]),
    ...mapState("device", ["isMobile"])
  },
  methods: {
    ...mapMutations("widget", [
      "UPDATE_POSITION",
      "SET_DICE_VALUE",
      "SET_DICE_VISIBLE",
      "SET_DICE_START"
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
          [{ name: "1", color: blue }, { name: "" }, { name: "2", color: blue }]
        ],
        3: [
          [{ name: "1", color: blue }, { name: "" }, { name: "" }],
          [{ name: "" }, { name: "2", color: blue }, { name: "" }],
          [{ name: "" }, { name: "" }, { name: "3", color: blue }]
        ],
        4: [
          [
            { name: "1", color: red },
            { name: "2", color: red }
          ],
          [
            { name: "3", color: red },
            { name: "4", color: red }
          ]
        ],
        5: [
          [
            { name: "1", color: blue },
            { name: "" },
            { name: "2", color: blue }
          ],
          [{ name: "" }, { name: "3", color: blue }, { name: "" }],
          [{ name: "4", color: blue }, { name: "" }, { name: "5", color: blue }]
        ],
        6: [
          [
            { name: "1", color: blue },
            { name: "" },
            { name: "2", color: blue }
          ],
          [
            { name: "3", color: blue },
            { name: "" },
            { name: "4", color: blue }
          ],
          [{ name: "5", color: blue }, { name: "" }, { name: "6", color: blue }]
        ]
      };
    },
    start() {
      let num = parseInt(1 + Math.random() * 6);
      this.SET_DICE_VALUE(num);

      this.SET_DICE_START(true);
      setTimeout(() => {
        this.SET_DICE_START(false);
      }, 2000);
    }
  },
  watch: {
    "dice.start": function() {
      this.animation = new BezierAnimation(2, "ease", (i1, i2) => {
        let num = parseInt(1 + Math.random() * 6);

        if (i2 >= 1) {
          num = this.dice.value;
        }
        this.pointer = num + "";
      });
      this.animation.play();
    }
  }
};
</script>
<style lang="scss" scoped>
.contain {
  width: 210px;
  height: 200px;
  background: #54555d;
  position: relative;
  box-sizing: border-box;
  display: flex;
}

.dice {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.side {
  width: 90px;
  height: 90px;
  padding: 5px;
  display: flex;
  background: #fff;
  border-radius: 10px;
  flex-direction: column;
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
  /*width: 16px;*/
  /*height: 16px;*/
  /*background-color: #c33;*/
}
.pointer-wrapper {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
}
</style>
