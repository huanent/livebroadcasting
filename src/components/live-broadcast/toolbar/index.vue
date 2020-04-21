<template>
  <div class="toolbar" ref="toolbarul">
    <ul>
      <li
        v-for="(item, index) in toolslist"
        :key="index"
        :class="[
          item.fontawesome,
          { toolactive: toolslistcurrent == item.tool }
        ]"
        @click.prevent="
          addToolsClass(index, item);
          showBox(item);
          changeTool(item.toolNum);
        "
      >
        <el-popover
          placement="left"
          trigger="click"
          :visible-arrow="false"
          popper-class="popper"
        >
          <div v-show="shapeBoxIsshow">
            <!-- 形状的面板 -->
            <ShapeBox ref="shapeBox"></ShapeBox>
          </div>
          <div v-show="textBoxIsshow">
            <!-- 字体选择面板 -->
            <TextBox ref="textBox"></TextBox>
          </div>
          <a slot="reference"
            ><icon :name="item.name" :size="item.size" color="#b4b4b5"
          /></a>
        </el-popover>
        <span class="tool-hover">{{ item.tips }}</span>
      </li>

      <!-- 无面板工具 -->
      <li
        v-for="(item, index) in toolslistNotbox"
        :key="item.tool"
        :class="[
          item.fontawesome,
          { toolactive: toolslistcurrent == item.tool }
        ]"
        @click.prevent="
          addToolsClass(index, item);
          showBox(item);
          changeTool(item.toolNum);
        "
      >
        <el-popover
          placement="left"
          visible-arrow="false"
          trigger="click"
          :disabled="true"
        >
          <a slot="reference"
            ><icon :name="item.name" :size="item.size" color="#b4b4b5"
          /></a>
        </el-popover>
        <span class="tool-hover">{{ item.tips }}</span>
      </li>

      <!-- 可操作性工具 -->
      <div
        @mousedown="
          shapeBoxIsshow ? true : false;
          textBoxIsshow ? true : false;
        "
      >
        <ActionTools @changeSet="fromchangeSet"></ActionTools>
      </div>
    </ul>

    <!-- 形状的面板 -->
    <!-- <div v-show="shapeBoxIsshow">
      <ShapeBox ref="shapeBox"></ShapeBox>
    </div> -->

    <!-- 字体选择面板 -->
    <!-- <div v-show="textBoxIsshow">
      <TextBox ref="textBox"></TextBox>
    </div> -->
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import ActionTools from "./action-tools";
import ShapeBox from "./shape-box";
import TextBox from "./text-box";
export default {
  name: "toolbar",
  data() {
    return {
      shapeBoxIsshow: true,
      textBoxIsshow: false,
      toolHoverIsshow: true,

      toolslistcurrent: "",
      toolslist: [
        {
          name: "pen",
          size: 18,
          tool: "pen",
          toolNum: 1,
          tips: this.$t("toolbar.shape")
        },
        {
          name: "text2",
          size: 23,
          tool: "text",
          toolNum: 11,
          tips: this.$t("toolbar.text")
        }
      ],
      toolslistNotbox: [
        {
          name: "laserPen2",
          size: 21,
          tool: "laserPen",
          toolNum: 3,
          tips: this.$t("toolbar.laserPen")
        },
        {
          name: "eraser4",
          size: 19,
          tool: "eraser",
          toolNum: 2,
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
    ...mapMutations("board", ["SET_TOOL_TYPE"]),
    changeTool(toolNum) {
      console.log(toolNum);
      this.SET_TOOL_TYPE(toolNum);
    },
    addToolsClass(index, item) {
      this.toolslistcurrent = item.tool;
    },
    fromchangeSet(site) {
      // this.$refs.shapeBox.$el.style.left = site;
      // this.$refs.textBox.$el.style.left = site;
    },
    showBox(item) {
      if (item.tool == "pen") {
        this.shapeBoxIsshow = true;
        this.textBoxIsshow = false;
        return;
      }
      if (item.tool == "text") {
        this.textBoxIsshow = true;
        this.shapeBoxIsshow = false;

        return;
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
  right: 50px;
  top: 160px;
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
// /deep/.el-popper,
// .el-popover {
//   margin: 0;
//   padding: 0;
//   box-shadow: none;
//   text-shadow: none;
//   border: none;
//   border-radius: inherit;
// }
</style>
