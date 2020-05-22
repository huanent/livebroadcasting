<template>
  <div
    class="content"
    :style="{ top: top + 'px', left: left + 'px' }"
    v-if="rush.visible"
  >
    <div
      class="contain"
      :draggable="role == ROLE.TEACHER"
      @dragstart="dragstart"
      @drag="drag"
      ref="header"
      @dragend="dragend"
    >
      <div class="leftarea">
        <div
          class="leftcircle"
          id="sa"
          :class="{ addLeftAnimation: isleftAnimation }"
        ></div>
      </div>
      <div class="rightarea">
        <div
          class="rightcircle"
          id="ss"
          :class="{ addRightAnimation: isrightAnimation }"
        ></div>
      </div>
      <div class="backyi"></div>
      <div class="backer"></div>
      <div class="backsan">
        <controller @start="beginRush" v-if="role == ROLE.TEACHER" />
        <answer v-else />
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";

import Controller from "./controller";
import Answer from "./answer";
import { ROLE } from "../../../../models/role";

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
      showRestart: false
    };
  },
  components: {
    Controller,
    Answer
  },
  computed: {
    ...mapState("widget", ["rush"]),
    ...mapState("account", ["role"]),
    visible() {
      if (role == ROLE.TEACHER) return this.rush.visible;
      else {
        return this.rush.stared;
      }
    }
  },
  methods: {
    ...mapMutations("widget", ["SET_RUSH_VISIBLE"]),
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
    },

    async animationSuccess() {
      await new Promise(res => {
        document.addEventListener("animationend", () => {
          this.isleftAnimation = true;
          res();
        });
      });
      await new Promise(res => {
        document.addEventListener("animationend", () => {
          res();
        });
      });
    },

    async beginRush(callback) {
      this.isrightAnimation = true;
      await this.animationSuccess();
      this.isleftAnimation = false;
      this.isrightAnimation = false;
      callback();
    }
  }
};
</script>
<style scoped lang="scss">
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
