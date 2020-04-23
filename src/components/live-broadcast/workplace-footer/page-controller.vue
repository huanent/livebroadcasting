<template>
  <div class="page-controller">
    <icon
      name="chevron-circle-left"
      color="#737882"
      :size="14"
      @click.native.stop="handleMinus"
    />
    <span
      >{{ d_pageNum + "/" }}<em>{{ pageTotal }}</em></span
    >
    <icon
      name="chevron-circle-right"
      color="#737882"
      :size="14"
      @click.native.stop="handleAdd"
    />
  </div>
</template>

<script>
export default {
  name: "PageController",
  props: {
    pageTotal: {
      type: Number,
      require: true
    },
    pageNum: {
      type: Number,
      require: true
    }
  },
  data() {
    return {
      d_pageNum: this.pageNum
    };
  },
  filters: {},
  methods: {
    handleMinus() {
      if (this.d_pageNum <= 1) {
        return;
      }
      this.d_pageNum -= 1;
    },
    handleAdd() {
      if (this.d_pageNum === this.pageTotal) {
        return;
      }
      this.d_pageNum += 1;
    }
  },
  watch: {
    d_pageNum(value) {
      this.$emit("update:page-num", value);
    }
  }
};
</script>

<style lang="scss" scoped>
.page-controller {
  width: 80px;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 5px;
  color: #8a9099;
  font-size: 14px;
  > span {
    user-select: none;
    display: inline-block;
    vertical-align: middle;
    font-size: 14px;
    padding: 0 4px;
    > em {
      font-style: normal;
      color: #4f5359;
    }
  }
  > svg {
    &:hover {
      fill: #dcebeb !important;
    }
  }
}
</style>
