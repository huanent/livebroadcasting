<template>
  <div
    class="toolbar"
    ref="toolbar"
    :style="{
      left: left + 'px',
      top: top + 'px'
    }"
  >
    <a
      class="toolbar-item"
      v-show="!hideTool"
      v-for="(item, index) in toolslist"
      @mouseenter="judgeScale(item, index)"
      @mousedown="moveToolbar($event, item)"
      @click="toggerTool(item, index)"
      :key="index"
      :class="[
        {
          'toolbar-item-active': activeTool && activeTool.name === item.name
        },
        item.singleclass
      ]"
    >
      <el-tooltip effect="dark" :content="item.tips" placement="right">
        <el-popover
          placement="left"
          trigger="click"
          :visible-arrow="false"
          popper-class="popper"
        >
          <div v-show="item.name === 'pen'">
            <!-- 形状的面板 -->
            <ShapeBox ref="shapeBox"></ShapeBox>
          </div>
          <div v-show="item.name === 'text'">
            <!-- 字体选择面板 -->
            <TextBox ref="textBox"></TextBox>
          </div>
          <icon :name="item.iconName" :size="18" slot="reference"></icon>
        </el-popover>
      </el-tooltip>
    </a>
    <a class="toolbar-item" v-show="hideTool" @click="showTool">
      <icon name="outdent" :size="18" style="transform: rotate(90deg)"></icon>
    </a>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import ShapeBox from "./shape-box";
import TextBox from "./text-box";
import { Emitter } from "../../../core/emit";
export default {
  name: "toolbar",
  data() {
    return {
      activeTool: undefined,
      lastActiveSwitchTool: undefined,
      hideTool: false,
      toolHight: 0,
      toolslist: [
        {
          iconName: "pen4",
          name: "pen",
          type: "switch",
          tips: this.$t("toolbar.shape")
        },
        {
          iconName: "text3",
          name: "text",
          type: "switch",
          tips: this.$t("toolbar.text")
        },
        {
          iconName: "laserPen3",
          type: "switch",
          name: "laserPen",
          tips: this.$t("toolbar.laserPen")
        },
        {
          iconName: "eraser4",
          name: "eraser",
          type: "switch",
          tips: this.$t("toolbar.eraser")
        },
        {
          iconName: "hand",
          name: "hand",
          type: "switch",
          tips: this.$t("toolbar.hand"),
          singleclass: "toolbar-item-disabled"
        },
        {
          iconName: "undo",
          name: "revoke",
          tips: this.$t("toolbar.revoke")
        },
        {
          iconName: "redo",
          name: "recovery",
          tips: this.$t("toolbar.recovery")
        },
        {
          iconName: "clear3",
          name: "clear",
          tips: this.$t("toolbar.clear")
        },
        {
          iconName: "add",
          name: "add",
          tips: this.$t("toolbar.add")
        },
        {
          iconName: "move2",
          name: "move",
          tips: this.$t("toolbar.move")
        }
      ],
      left: 0,
      top: 0
    };
  },
  components: {
    ShapeBox,
    TextBox
  },
  mounted() {
    this.activeTool = this.toolslist[0];
    this.lastActiveSwitchTool = this.activeTool;
    this.initToolBarPosition();
    Emitter.on("split-change", () => {
      let el = this.$refs.toolbar;
      let parentEl = el.parentElement;
      if (this.toolHight < el.clientHeight) {
        this.toolHight = el.clientHeight;
      }
      if (this.toolHight > parentEl.clientHeight - 50) {
        this.hideTool = true;
        this.initToolBarPosition("bottom", true);
      } else {
        this.hideTool = false;
        this.initToolBarPosition(null, true);
      }
    });
  },
  watch: {
    "activeTool.name": function(name) {
      switch (name) {
        case "clear":
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
          break;
        case "revoke":
          this.CAN_UNDO();
          break;
        case "recovery":
          this.CAN_REDO();
          break;
        case "add":
          this.ADD_BOARD();
          break;
        case "pen":
          this.SET_TOOL_PEN();
          break;
        case "text":
          this.SET_TOOL_TEXT();
          break;
        case "laserPen":
          this.SET_TOOL_LASERPEN();
          break;
        case "eraser":
          this.SET_TOOL_ERASER();
          break;
        case "hand":
          if (this.$store.state.workplace.boardScale > 100) {
            this.SET_TOOL_DRAG();
          }
          break;
      }
    }
  },
  methods: {
    ...mapMutations("board", [
      "CLEAR_BOARD",
      "ADD_BOARD",
      "CAN_REDO",
      "CAN_UNDO",
      "SET_TOOL_TEXT",
      "SET_TOOL_PEN",
      "SET_TOOL_LASERPEN",
      "SET_TOOL_ERASER",
      "SET_TOOL_DRAG"
    ]),
    showTool() {
      this.hideTool = false;
      this.initToolBarPosition("top", true);
    },
    initToolBarPosition(type, leftFix) {
      let el = this.$refs.toolbar;
      if (el) {
        let parentEl = el.parentElement;
        let ph = parentEl.getBoundingClientRect().height;
        let pw = parentEl.getBoundingClientRect().width;
        let h = el.getBoundingClientRect().height;
        let w = el.getBoundingClientRect().width;
        this.top = ph / 2 - h / 2;
        if (!leftFix) {
          this.left = pw - w;
        }

        if (this.toolHight < el.clientHeight) {
          this.toolHight = el.clientHeight;
        }
        if (type === "bottom") {
          this.top = ph - h;
        }
        if (type === "top") {
          this.top = ph - this.toolHight;
        }
      }
    },
    checkEdge(left, top) {
      let odiv = this.$refs.toolbar;
      let rect = odiv.getBoundingClientRect();
      let w = rect.width;
      let h = rect.height;
      let prect = odiv.parentElement.getBoundingClientRect();
      let pw = prect.width;
      let ph = prect.height;
      if (left < 0 || top < 0) return true;
      if (left > 0 && left - pw + w >= 0) return true;
      if (top > 0 && top - ph + h >= 0) return true;
    },
    toggerTool(item, index) {
      if (item.type === "switch") {
        if (
          item.name === "hand" &&
          this.$store.state.workplace.boardScale <= 100
        ) {
          return;
        }
        this.lastActiveSwitchTool = item;
      } else {
        setTimeout(() => {
          this.activeTool = this.lastActiveSwitchTool;
        }, 300);
      }
      this.activeTool = item;
    },
    moveToolbar(e, tool) {
      if (tool.name !== "move") return;
      let odiv = this.$refs.toolbar;
      let disX = e.clientX - odiv.offsetLeft;
      let disY = e.clientY - odiv.offsetTop;
      document.onmousemove = e => {
        let left = e.clientX - disX;
        let top = e.clientY - disY;
        if (!this.checkEdge(left, top)) {
          this.left = left;
          this.top = top;
        }
      };
      document.onmouseup = e => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    },
    judgeScale(item, index) {
      if (
        item.name == "hand" &&
        this.$store.state.workplace.boardScale <= 100
      ) {
        item.singleclass = "toolbar-item-disabled";
      } else {
        item.singleclass = "";
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.toolbar {
  z-index: 999;
  width: 2rem;
  color: #eee;
  background-color: rgba(48, 49, 51, 0.79);
  position: absolute;
  padding: 0.3rem 0;
  text-align: center;
}
/deep/ .svg-icon {
  padding: 0.4rem;
  fill: #eee !important;
}
.toolbar-item {
  display: inline-block;
  margin: 0 auto;
  width: 100%;
}
.toolbar-item:hover {
  background-color: rgba(0, 0, 0, 0.43);
}
.toolbar-item-active {
  background-color: rgba(0, 0, 0, 0.43);
}
.toolbar-item-disabled svg {
  cursor: not-allowed !important;
}
</style>
