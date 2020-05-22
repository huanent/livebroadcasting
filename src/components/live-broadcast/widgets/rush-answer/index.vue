<template>
  <div class="content" :style="{ top: top + 'px', left: left + 'px' }">
    <div
      class="contain"
      :draggable="true"
      @dragstart="dragstart"
      @drag="drag"
      ref="header"
      @dragend="dragend"
    >
      <div class="leftarea">
        <div class="leftcircle" id="sa" :class="{addLeftAnimation:isleftAnimation}"></div>
      </div>
      <div class="rightarea">
        <div class="rightcircle" id="ss" :class="{addRightAnimation:isrightAnimation}"></div>
      </div>
      <div class="backyi"></div>
      <div class="backer"></div>
      <div class="backsan">
        <!-- 开始抢答 -->
        <span class="beginRushAnswer" @click="beginRush" v-if="beginTextVis">开始抢答</span>
        <!-- 抢答中 -->
        <div v-else class="continueRushAnswer">
          <span>抢答中</span>
          <div>
            <span>0</span>
            <span style=" color:#fff">/0</span>
          </div>
        </div>
        <!-- 无人抢答 -->
        <div class="continueRushAnswer withoutRushPeroson">
          <span>无人抢答</span>
        </div>

        <!-- 重新开始，关闭按钮 -->
        <div class="oncebegin">
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
            <ellipse cx="70" cy="40" rx="70" ry="40" class="hover" style="fill:#077b76" />
            <text x="43" y="17" fill="white" class="begin">重新开始</text>
          </svg>
        </div>
        <div class="closebtn">关闭</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "App",
  data() {
    return {
      top: 0,
      left: 0,
      topOffset: 0,
      leftOffset: 0,
      isleftAnimation: false,
      isrightAnimation: false,
      beginTextVis: true
    };
  },
  methods: {
    dragstart(e) {
      e.dataTransfer.setDragImage(document.createElement("div"), 0, 0);
      let rect = this.$refs.header.getBoundingClientRect();
      this.top = rect.top;
      this.left = rect.left;
      this.topOffset = e.y - rect.top;
      this.leftOffset = e.x - rect.left;
    },
    drag(e) {
      let rect = this.$refs.header.getBoundingClientRect();
      this.top = e.y - this.topOffset;
      this.left = e.x - this.leftOffset;
    },
    dragend(e) {
      let rect = this.$refs.header.getBoundingClientRect();
      this.top = e.y - this.topOffset;
      this.left = e.x - this.leftOffset;
      //   this.$emit("moved", { x: this.left, y: this.top });
    },

    remind() {
      // 动画完成后dosomething
      console.log("success");
    },
    async animationSuccess() {
      let a = await new Promise(res => {
        document.addEventListener("animationend", () => {
          this.isleftAnimation = true;
          res();
        });
      });
      let b = await new Promise(res => {
        document.addEventListener("animationend", () => {
          res();
          this.remind();
        });
      });
    },
    beginRush() {
      this.isrightAnimation = true;
      this.beginTextVis = false;
      this.animationSuccess();
    }
  }
};
</script>
<style  scoped lang="scss">
.content {
  z-index: 1000;
  position: fixed;
  left: 0;
  top: 0;
}

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
    .beginRushAnswer {
      height: 140px;
      line-height: 140px;
      text-shadow: 2px 5px 8px #fff;
      &:hover {
        box-shadow: 0px 0px 1 rgb(78, 67, 67);
      }
    }
    .continueRushAnswer {
      height: 140px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      color: #0a818c;
      &:hover {
        box-shadow: 0px 0px 1 rgb(78, 67, 67);
      }
    }
    .withoutRushPeroson {
      color: #fff;
      text-shadow: 2px 5px 8px #fff;
    }
    
    .oncebegin {
      position: absolute;
      width: 140px;
      height: 40px;
      bottom: 6px;
      .hover:hover {
        fill: #18908a !important;
      }
      .begin {
        font-size: 12px;
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
  }
}
.addRightAnimation {
  animation: circle_right 2.5s linear 0s 1 forwards;
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
  animation: left_right 2.5s linear 0s 1 forwards;
}

@keyframes left_right {
  0% {
    transform: rotate(-45deg);
  }

  100% {
    transform: rotate(135deg);
  }
}
</style>
