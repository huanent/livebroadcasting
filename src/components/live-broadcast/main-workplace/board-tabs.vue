<template>
  <div class="board-tabs">
    <div class="board-tabs-header">
      <div
        class="tab-item"
        v-for="(item, i) in datas"
        :key="i"
        @click="switchTab(i, item)"
        :class="{ 'tab-item-active': d_activeIndex === i }"
        v-show="showLable"
      >
        <span class="board-tab-title-container">{{ item.title }}</span>
        <span @click="onClose(item, i)" class="board-tab-icon-container">
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
    <div class="tab-body">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { Multiselect } from "vue-multiselect";
import { mapState, mapMutations } from "vuex";
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
      caretIconName: "settings",
      selected: undefined,
      options: [
        {
          title: "White board",
          type: "board"
        },
        {
          title: "Share screen",
          type: "screen"
        },
        {
          title: "Push camera",
          type: "camera"
        }
      ]
    };
  },
  computed: {
    ...mapState("account", ["role"]),
    ...mapState("features", ["canClickboardTabs"])
  },
  mounted() {
    this.init();
    this.selectOptionByType(this.panelType);
  },
  watch: {
    activeIndex(value) {
      this.d_activeIndex = value;
    },
    d_activeIndex(newVal, oldVal) {
      if (this.tabItemList[oldVal]) {
        this.tabItemList[oldVal].isActive = false;
      }
      if (this.tabItemList[newVal]) {
        this.tabItemList[newVal].isActive = true;
      }
      this.$emit("index-change", newVal);
      this.$emit("active-index", newVal);
    },
    panelType(type) {
      this.options.forEach(item => {
        if (item.type === type) {
          this.selected = item;
        }
      });
    }
  },
  methods: {
    switchTab(index) {
      if (!this.canClickboardTabs) return;
      this.d_activeIndex = index;
    },
    selectOptionByType(type) {
      this.selected = this.options.find(item => {
        if (item.type === type) {
          return true;
        }
      });
    },
    onClose(item, i) {
      this.datas.splice(i, 1);
      this.$emit("on-close", item, i);
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

.tab-body {
}
.tab-item {
  padding: 0.3rem;
  height: 1.2rem;
  display: inline-block;
  cursor: pointer;
}
.tab-item:hover {
  @include themeify {
    background: themed("background_color4");
  }
  background-color: #141414;
}
.board-tabs-header {
  @include themeify {
    background: themed("background_color2");
  }
  border-bottom: rgba(30, 33, 37, 0.19) 1px solid;
  width: 100%;
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
    color: themed("color_opposite");
  }
  background-color: #1a1b1d;
}

.workplace-settings {
  float: right;
  justify-content: center;
  text-align: left;
  width: 7.5rem;
  margin-right: 2rem;
  line-height: 1.8rem;
  .type-text {
    color: #ffffff;
    font-size: 14px;
    width: 100%;
  }
  .select-header {
    text-align: left;
    z-index: 100;
    background-color: none;
    padding: 0 0.5rem;
    cursor: pointer;
    span {
      padding-right: 0.5rem;
    }
  }
  .select-option {
    z-index: 100;
    padding: 0 1.5rem 0 0.5rem;
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
