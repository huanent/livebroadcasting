<template>
  <div class="content">
    <div class="contain" ref="header">
      <div class="leftarea">
        <div class="leftcircle" id="sa"></div>
      </div>
      <div class="rightarea">
        <div class="rightcircle" id="ss"></div>
      </div>
      <div class="backyi"></div>
      <div class="backer"></div>
      <div class="backsan">
        <span class="beginRushAnswer" @click="start">{{ infoText }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      infoText: 3
    };
  },
  computed: {
    ...mapState("widget", ["rush"])
  },
  watch: {
    "rush.started"(value) {
      if (!value) return;
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
  .beginRushAnswer {
    height: 140px;
    font-size: 42px;
    line-height: 140px;
    text-shadow: 2px 5px 8px #fff;
    &:hover {
      box-shadow: 0px 0px 1 rgb(78, 67, 67);
    }
  }
}
</style>
