<template>
  <ul
    class="toolbar"
    ref="toolbar"
    :class="{ hide: isHide }"
    :style="{
      right: right + 'px',
      top: top + 'px'
    }"
  >
    <li
      v-show="!hideTool"
      v-for="(item, index) in toolslist"
      @mousedown="moveToolbar($event, item)"
      @click="toggerTool(item, index)"
      :key="index"
      :class="[
        'toolbar-item',
        {
          disabled: isScaleLimit && item.name === 'hand'
        },
        {
          active: activeTool && activeTool.name === item.name
        },
        item.singleclass
      ]"
    >
      <el-tooltip :content="item.tips" placement="right" :open-delay="300">
        <el-popover
          placement="left"
          trigger="click"
          :visible-arrow="false"
          v-if="item.name === 'pen' || item.name === 'text'"
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
        <icon v-else :name="item.iconName" :size="18"></icon>
      </el-tooltip>
    </li>
    <li class="toolbar-item" v-show="hideTool" @click="showTool">
      <icon name="outdent" :size="18" style="transform: rotate(90deg)"></icon>
    </li>
  </ul>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import ShapeBox from "./ShapeBox";
import TextBox from "./TextBox";
export default {
  name: "Toolbar",
  data() {
    return {
      activeTool: undefined,
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
          iconName: "hand-paper",
          name: "hand",
          type: "switch",
          tips: this.$t("toolbar.hand")
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
          iconName: "square",
          name: "clear",
          tips: this.$t("toolbar.clear")
        },
        {
          iconName: "add",
          name: "add",
          tips: this.$t("toolbar.add")
        },
        {
          iconName: "trash2",
          name: "remove",
          tips: this.$t("toolbar.remove")
        },
        {
          iconName: "move2",
          name: "move",
          tips: this.$t("toolbar.move")
        }
      ],
      right: 0,
      top: 0,
      isHide: true
    };
  },
  components: {
    ShapeBox,
    TextBox
  },
  computed: {
    ...mapState("workplace", ["cameraPanelVisibity"]),
    isScaleLimit() {
      return this.$store.state.board.currentFile.scale <= 100;
    }
  },
  watch: {
    cameraPanelVisibity() {
      this.initToolBarPosition(true);
    }
  },
  mounted() {
    this.activeTool = this.toolslist[0];
    this.initToolBarPosition();
    this.isHide = false;
  },
  methods: {
    ...mapMutations("board", [
      "CLEAR_BOARD",
      "ADD_BOARD",
      "REMOVE_BOARD",
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
      this.initToolBarPosition(true);
    },
    initToolBarPosition(isFix) {
      let el = this.$refs.toolbar;
      if (el) {
        let parentEl = el.parentElement;
        let ph = parentEl.getBoundingClientRect().height;
        let h = el.getBoundingClientRect().height;
        this.top = ph / 2 - h / 2;
        if (!isFix) {
          this.right = 0;
        }

        if (this.toolHight < el.clientHeight) {
          this.toolHight = el.clientHeight;
          this.top = (ph - this.toolHight) / 2;
        }
      }
    },
    checkEdge(right, top) {
      let odiv = this.$refs.toolbar;
      let rect = odiv.getBoundingClientRect();
      let w = rect.width;
      let h = rect.height;
      let prect = odiv.parentElement.getBoundingClientRect();
      let pw = prect.width;
      let ph = prect.height;
      if (right < 0 || top < 0) return true;
      if (right > 0 && right - (pw - w) >= 0) return true;
      if (top > 0 && top - ph + h >= 0) return true;
    },
    toggerTool(item, index) {
      if (item.type === "switch") {
        if (item.name === "hand" && this.isScaleLimit) return;
        this.activeTool = item;
      }
      this.handleSetting(item.name);
    },
    handleSetting(name) {
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
            .catch(() => {});
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
        case "remove":
          this.REMOVE_BOARD();
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
          this.SET_TOOL_DRAG();
          break;
      }
    },
    moveToolbar(e, tool) {
      if (tool.name !== "move") return;
      let odiv = this.$refs.toolbar;
      let disX = e.clientX - odiv.offsetLeft;
      let disY = e.clientY - odiv.offsetTop;
      let el = this.$refs.toolbar;
      if (!el) return;
      let parentEl = el.parentElement;
      let toolbarWidth = el.getBoundingClientRect().width;
      let pw = parentEl.getBoundingClientRect().width;
      document.onmousemove = e => {
        let right = pw - (e.clientX + toolbarWidth - disX);
        let top = e.clientY - disY;
        if (!this.checkEdge(right, top)) {
          this.right = right;
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
  z-index: 99;
  width: 2rem;
  color: #eee;
  @include themeify {
    background-color: themed("background_color3");
  }
  box-shadow: $shadow;
  position: absolute;
  padding: 0.3rem 0;
  text-align: center;
}
.svg-icon {
  padding: 0.4rem;
  @include themeify {
    fill: themed("font_color2");
  }
}
.toolbar-item {
  display: inline-block;
  margin: 0 auto;
  width: 100%;
  outline: none;
  &:hover {
    .svg-icon {
      @include themeify {
        fill: themed("font_color1");
        transform: scale(1.2);
      }
    }
  }
  &:active {
    @include themeify {
      background-color: rgba(themed("color_opposite"), 0.1);
    }
    .svg-icon {
      @include themeify {
        fill: themed("font_color1");
        transform: scale(1.2);
      }
    }
  }
}
.toolbar-item.active {
  @include themeify {
    background-color: rgba(themed("color_opposite"), 0.1);
  }
  .svg-icon {
    @include themeify {
      fill: themed("font_color1");
      transform: scale(1.2);
    }
  }
}
.toolbar-item.disabled svg {
  cursor: not-allowed !important;
}
</style>
