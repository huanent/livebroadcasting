<template>
  <ul class="not-tool">
    <li
      v-for="(item, index) in toolslist2"
      :key="index"
      :class="[{ toolactive: toolslistcurrent2 == index }]"
      @mousedown="
        moveToolbar(item, $event);
        mousedownClass(index);
      "
      @mouseup="toolslistcurrent2 = -1"
    >
      <a
        >{{ item.index
        }}<icon :name="item.name" :size="item.size" color="#b4b4b5"
      /></a>
      <span class="tool-hover">{{ item.tips }}</span>
    </li>
  </ul>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "ActionTools",
  data() {
    return {
      toolslistcurrent2: -1,
      toolslist2: [
        {
          name: "revoke3",
          size: 18,
          action: "revoke",
          tips: this.$t("toolbar.revoke")
        },
        {
          name: "recovery2",
          size: 18,
          action: "recovery",
          tips: this.$t("toolbar.recovery")
        },
        {
          name: "clear",
          size: 18,
          action: "clear",
          tips: this.$t("toolbar.clear")
        },
        {
          name: "add",
          size: 24,
          action: "add",
          tips: this.$t("toolbar.add")
        },
        {
          name: "move",
          size: 18,
          action: "move",
          tips: this.$t("toolbar.move")
        }
      ]
    };
  },
  methods: {
    ...mapMutations("board", [
      "CLEAR_BOARD",
      "ADD_BOARD",
      "CAN_REDO",
      "CAN_UNDO"
    ]),
    mousedownClass(index) {
      this.toolslistcurrent2 = index;
    },
    moveToolbar(item, e) {
      if (item.action == "move") {
        let parentY = this.$parent.$parent.$el.offsetHeight;
        let parentY2 = parseInt(this.$parent.$parent.$el.offsetHeight - 145);
        let parentX = this.$parent.$parent.$el.offsetWidth;
        let odiv = this.$parent.$refs.toolbarul;
        let disX = e.clientX - odiv.offsetLeft;
        let disY = e.clientY - odiv.offsetTop;
        document.onmousemove = e => {
          console.log(parentY);
          console.log(e.clientY);
          if (e.clientY > parentY2) {
            // if (e.clientX < parentX) {
            //   let top = e.clientY - disY;
            //   odiv.style.right = 50 + "px";
            //   odiv.style.top = top + "px";
            //   return;
            // }
            let left = e.clientX - disX;
            let top = e.clientY - disY;
            this.positionX = top;
            this.positionY = left;
            odiv.style.left = left + "px";
            odiv.style.top = top + "px";
            return;
          } else {
            let left = e.clientX - disX;
            odiv.style.left = left + "px";
            odiv.style.top = 30 + "px";
            return;
          }
        };
        document.onmouseup = e => {
          let xOffset = this.$parent.$parent.$el.offsetWidth - e.clientX;
          let yOffset = this.$parent.$parent.$el.offsetHeight - e.clientY;
          // console.log("白板宽度" + this.$parent.$parent.$el.offsetWidth);
          // console.log("白板高度" + this.$parent.$parent.$el.offsetHeight);
          // console.log("client x是" + e.clientX);
          // console.log("client y是" + e.clientY);
          // console.log("xoffset 是" + xOffset);
          // console.log("yoffset 是" + yOffset);
          if (e.clientX < 170) {
            // this.$emit("changeSet", "50px");
          } else {
            // this.$emit("changeSet", "-170px");
          }
          if (
            xOffset < 100 &&
            xOffset > -50 &&
            yOffset < 100 &&
            yOffset > -100
          ) {
            this.$parent.$el.style.left = "";
            this.$parent.$el.style.top = "";
          }
          document.onmousemove = null;
          document.onmouseup = null;
        };
      }
      if (item.action == "clear") {
        this.CLEAR_BOARD();
      }
      if (item.action == "revoke") {
        this.CAN_UNDO();
      }
      if (item.action == "recovery") {
        this.CAN_REDO();
      }
      if (item.action == "add") {
        this.ADD_BOARD();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.not-tool {
  box-sizing: content-box;
  position: absolute;
  width: 50px;
  float: left;
  background-color: rgba(33, 35, 37, 0.8);
  color: white;
  .tool-actived {
    background-color: black;
  }
  > li {
    position: relative;
    width: 30px;
    height: 30px;
    line-height: 28px;
    padding: 0;
    margin-bottom: 10px;
    margin-left: 10px;
    margin-right: 10px;
    cursor: pointer;
    text-align: center;
    &:hover .tool-hover {
      visibility: visible;
    }
    &:hover {
      background-color: black;
    }
  }
}
.toolactive {
  background-color: black;
  box-shadow: 0 0 0 2px #b4b4b5 inset;
}
.tool-hover {
  visibility: hidden;
  transition: all 0.15s ease;
  position: absolute;
  top: 5px;
  left: 40px;
  white-space: nowrap;
  padding: 2px 6px;
  height: 20px;
  line-height: 20px;
  font-size: 12px;
  color: #fff;
  background: rgba(0, 0, 0, 0.8);
}
</style>
