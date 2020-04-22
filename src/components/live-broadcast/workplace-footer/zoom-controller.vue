<template>
  <div class="zoom-controller">
    <icon
      name="minus-circle"
      color="#737882"
      :size="14"
      @click.native.stop="handleMinus"
    />
    <span>{{ zoomParam | NumToPercent }}</span>
    <icon
      name="plus-circle"
      color="#737882"
      :size="14"
      @click.native.stop="handleAdd"
    />
  </div>
</template>

<script>
export default {
  name: "ZoomController",
  data() {
    return {
      zoomParam: 1,
      rate: 0.5,
      max: 4,
      min: 1
    };
  },
  filters: {
    NumToPercent(num) {
      num = Number(num);
      if (num <= 0 || isNaN(num)) {
        return "0%";
      } else {
        return Math.round(num * 100) + "%";
      }
    }
  },
  methods: {
    handleMinus() {
      if (this.zoomParam <= 1) {
        return;
      }
      this.zoomParam -= this.rate;
    },
    handleAdd() {
      if (this.zoomParam >= 4) {
        return;
      }
      this.zoomParam += this.rate;
    }
  }
};
</script>

<style lang="scss" scoped>
.zoom-controller {
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
  }
  > svg {
    &:hover {
      fill: #dcebeb !important;
    }
  }
}
</style>
