<template>
  <div class="content" ref="rushController">
    <div class="contain" ref="header">
      <div class="leftarea">
        <div
          class="leftcircle"
          id="sa"
          :class="{ addLeftAnimation: leftAnimation }"
        ></div>
      </div>
      <div class="rightarea">
        <div
          class="rightcircle"
          id="ss"
          :class="{ addRightAnimation: rightAnimation }"
        ></div>
      </div>
      <div class="backyi"></div>
      <div class="backer"></div>
      <div class="backsan">
        <span class="beginRushAnswer" @click="start">{{
          infoText | ellipsis
        }}</span>
        <restart-button v-if="showRestart" @click="start"></restart-button>
        <div class="closebtn" @click="SET_RUSH_VISIBLE(false)">关闭</div>
      </div>
    </div>
  </div>
</template>
<script>
import RestartButton from "./RestartButton";
import { mapState, mapMutations } from "vuex";
import { delay } from "../../../../../core/utils";
export default {
  name: "Controller",
  mounted() {
    let rect = this.$refs.rushController.getBoundingClientRect();
    this.$refs.rushController.style.left =
      (document.body.clientWidth - rect.width) / 2 + "px";
    this.$refs.rushController.style.top =
      (document.body.clientHeight - rect.height) / 2 + "px";
  },
  data() {
    return {
      leftAnimation: false,
      rightAnimation: false,
      showRestart: false,
      infoText: "开始抢答"
    };
  },
  computed: {
    ...mapState("widget", ["rush"])
  },
  components: {
    RestartButton
  },
  filters: {
    ellipsis: function(value) {
      if (!value) return "";
      if (value.length > 6) {
        return value.substr(0, 6) + "..";
      } else {
        return value;
      }
    }
  },
  methods: {
    ...mapMutations("widget", [
      "SET_RUSH_VISIBLE",
      "SET_RUSH_STATUS",
      "SET_RUSH_NAME"
    ]),
    async start() {
      this.showRestart = false;
      this.infoText = "抢答中";
      this.SET_RUSH_NAME('');
      this.SET_RUSH_STATUS("rushing");
      setTimeout(() => {
        this.SET_RUSH_STATUS("rushable")
      },3000);

      await this.startAnimation();

      this.showRestart = true;
      if (!this.rush.name) {
        this.infoText = "无人抢答";
      } else {
        this.infoText = this.rush.name;
      }
      this.SET_RUSH_NAME(this.infoText);
    },
    async startAnimation() {
      this.rightAnimation = true;
      await new Promise(res => {
        document.addEventListener("animationend", e => {
          if (e.animationName.startsWith("circle_right")) {
            this.leftAnimation = true;
            res();
          }
        });
      });
      await new Promise(res => {
        document.addEventListener("animationend", e => {
          if (e.animationName.startsWith("left_right")) {
            res();
          }
        });
      });
      this.leftAnimation = false;
      this.rightAnimation = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.content {
  z-index: 1000;
  position: fixed;
  left: 0;
  top: 0;
  .contain {
    position: relative;
    width: 184px;
    height: 184px;
    box-sizing: border-box;
    background-color: #3f424b;
    padding: 2px;
    display: flex;
    border-radius: 50%;
    .leftarea {
      width: 90px;
      height: 180px;
      overflow: hidden;
      .leftcircle {
        box-sizing: border-box;
        width: 180px;
        height: 180px;
        border-radius: 50%;
        border: 4px solid transparent;
        border-left: 4px solid #0a818c;
        border-top: 4px solid #0a818c;
        transform: rotate(-45deg);
        /* 旋转45度 */
      }
    }
    .rightarea {
      width: 90px;
      height: 180px;
      overflow: hidden;
      .rightcircle {
        box-sizing: border-box;
        width: 180px;
        height: 180px;
        border-radius: 50%;
        border: 4px solid transparent;
        border-right: 4px solid #0a818c;
        border-bottom: 4px solid #0a818c;
        float: right;
        transform: rotate(-45deg);
      }
    }

    .backyi {
      width: 160px;
      height: 160px;
      background-color: #2d3037;
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      border-radius: 50%;
      /* box-shadow: 2px 2px 1px #888888; */
      z-index: 90;
    }

    .backer {
      width: 150px;
      height: 150px;
      background-color: #3f424b;
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      border-radius: 50%;
      /* box-shadow: 2px 2px 1px #888888; */
      z-index: 90;
    }

    .backsan {
      overflow: hidden;
      width: 140px;
      height: 140px;
      background-color: #34373e;
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      border-radius: 50%;
      z-index: 90;
      text-align: center;
      color: rgb(219, 213, 213);
      font-size: 20px;
    }
  }
}

.addRightAnimation {
  animation: circle_right 3s linear 0s 1 forwards;
}

@keyframes circle_right {
  0% {
    transform: rotate(-45deg);
  }

  100% {
    transform: rotate(135deg);
  }
}

.addLeftAnimation {
  animation: left_right 3s linear 0s 1 forwards;
}

@keyframes left_right {
  0% {
    transform: rotate(-45deg);
  }

  100% {
    transform: rotate(135deg);
  }
}

.beginRushAnswer {
  height: 140px;
  line-height: 140px;
  text-shadow: 2px 5px 8px #fff;
  cursor: pointer;
  &:hover {
    box-shadow: 0px 0px 1 rgb(78, 67, 67);
  }
}
.closebtn {
  position: absolute;
  bottom: 0px;
  width: 140px;
  text-align: center;
  color: #fff;
  height: 24px;
  background: #2a6469;
  font-size: 14px;

  &:hover {
    background: #0f9ca9;
  }
}
</style>
