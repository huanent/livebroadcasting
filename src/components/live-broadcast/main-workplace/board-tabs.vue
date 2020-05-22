<template>
  <div class="board-tabs">
    <div class="board-tabs-header">
      <div
        class="tab-item"
        v-for="(item, i) in fileList"
        :key="i"
        @click="switchTab(item)"
        :class="{ 'tab-item-active': item === currentFile }"
        v-show="showLable"
      >
        <span class="board-tab-title-container">{{ item.title }}</span>
        <span
          @click="onClose(item)"
          class="board-tab-icon-container"
          v-if="canControlBoard"
        >
          <icon class="board-tab-icon" name="times" :size="12"></icon>
        </span>
      </div>
      <div class="workplace-settings">
        <multiselect
          v-if="role !== ROLE.STUDENT"
          v-model="selected"
          ref="select"
          :searchable="false"
          :options="options"
          :allow-empty="false"
          @select="onSelect"
        >
          <template slot="singleLabel" slot-scope="props"
            ><div class="select-header">
              <span>{{ props.option.title }}</span>

              <div
                @mousedown.prevent.stop="toggle()"
                class="multiselect__select"
              >
                <icon :name="caretIconName" size="14"></icon>
              </div>
            </div>
          </template>
          <template slot="option" slot-scope="props">
            <div class="select-option">
              {{ props.option.title }}
            </div>
          </template>
        </multiselect>
        <div v-else class="type-text">
          {{ selected && selected.title }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Multiselect } from "vue-multiselect";
import { mapState, mapMutations } from "vuex";
import { liveBroadcastService } from "../../../core/live-broadcast/live-broadcast-service";
export default {
  name: "BoardTabs",
  props: {
    datas: {},
    activeIndex: {
      type: Number,
      default: 0
    },
    showLable: {},
    panelType: {}
  },
  components: {
    Multiselect
  },
  data() {
    return {
      tabItemList: [],
      d_activeIndex: this.activeIndex,
      caretIconName: "angle-down",
      selected: undefined,
      options: [
        {
          title: this.$t("workplace.whiteBoard"),
          type: "board"
        },
        {
          title: this.$t("workplace.shareScreen"),
          type: "screen"
        },
        {
          title: this.$t("workplace.pushCamera"),
          type: "camera"
        }
      ]
    };
  },
  computed: {
    ...mapState("account", ["role"]),
    ...mapState("features", ["canControlBoard"]),
    ...mapState("board", ["fileList", "currentFile"])
  },
  mounted() {
    this.init();
    this.selectOptionByType(this.panelType);
  },
  watch: {
    panelType(type) {
      this.options.forEach(item => {
        if (item.type === type) {
          this.selected = item;
        }
      });
    }
  },
  methods: {
    switchTab(item) {
      if (!this.canControlBoard) return;
      liveBroadcastService.boardService.switchFile(item);
    },
    selectOptionByType(type) {
      this.selected = this.options.find(item => {
        if (item.type === type) {
          return true;
        }
      });
    },
    onClose(item) {
      liveBroadcastService.boardService.deleteFile(item.fid);
    },
    toggle() {
      this.$refs.select.isOpen = !this.$refs.select.isOpen;
    },
    onSelect(item) {
      this.$emit("type-change", item.type);
    },
    init() {
      let temp = [];
      this.$children.forEach(item => {
        if (item.$options._componentTag === "BoardTabsItem") {
          temp.push(item);
        }
      });
      this.tabItemList = temp;
      if (this.tabItemList.length > 0) {
        this.tabItemList[this.activeIndex].isActive = true;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.board-tabs {
  color: #bfbfbf;
  font-size: small;
  user-select: none;
}
.tab-item {
  padding: 0.3rem;
  height: 1.2rem;
  display: inline-block;
  cursor: pointer;
  &:hover {
    @include themeify {
      background: themed("background_color4");
    }
  }
  &:not(:first-child) {
    margin-left: 0.2rem;
  }
}
.board-tabs-header {
  @include themeify {
    background: themed("background_color2");
  }
  border-bottom: rgba(30, 33, 37, 0.19) 1px solid;
  width: 100%;
  padding-bottom: 0.2rem;
  height: 1.8rem;
}
.board-tab-icon {
  padding: 0 0 0 0.5rem;
  fill: #bfbfbf !important;
}
.board-tab-icon-container {
  padding: 0.2rem 0 0.2rem 0.5rem;
}
.board-tab-title-container {
  padding: 0 0.5rem;
}
.tab-item-active {
  @include themeify {
    background: themed("background_color4");
    color: themed("font_color1");
  }
}

.workplace-settings {
  float: right;
  width: 7.5rem;
  margin-right: 0.25rem;
  line-height: 1.8rem;
  .type-text {
    color: #ffffff;
    font-size: 14px;
    width: 100%;
  }
  .select-header {
    text-align: center;
    z-index: 100;
    @include themeify {
      background: themed("background_color4");
      color: themed("font_color1");
    }
    padding: 0 0.5rem;
    cursor: pointer;
    span {
      padding-right: 0.5rem;
      font-size: 0.9rem;
      letter-spacing: 0.02rem;
    }
  }
  .select-option {
    z-index: 100;
    padding: 0 1rem 0 1.2rem;
    cursor: pointer;
    @include themeify {
      background-color: themed("toolbar_bg");
    }
  }
  .select-option:hover {
    @include themeify {
      background-color: mix(
        themed("color_like"),
        themed("color_opposite"),
        90%
      );
      color: themed("font_color1");
    }
  }
}

/deep/ .svg-icon {
  fill: #bfbfbf;
}
/deep/ .svg-icon:hover {
  fill: #ffffff;
}

/*
cover component Multiselect style
*/
/deep/ .multiselect:focus {
  outline: none;
}
/deep/ .multiselect__content-wrapper {
  position: absolute;
  z-index: 999;
  border-radius: 1px;
  box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.32);
}
/deep/ .multiselect__select {
  float: right;
  line-height: 1.8rem;
}
</style>
