<template>
  <div class="toolbar" ref="toolbarul">
    <ul>
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

      <!-- 可操作性工具 -->
      <div
        @mousedown="
          shapeBoxIsshow = false;
          textBoxIsshow = false;
        "
      >
        <ActionTools></ActionTools>
      </div>
    </ul>
    <!-- 形状的面板 -->
    <div v-show="shapeBoxIsshow">
      <ShapeBox></ShapeBox>
    </div>

    <!-- 字体选择面板 -->
    <div v-show="textBoxIsshow">
      <TextBox></TextBox>
    </div>
  </div>
</template>

<script>
import ActionTools from "./action-tools";
import ShapeBox from "./shape-box";
import TextBox from "./text-box";
export default {
  name: "toolbar",
  data() {
    return {
      shapeBoxIsshow: false,
      textBoxIsshow: false,
      toolHoverIsshow: true,

      toolslistcurrent: -1,
      toolslist: [
        {
          name: "pen",
          size: 18,
          tips: this.$t("toolbar.shape")
        },
        {
          name: "text2",
          size: 23,
          tips: this.$t("toolbar.text")
        },
        {
          name: "laserPen2",
          size: 21,
          tips: this.$t("toolbar.laserPen")
        },
        {
          name: "eraser4",
          size: 19,
          tips: this.$t("toolbar.eraser")
        }
      ]
    };
  },
  components: {
    ActionTools,
    ShapeBox,
    TextBox
  },
  methods: {
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
  right: 50px;
  bottom: 640px;
  > ul {
    box-sizing: content-box;
    position: absolute;
    width: 50px;
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
