<template>
  <widget-window
    @close="SET_DICE_VISIBLE(false)"
    nameWidget="骰子"
    :position="dice.position"
    v-if="dice.visible"
    @moved="UPDATE_POSITION({ name: 'dice', position: $event })"
    :class="{ 'mobile-scale': isMobile }"
  >
    <transition>
      <div class="dice">
        <div id="content" ref="dice" @click="start" :class="point">
          <!-- 第一个筛子 -->
          <div>
            <span></span>
          </div>

          <!-- 第二个筛子 -->
          <div>
            <span></span>
            <span></span>
          </div>

          <!-- 第三个筛子 -->
          <div>
            <span></span>
            <span></span>
            <span></span>
          </div>

          <!-- 第四个 -->

          <div>
            <div>
              <span></span>
              <span></span>
            </div>
            <div>
              <span></span>
              <span></span>
            </div>
          </div>
          <!-- 第五个 -->
          <div>
            <div>
              <span></span>
              <span></span>
            </div>
            <div>
              <span></span>
            </div>
            <div>
              <span></span>
              <span></span>
            </div>
          </div>

          <!-- 第六个-->
          <div>
            <div>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </widget-window>
</template>
<script>
import WidgetWindow from "../widget-window";
import { mapState, mapMutations, mapGetters } from "vuex";
export default {
  components: {
    WidgetWindow
  },
  data() {
    return {
      point: ""
    };
  },
  computed: {
    ...mapState("widget", ["dice"]),
    ...mapState("device", ["isMobile"])
  },
  methods: {
    ...mapMutations("widget", [
      "UPDATE_POSITION",
      "SET_DICE_VALUE",
      "SET_DICE_VISIBLE"
    ]),
    start() {
      let num = parseInt(1 + Math.random() * 6);
      this.SET_DICE_VALUE(num);
    }
  },
  watch: {
    "dice.value"(value) {
      this.point == "";
      this.$nextTick(() => {
        if (value == 1) this.point = "pointone";
        else if (value == 2) this.point = "pointtwo";
        else if (value == 3) this.point = "pointthree";
        else if (value == 4) this.point = "pointfour";
        else if (value == 5) this.point = "pointfive";
        else if (value == 6) this.point = "pointsix";
        else this.point = "";
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.dice {
  width: 210px;
  height: 200px;
  background: #54555d;
  padding-left: 36px;
  box-sizing: border-box;
  padding-top: 28px;
  #content {
    width: 134px;
    height: 134px;
    transform-style: preserve-3d;
    transform: rotateY(30deg) rotateX(-20deg);
  }

  #content > div {
    width: 100px;
    height: 100px;
    padding: 15px;
    display: flex;
    background: #fff;
    border-radius: 15px;
    position: absolute;
    /* box-shadow: 2px 1px 5px #333; */
    border: 2px solid #eee;
  }

  #content span {
    width: 25px;
    height: 25px;
    display: block;
    border-radius: 50%;
    background: #c33;
  }

  /* 1 */
  #content > div:nth-child(1) {
    justify-content: center;
    align-items: center;
    transform: translateZ(65px);
  }

  /* 2 */
  #content > div:nth-child(2) {
    justify-content: space-between;
    align-items: center;
    transform: translateZ(-65px);
  }

  /* 3 */
  #content > div:nth-child(3) {
    justify-content: space-between;
    transform: rotateX(90deg) translateZ(65px);
  }

  #content > div:nth-child(3) span:nth-child(2) {
    align-self: center;
  }

  #content > div:nth-child(3) span:nth-child(3) {
    align-self: flex-end;
  }

  /* 4 */
  #content > div:nth-child(4) {
    transform: rotateX(90deg) translateZ(-65px);
    justify-content: space-between;
  }

  #content > div:nth-child(4) div {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  /* 5 */
  #content > div:nth-child(5) {
    transform: rotateY(90deg) translateZ(65px);
    justify-content: space-between;
  }

  #content > div:nth-child(5) div {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  #content > div:nth-child(5) div:nth-child(2) {
    justify-content: center;
  }

  /* 6 */
  #content > div:nth-child(6) {
    transform: rotateY(90deg) translateZ(-65px);
    justify-content: space-between;
  }

  #content > div:nth-child(6) div {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
}

@keyframes move1 {
  0% {
    transform: rotateY(30deg) rotateX(-20deg);
  }

  100% {
    transform: rotateY(3600deg) rotateX(3600deg);
  }
}

@keyframes move2 {
  0% {
    transform: rotateY(30deg) rotateX(-20deg);
  }

  100% {
    transform: rotateY(3510deg) rotateX(3600deg);
  }
}

@keyframes move3 {
  0% {
    transform: rotateY(30deg) rotateX(-20deg);
  }

  100% {
    transform: rotateY(3690deg) rotateX(3600deg);
  }
}

@keyframes move4 {
  0% {
    transform: rotateY(30deg) rotateX(-20deg);
  }

  100% {
    transform: rotateY(3780deg) rotateX(3600deg);
  }
}

@keyframes move5 {
  0% {
    transform: rotateY(30deg) rotateX(-20deg);
  }

  100% {
    transform: rotateY(3600deg) rotateX(3690deg);
  }
}

@keyframes move6 {
  0% {
    transform: rotateY(30deg) rotateX(-20deg);
  }

  100% {
    transform: rotateY(3600deg) rotateX(3510deg);
  }
}
.pointone {
  animation: move1 2s ease-in-out forwards;
}
.pointtwo {
  animation: move4 2s ease-in-out forwards;
}
.pointthree {
  animation: move6 2s ease-in-out forwards;
}
.pointfour {
  animation: move5 2s ease-in-out forwards;
}
.pointfive {
  animation: move2 2s ease-in-out forwards;
}
.pointsix {
  animation: move3 2s ease-in-out forwards;
}
</style>
