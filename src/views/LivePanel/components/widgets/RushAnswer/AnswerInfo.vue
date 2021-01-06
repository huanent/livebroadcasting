<template>
  <div class="content" :style="{ top: top, left: left }">
    <div
      class="contain"
      ref="header"
      v-loading="loading"
      element-loading-background="rgba(0, 0, 0, 0)"
      @click="onclick"
    >
      <div class="leftarea">
        <div class="leftcircle" id="sa"></div>
      </div>
      <div class="rightarea">
        <div class="rightcircle" id="ss"></div>
      </div>
      <div class="backyi"></div>
      <div class="backer"></div>
      <div class="backsan">
        <span class="beginRushAnswer">{{ infoText | ellipsis }}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapMutations, mapState } from "vuex";
import { delay } from "@/core/utils";
import { liveBroadcastService } from "@/core/live-broadcast";
import { ROLE } from "@/models/role";
export default {
  name: "AnswerInfo",
  data() {
    return {
      top: "0%",
      left: "0%",
      infoText: "等待开始",
      loading: false,
      rushing: false
    };
  },
  created() {
    this.rendomPosition();
  },
  computed: {
    ...mapState("widget", ["rush"]),
    ...mapState("account", ["userInfo"]),
    ...mapGetters("workplace", ["isTeacher"])
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
    ...mapMutations("widget",["SET_RUSH_STATUS","SET_RUSH_NAME"]),
    rendomPosition() {
      this.top = parseInt(1 + Math.random() * 70) + "%";
      this.left = parseInt(1 + Math.random() * 70) + "%";
    },
    async onclick() {
      if (this.rush.status !== 'rushable') return;
       this.loading = true;
      await liveBroadcastService.timService.sendSystemMsg(
        "RUSH_ANSWER",
        ROLE.TEACHER,
        this.userInfo.nickname || this.userInfo.username
      );
    }
  },
  watch: {
    "rush.visible":function(value) {
      this.infoText = "等待开始";
      if(!value && this.isTeacher){
        this.SET_RUSH_STATUS('waitting');
        this.SET_RUSH_NAME("");
      }
    },
    "rush.name":function(value) {
      this.infoText = value;
      this.loading = false;
    },
    "rush.status":function(value){
      switch (value) {
        case 'waitting':
          this.infoText = "等待开始";
          break;
        case 'rushing':
          this.rushing = true;
          this.$nextTick(async () => {
            this.infoText = 3;
            this.rendomPosition();
            await delay(1000);
            this.infoText = 2;
            this.rendomPosition();
            await delay(1000);
            this.infoText = 1;
            this.rendomPosition();
            await delay(1000);
            this.rendomPosition();
            this.infoText = "抢答";
            this.rushing = false;

          });
          break;
        case 'rushable':
          break;
      }

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
    background-color: rgba(80,110,250,0.2);
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
        border: 8px solid transparent;
        border-left: 8px solid rgba(80,110,250,0.2);
        border-top: 8px solid rgba(80,110,250,0.2);
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
        border: 8px solid transparent;
        border-right: 8px solid rgba(80,110,250,0.2);
        border-bottom: 8px solid rgba(80,110,250,0.2);
        float: right;
        transform: rotate(-45deg);
      }
    }

    .backyi {
      width: 160px;
      height: 160px;
      background-color:#506efa;
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
      background-color: #506efa;
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
      background-color:#506efa;
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
    font-size: 30px;
    line-height: 140px;
    text-shadow: 2px 5px 8px #fff;
    cursor: pointer;
    &:hover {
      box-shadow: 0px 0px 1 rgb(78, 67, 67);
    }
  }
}
</style>
