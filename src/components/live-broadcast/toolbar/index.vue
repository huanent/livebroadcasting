<template>
  <div class="toolbar" ref="toolbarul" @mousedown="moveToolbar($event)">
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
      <ActionTools
        @mousedown="
          shapeBoxIsshow ? true : false;
          textBoxIsshow ? true : false;
        "
        @changeSet="fromchangeSet"
      ></ActionTools>
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
        // {
        //   name: "hand",
        //   size: 22,
        //   tool: "hand",
        //   toolNum: 12,
        //   tips: this.$t("toolbar.hand")
        // }
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
    },
    moveToolbar(e) {
      let odiv = this.$refs.toolbarul;
      let disX = e.clientX - odiv.offsetLeft;
      let disY = e.clientY - odiv.offsetTop;
      document.onmousemove = e => {
        let reftop = odiv.getBoundingClientRect().top;
        let refbottom = odiv.getBoundingClientRect().bottom;
        let refleft = odiv.getBoundingClientRect().left;
        let refright = odiv.getBoundingClientRect().right;

        let parenttop = this.$parent.$el.getBoundingClientRect().top;
        let parentbottom = this.$parent.$el.getBoundingClientRect().bottom;
        let parentleft = this.$parent.$el.getBoundingClientRect().left;
        let parentright = this.$parent.$el.getBoundingClientRect().right;
        let parentheight = this.$parent.$el.offsetHeight;

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
  top: calc(50% - 185px);
  &:hover {
    cursor: move;
  }
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
        cursor: pointer;
        background-color: black;
      }
      &:hover svg {
        fill: rgb(255, 255, 255) !important;
      }
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
