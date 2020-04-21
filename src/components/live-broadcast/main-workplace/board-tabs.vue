<template>
  <div class="board-tabs">
    <div class="board-tabs-header" id="test">
      <div
        class="tab-item"
        v-for="(item, i) in lables"
        :key="i"
        :class="{ 'tab-item-active': d_activeIndex === i }"
      >
        <span @click="switchTab(i, item)" class="board-tab-title-container">{{
          item
        }}</span>
        <span @click="onClose(i, item)" class="board-tab-icon-container">
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
    lables: {},
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

    let targetNode = document.querySelector(`#test`);

    // Options for the observer (which mutations to observe)
    let config = {
      attributes: true,
      childList: true,
      subtree: true
    };
    const mutationCallback = mutationsList => {
      for (let mutation of mutationsList) {
        let type = mutation.type;
        switch (type) {
          case "childList":
            console.log("A child node has been added or removed.");
            break;
          case "attributes":
            console.log(
              `The ${mutation.attributeName} attribute was modified.`
            );
            break;
          case "subtree":
            console.log(`The subtree was modified.`);
            break;
          default:
            break;
        }
      }
    };
    let observer = new MutationObserver(mutationCallback);

    observer.observe(targetNode, config);

    /*    observer.disconnect();*/
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
    }
  },
  methods: {
    switchTab(index) {
      this.d_activeIndex = index;
    },
    onClose(i, item) {
      this.lables.splice(i, 1);
      this.$emit("on-close", { index: i, item });
      this.$emit("lables", this.lables);
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
  height: 100%;
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
