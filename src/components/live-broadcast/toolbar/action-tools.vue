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
      // if (item.action == "move") {
      //   let odiv = this.$parent.$refs.toolbarul;
      //   let disX = e.clientX - odiv.offsetLeft;
      //   let disY = e.clientY - odiv.offsetTop;
      //   document.onmousemove = e => {

      //   document.onmouseup = e => {
      //     // console.log(this.$parent.$parent.$el.offsetHeight);
      //     // console.log(this.$parent);
      //     let xOffset = this.$parent.$parent.$el.offsetWidth - e.clientX;
      //     let yOffset = this.$parent.$parent.$el.offsetHeight - e.clientY;
      //     if (e.clientX < 170) {
      //       // this.$emit("changeSet", "50px");
      //     } else {
      //       // this.$emit("changeSet", "-170px");
      //     }
      //     if (
      //       xOffset < 100 &&
      //       xOffset > -50 &&
      //       yOffset < 100 &&
      //       yOffset > -100
      //     ) {
      //       this.$parent.$el.style.left = "";
      //       this.$parent.$el.style.top = "";
      //     }
      //     document.onmousemove = null;
      //     document.onmouseup = null;
      //   };
      // }

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
          // console.log(e.clientX, e.clientY);
          //顶部判断
          // if (reftop > parenttop) {
          //   //加左侧判断
          //   if (refleft > 0) {
          //     //加右侧判断
          //     if (refleft + 48 < parentright) {
          //       //加底部判断
          //       if (refbottom + 370 < parentbottom) {
          //         console.log("正常");
          //         let left = e.clientX - disX;
          //         let top = e.clientY - disY;
          //         odiv.style.left = left + "px";
          //         odiv.style.top = top + "px";
          //         return;
          //       } else {
          //         if (refleft > 0) {
          //           if (refleft + 48 < parentright) {
          //             console.log("到底了");
          //             let left = e.clientX - disX;
          //             let top = e.clientY - disY;
          //             odiv.style.left = left + "px";
          //             // odiv.style.top = "50%";
          //             return;
          //           } else {
          //             console.log("到右下角");
          //             let left = e.clientX - disX;
          //             let top = e.clientY - disY;
          //             odiv.style.left = parentright - 48 + "px";
          //             odiv.style.top = parentbottom - refbottom - 30 + "px";
          //             // odiv.style.top = "50%";
          //             return;
          //           }
          //         } else {
          //           console.log("到左下角");
          //           let left = e.clientX - disX;
          //           let top = e.clientY - disY;
          //           odiv.style.left = 0 + "px";
          //           odiv.style.top = parentbottom - refbottom - 30 + "px";
          //           // odiv.style.top = "50%";
          //           return;
          //         }
          //       }
          //     }
          //     if (refbottom + 370 < parentbottom) {
          //       console.log("到右侧了");
          //       let left = e.clientX - disX;
          //       let top = e.clientY - disY;
          //       odiv.style.left = parentright - 48 + "px";
          //       odiv.style.top = top + "px";
          //       return;
          //     } else {
          //       console.log("到右下角了");
          //       // debugger;
          //       let left = e.clientX - disX;
          //       let top = e.clientY - disY;
          //       odiv.style.left = parentright - 48 + "px";
          //       odiv.style.top = parentbottom - refbottom - 30 + "px";
          //       // odiv.style.top = "50%";
          //       return;
          //     }
          //   } else {
          //     if (refbottom + 370 < parentbottom) {
          //       console.log("到左侧了");
          //       let left = e.clientX - disX;
          //       let top = e.clientY - disY;
          //       odiv.style.left = 0 + "px";
          //       odiv.style.top = top + "px";
          //       return;
          //     } else {
          //       console.log("到左下角了");
          //       // debugger;
          //       let left = e.clientX - disX;
          //       let top = e.clientY - disY;
          //       odiv.style.left = 0 + "px";
          //       odiv.style.top = parentbottom - refbottom - 30 + "px";
          //       return;
          //     }
          //   }
          // } else {
          //   if (refleft > 0) {
          //     if (refleft + 48 < parentright) {
          //       console.log("到顶了");
          //       let left = e.clientX - disX;
          //       let top = e.clientY - disY;
          //       odiv.style.left = left + "px";
          //       odiv.style.top = 0 + "px";
          //       return;
          //     } else {
          //       console.log("到右上角");
          //       let left = e.clientX - disX;
          //       let top = e.clientY - disY;
          //       odiv.style.left = parentright - 48 + "px";
          //       odiv.style.top = 0 + "px";
          //       return;
          //     }
          //   } else {
          //     console.log("到左上角");
          //     let left = e.clientX - disX;
          //     let top = e.clientY - disY;
          //     odiv.style.left = 0 + "px";
          //     odiv.style.top = 0 + "px";
          //     return;
          //   }
          // }

          let left = e.clientX - disX;
          let top = e.clientY - disY;
          //顶部判断
          if (
            reftop < parenttop ||
            refbottom + 350 > parentbottom ||
            refleft < 0 ||
            refleft + 48 > parentright
          ) {
            if (reftop < parenttop) {
              let left = e.clientX - disX;
              this.positionX = top;
              this.positionY = left;
              odiv.style.left = left + "px";
              odiv.style.top = 0 + "px";
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
              odiv.style.left = 0 + "px";
              odiv.style.top = top + "px";
            } else {
              document.onmousemove = null;
            }
            //加右侧判断
            if (refleft + 48 > parentright) {
              let top = e.clientY - disY;
              this.positionX = top;
              this.positionY = left;
              odiv.style.left = parentright - 48 + "px";
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
