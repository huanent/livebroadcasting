<template>
  <div
    class="toolbar"
    ref="toolbar"
    :style="{
      left: left + 'px',
      top: top + 'px'
    }"
  >
    <div>
      <a
        class="toolbar-item"
        v-show="!hideTool"
        v-for="(item, index) in toolslist"
        @mousedown="moveToolbar($event, item)"
        @click="toggerTool(item, index)"
        :class="{
          'toolbar-item-active': activeTool && activeTool.name === item.name
        }"
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
          iconName: "pen",
          name: "pen",
          type: "switch",
          tips: this.$t("toolbar.shape")
        },
        {
          iconName: "text2",
          name: "text",
          type: "switch",
          tips: this.$t("toolbar.text")
        },
        {
          iconName: "laserPen2",
          size: 21,
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
          iconName: "revoke3",
          name: "revoke",
          tips: this.$t("toolbar.revoke")
        },
        {
          iconName: "recovery2",
          name: "recovery",
          tips: this.$t("toolbar.recovery")
        },
        {
          iconName: "clear",
          name: "clear",
          tips: this.$t("toolbar.clear")
        },
        {
          iconName: "add",
          name: "add",
          tips: this.$t("toolbar.add")
        },
        {
          iconName: "move",
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
      }
    }
  },
  methods: {
    ...mapMutations("board", [
      "SET_TOOL_TYPE",
      "CLEAR_BOARD",
      "ADD_BOARD",
      "CAN_REDO",
      "CAN_UNDO"
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
</style>
