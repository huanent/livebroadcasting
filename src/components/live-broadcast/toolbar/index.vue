<template>
  <div class="toolbar">
    <ul ref="toolbarul">
      <li
        v-for="(item, index) in toolslist"
        :key="index"
        :class="[item.fontawesome, { toolactive: toolslistcurrent == index }]"
        @click.prevent="
          addToolsClass(index);
          showBox(index);
        "
      >
        <a
          >{{ item.index
          }}<icon :name="item.name" :size="item.size" color="#b4b4b5"
        /></a>
        <span class="tool-hover">{{ item.tips }}</span>
      </li>
      <!-- 形状的面板 -->
      <div class="shape-box" v-if="shapeBoxIsshow">
        <div class="block">
          <el-slider v-model="thickness"></el-slider>
        </div>
        <div>
          <ul class="shape-select">
            <li
              v-for="(item, index) in toolitems"
              :key="index"
              :class="[{ active: toolitemscurrent == index }]"
              @click="addToolitemClass(index)"
            >
              <a
                >{{ item.index
                }}<icon :name="item.name" :size="24" color="#b4b4b5"
              /></a>
            </li>
          </ul>
        </div>
        <div>
          <el-color-picker v-model="shapecolor"></el-color-picker>
        </div>
      </div>

      <!-- 字体选择面板 -->
      <div class="text-box" v-if="textBoxIsshow">
        <div class="block">
          <el-slider v-model="fontSize"></el-slider>
        </div>
        <div>
          <el-color-picker v-model="textcolor"></el-color-picker>
        </div>
      </div>
      <ul ref="toolbarul" class="not-tool">
        <li
          v-for="(item2, index) in toolslist2"
          :key="index"
          :class="[{ toolactive: toolslistcurrent2 == index }]"
          @mousedown="
            moveToolbar(index, $event);
            mousedownClass(index);
          "
          @mouseup="toolslistcurrent2 = -1"
        >
          <a
            >{{ item2.index
            }}<icon :name="item2.name" :size="item2.size" color="#b4b4b5"
          /></a>
          <span class="tool-hover">{{ item2.tips }}</span>
        </li>
      </ul>
    </ul>
  </div>
</template>

<script>
export default {
  name: "toolbar",
  data() {
    return {
      thickness: 10,
      fontSize: 10,
      shapecolor: "red",
      textcolor: "#000000",
      shapeBoxIsshow: false,
      textBoxIsshow: false,
      toolHoverIsshow: true,

      toolitemscurrent: 0,
      toolitems: [
        {
          name: "line2"
        },
        {
          name: "curve2"
        },
        {
          name: "circle"
        },
        {
          name: "rectangle"
        }
      ],

      toolslistcurrent: -1,
      toolslist: [
        {
          name: "pen",
          size: 21,
          tips: this.$t("toolbar.shape")
        },
        {
          name: "text2",
          size: 27,
          tips: this.$t("toolbar.text")
        },
        {
          name: "laserPen2",
          size: 27,
          tips: this.$t("toolbar.laserPen")
        },
        {
          name: "eraser4",
          size: 25,
          tips: this.$t("toolbar.eraser")
        }
      ],
      toolslistcurrent2: -1,
      toolslist2: [
        {
          name: "revoke3",
          size: 24,
          tips: this.$t("toolbar.revoke")
        },
        {
          name: "recovery2",
          size: 24,
          tips: this.$t("toolbar.recovery")
        },
        {
          name: "clear",
          size: 21,
          tips: this.$t("toolbar.clear")
        },
        {
          name: "add",
          size: 30,
          tips: this.$t("toolbar.add")
        },
        {
          name: "move",
          size: 24,
          tips: this.$t("toolbar.move")
        }
      ]
    };
  },
  computed: {},
  components: {},
  methods: {
    addToolitemClass(index) {
      this.toolitemscurrent = index;
    },
    addToolsClass(index) {
      this.toolslistcurrent = index;
    },
    showBox(index) {
      if (index == 0) {
        this.textBoxIsshow = false;
        this.shapeBoxIsshow = true;
        return;
      }
      if (index == 1) {
        this.shapeBoxIsshow = false;
        this.textBoxIsshow = true;
        return;
      }
      (this.shapeBoxIsshow = false), (this.textBoxIsshow = false);
    },
    mousedownClass(index) {
      this.toolslistcurrent2 = index;
    },
    moveToolbar(index, e) {
      if (index == 4) {
        console.log(e);
        let odiv = this.$refs.toolbarul;
        let disX = e.clientX - odiv.offsetLeft;
        let disY = e.clientY - odiv.offsetTop;
        document.onmousemove = e => {
          let left = e.clientX - disX;
          let top = e.clientY - disY;
          this.positionX = top;
          this.positionY = left;
          odiv.style.left = left + "px";
          odiv.style.top = top + "px";
        };
        document.onmouseup = e => {
          console.log(e);
          document.onmousemove = null;
          document.onmouseup = null;
        };
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.svg-bold {
  font-weight: 100;
}
.toolbar {
  z-index: 999;
  position: absolute;
  right: 70px;
  top: 80px;
  > ul {
    box-sizing: content-box;
    position: absolute;
    width: 70px;
    float: left;
    background-color: rgba(33, 35, 37, 0.8);
    color: white;
    .tool-actived {
      background-color: black;
    }
    > li:nth-child(1) {
      margin-top: 10px;
    }
    > li {
      position: relative;
      width: 30px;
      height: 30px;
      padding: 10px;
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
        // box-shadow: 0 0 2px 2px #b4b4b5 inset;
      }

      .tool-hover {
        visibility: hidden;
        transition: all 0.15s ease;
        position: absolute;
        top: 10px;
        left: 50px;
        white-space: nowrap;
        padding: 2px 6px;
        height: 20px;
        line-height: 20px;
        font-size: 12px;
        color: #fff;
        background: rgba(0, 0, 0, 0.8);
        // border-radius: 2px;
      }
    }
  }
}
.shape-box {
  text-align: center;
  padding: 10px;
  position: absolute;
  right: 70px;
  top: 0;
  width: 150px;
  background-color: rgba(33, 35, 37, 1);
  .shape-select {
    text-align: center;
    & :hover {
      background-color: black;
    }
    li {
      text-align: center;
      float: left;
      width: 30px;
      padding: 3px;
    }
  }
}
.text-box {
  text-align: center;
  padding: 10px;
  position: absolute;
  right: 70px;
  top: 30px;
  width: 150px;
  background-color: rgba(33, 35, 37, 1);
  .shape-select {
    li {
      text-align: center;
      float: left;
      width: 30px;
      height: 30px;
      padding: 3px;
    }
    & :hover {
      background-color: black;
    }
  }
}
.not-tool {
  box-sizing: content-box;
  position: absolute;
  width: 70px;
  float: left;
  background-color: rgba(33, 35, 37, 0.8);
  color: white;
  .tool-actived {
    background-color: black;
  }
  > li:nth-child(1) {
    margin-top: 10px;
  }
  > li {
    position: relative;
    width: 30px;
    height: 30px;
    padding: 10px;
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
      // box-shadow: 0 0 2px 2px #b4b4b5 inset;
    }

    .tool-hover {
      visibility: hidden;
      transition: all 0.15s ease;
      position: absolute;
      top: 10px;
      left: 50px;
      white-space: nowrap;
      padding: 2px 6px;
      height: 20px;
      line-height: 20px;
      font-size: 12px;
      color: #fff;
      background: rgba(0, 0, 0, 0.8);
      // border-radius: 2px;
    }
  }
}
.active {
  background-color: black;
}

.toolactive {
  background-color: black;
  // box-sizing: content-box;
  // border: 3px solid #b4b4b5;
  box-shadow: 0 0 0 3px #b4b4b5 inset;
}
</style>
