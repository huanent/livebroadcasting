<template>
  <div class="page-controller">
    <icon
      name="chevron-circle-left"
      color="#737882"
      :size="14"
      @click.native.stop="handleMinus"
    />
    <span
      >{{ pageNum + "/" }}<em>{{ pageTotal }}</em></span
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
  data() {
    return {
      pageTotal: 45,
      pageNum: 31
    };
  },
  filters: {},
  methods: {
    handleMinus() {
      if (this.pageNum <= 1) {
        return;
      }
      this.pageNum -= 1;
    },
    handleAdd() {
      if (this.pageNum === this.pageTotal) {
        return;
      }
      this.pageNum += 1;
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
