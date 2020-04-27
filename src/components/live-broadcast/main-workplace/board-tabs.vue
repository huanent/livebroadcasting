<template>
  <div class="board-tabs">
    <div class="board-tabs-header">
      <div
        class="tab-item"
        v-for="(item, i) in datas"
        :key="i"
        @click="switchTab(i, item)"
        :class="{ 'tab-item-active': d_activeIndex === i }"
      >
        <span class="board-tab-title-container">{{ item.title }}</span>
        <span @click="onClose(item, i)" class="board-tab-icon-container">
          <icon class="board-tab-icon" name="times" :size="12"></icon>
        </span>
      </div>
    </div>
    <div class="tab-body">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "BoardTabs",
  props: {
    datas: {},
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      tabItemList: [],
      d_activeIndex: this.activeIndex
    };
  },
  mounted() {
    this.init();
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
    onClose(item, i) {
      this.datas.splice(i, 1);
      this.$emit("on-close", item, i);
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
  background-color: #141414;
}
.tab-item > span:hover {
  color: #0a818c;
}
.board-tabs-header {
  background-color: #212224;
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
  background-color: #1a1b1d;
}
</style>
