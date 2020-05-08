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
          v-model="selected"
          ref="select"
          :searchable="false"
          :options="options"
          :allow-empty="false"
          @select="onSelect"
        >
          <template slot="singleLabel" slot-scope="props"
            ><div class="select-header">
              {{ props.option.title }}
            </div>
          </template>
          <template slot="option" slot-scope="props">
            <div class="select-option">
              {{ props.option.title }}
            </div>
          </template>
          <template slot="caret">
            <div @mousedown.prevent.stop="toggle()" class="multiselect__select">
              <icon :name="caretIconName" size="14"></icon>
            </div>
          </template>
        </multiselect>
      </div>
    </div>
    <div class="tab-body">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { Multiselect } from "vue-multiselect";
import { mapGetters, mapMutations } from "vuex";
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
    }
  },
  methods: {
    switchTab(index) {
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
  height: 100%;
  color: #bfbfbf;
  font-size: small;
  user-select: none;
}

.tab-body {
  height: calc(100% - 1.8rem);
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
    color: themed("color_opposite");
  }
  background-color: #141414;
}
.tab-item > span:hover {
  color: #0a818c;
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
.board-tab-icon:hover {
  fill: #0a818c !important;
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
  text-align: center;
  float: right;
  justify-content: center;
  min-width: 100px;
  margin-right: 2rem;
  .select-header,
  .select-option {
    text-align: left;
    z-index: 100;
    padding: 5px 10px 5px 5px;
    color: #bfbfbf;
    @include themeify {
      background: themed("background_color6");
      color: themed("color_opposite");
    }
    background-color: #212224;
  }
  .select-option:hover {
    background-color: rgba(0, 0, 0, 0.8);
    color: #e8f1ff;
    /* border: 1px solid #0a818c;*/
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
  border-radius: 10px;
  box-shadow: 1px 1px 7px rgba(0, 0, 0, 0.32);
  background-color: red;
}
/deep/ .multiselect__select {
  display: inline-block;
  float: right;
}
</style>
