<template>
  <window class="settings">
    <ul class="toolbar" ref="toolbar">
      <li
        v-show="!hideTool"
        v-for="(item, index) in toolslist"
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
    </ul>
  </window>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import ShapeBox from "../Toolbar/ShapeBox";
import TextBox from "../Toolbar/TextBox";
import window from "./Window";
export default {
  name: "BoardToolbar",
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
        }
      ],
      offsetRight: 0,
      offsetTop: 0,
      originRight: 0,
      originTop: 0,
      offset: 0,
      isHide: true
    };
  },
  components: {
    ShapeBox,
    TextBox,
    window
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
    /*  this.activeTool = this.toolslist[0];
    this.initToolBarPosition();
    this.isHide = false;*/
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
        this.originTop = ph / 2 - h / 2;
        if (!isFix) {
          this.originRight = 0;
        }

        if (this.toolHight < el.clientHeight) {
          this.toolHight = el.clientHeight;
          this.originTop = (ph - this.toolHight) / 2;
        }
      }
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
    }
  }
};
</script>
<style lang="scss" scoped>
.settings {
  display: flex;
  flex-wrap: wrap;
  position: fixed;
  width: 8rem;
  right: 4rem;
  top: 30%;
  & > * {
    padding: 0.5rem;
    width: 2rem;
    flex-grow: 1;
  }
}
.toolbar {
  z-index: 99;
  width: 2rem;
  color: #eee;
  max-height: 65%;
  text-align: left;
  @include themeify {
    background-color: themed("toolbar_bg");
  }
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
  padding: 0.3rem 0;
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
  width: 2rem;
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
