<template>
  <ul class="not-tool">
    <li
      v-for="(item, index) in toolslist2"
      :key="index"
      :class="[
        {
          toolactive: toolslistcurrent2 == index,
          movetool: item.action == 'move'
        }
      ]"
      @mousedown="
        moveToolbar(item, $event);
        mousedownClass(index);
      "
      @mouseup="toolslistcurrent2 = -1"
      @mouseleave="toolslistcurrent2 = -1"
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
        let odiv = this.$parent.$refs.toolbarul;
        let disX = e.clientX - odiv.offsetLeft;
        let disY = e.clientY - odiv.offsetTop;
        document.onmousemove = e => {
          let reftop = odiv.getBoundingClientRect().top;
          let refbottom = odiv.getBoundingClientRect().bottom;
          let refleft = odiv.getBoundingClientRect().left;
          let refright = odiv.getBoundingClientRect().right;

          let parenttop = this.$parent.$parent.$el.getBoundingClientRect().top;
          let parentbottom = this.$parent.$parent.$el.getBoundingClientRect()
            .bottom;
          let parentleft = this.$parent.$parent.$el.getBoundingClientRect()
            .left;
          let parentright = this.$parent.$parent.$el.getBoundingClientRect()
            .right;
          let parentheight = this.$parent.$parent.$el.offsetHeight;

          let left = e.clientX - disX;
          let top = e.clientY - disY;
          //边界判断
          if (
            reftop < parenttop ||
            refbottom + 350 > parentbottom ||
            refleft < 0 ||
            refleft + 48 > parentright
          ) {
            //顶部判断
            if (reftop < parenttop) {
              let left = e.clientX - disX;
              this.positionX = top;
              this.positionY = left;
              odiv.style.left = left + "px";
              odiv.style.top = 5 + "px";
            } else {
              document.onmousemove = null;
            }
            //加底部判断
            if (refbottom + 350 > parentbottom) {
              let left = e.clientX - disX;
              this.positionX = top;
              this.positionY = left;
              odiv.style.left = left + "px";
              odiv.style.top = parentheight - 370 + "px";
            } else {
              document.onmousemove = null;
            }
            //加左侧判断
            if (refleft < 0) {
              let top = e.clientY - disY;
              this.positionX = top;
              this.positionY = left;
              odiv.style.left = 5 + "px";
              odiv.style.top = top + "px";
            } else {
              document.onmousemove = null;
            }
            //加右侧判断
            if (refleft + 50 > parentright) {
              let top = e.clientY - disY;
              this.positionX = top;
              this.positionY = left;
              odiv.style.left = parentright - 55 + "px";
              odiv.style.top = top + "px";
            } else {
              document.onmousemove = null;
            }
          } else {
            // console.log("外部正常");
            odiv.style.left = left + "px";
            odiv.style.top = top + "px";
          }
        };
        document.onmouseup = e => {
          document.onmousemove = null;
          document.onmouseup = null;
        };
      }
      if (item.action == "clear") {
        this.$confirm("此操作将清空所有记录, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.CLEAR_BOARD();
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
        // this.CLEAR_BOARD();
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
  &:hover .movetool {
    background-color: black;
    box-shadow: 0 0 0 2px #b4b4b5 inset;
    svg {
      fill: rgb(255, 255, 255) !important;
    }
  }
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
    &:hover svg {
      fill: rgb(255, 255, 255) !important;
    }
  }
}
.toolactive {
  background-color: black;
  box-shadow: 0 0 0 2px #b4b4b5 inset;
  svg {
    fill: rgb(255, 255, 255) !important;
  }
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
