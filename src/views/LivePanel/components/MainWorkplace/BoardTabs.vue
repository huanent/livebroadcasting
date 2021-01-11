<template>
  <div class="board-tabs-header">
    <div class="header-left">
      <div
        class="tab-item"
        v-for="(item, i) in fileList"
        :key="i"
        @click="switchTab(item)"
        :class="{ 'tab-item-active': item === currentFile }"
        v-show="showLable"
      >
        <div class="tab-item-text-wrapper">
          <span class="board-tab-title-container">{{ item.title }}</span>
          <span
            @click="onClose(item)"
            class="board-tab-icon-container"
            v-if="canControlBoard"
          >
            <icon class="board-tab-icon" name="times" :size="20"></icon>
          </span>
        </div>
      </div>
    </div>

    <div class="header-right">
      <div class="workplace-settings">
        <multiselect
          v-if="isTeacher"
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
              <icon :name="caretIconName" size="14"></icon>
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
import { mapState, mapMutations, mapGetters } from "vuex";
import { liveBroadcastService } from "@/core/live-broadcast";
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
    ...mapState("workplace", ["cameraPanelVisibity"]),
    ...mapState("features", ["canControlBoard"]),
    ...mapState("board", ["fileList", "currentFile"]),
    ...mapGetters("workplace", ["isTeacher"])
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
.board-tabs-header {
  color: #bfbfbf;
  user-select: none;
  display: flex;
  justify-content: space-between;
  @include themeify {
    background: themed("background_color2");
  }
  width: 100%;
  height: 100%;
}
.header-left {
  width: 80%;
  height: 100%;
  overflow: hidden;
}
.tab-item {
  font-size: smaller;
  height: 100%;
  display: inline-block;
  cursor: pointer;
  box-sizing: border-box;
  overflow: hidden;
  padding: 0.1rem;
  font-size: 0.875rem;
  > .tab-item-text-wrapper {
    height: 100%;
    display: flex;
    align-items: center;
  }
  &:hover {
    @include themeify {
      background: themed("background_color5");
    }
  }
  &:not(:first-child) {
    margin-left: 0.1rem;
  }
}

.board-tab-icon {
  padding: 0 0 0 0.5rem;
  fill: #bfbfbf !important;
}
.board-tab-icon-container {
  padding: 0.2rem;
}
.board-tab-title-container {
  padding: 0 0.2rem;
}
.tab-item-active {
  @include themeify {
    background: themed("background_color5");
    color: themed("font_color1");
  }
}

.workplace-settings {
  margin-right: 1rem;
  text-align: left;
  font-size: smaller;
  .type-text {
    @include themeify {
      color: themed("font_color1");
    }
    letter-spacing: 0.02rem;
    text-align: center;
    width: 100%;
  }
  .select-header {
    z-index: 100;
    padding: 0.1rem;
    white-space: nowrap;
    @include themeify {
      background: themed("background_color2");
      color: themed("font_color1");
    }
    cursor: pointer;
    span {
      padding-right: 0.5rem;
      letter-spacing: 0.02rem;
    }
  }
  .select-option {
    z-index: 100;
    cursor: pointer;
    padding: 0.3rem 0.5rem;
    @include themeify {
      background-color: themed("background_color2");
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
.header-right {
  display: flex;
  align-items: center;
}
</style>
