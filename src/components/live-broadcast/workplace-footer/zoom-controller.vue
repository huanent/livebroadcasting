<template>
  <div class="zoom-controller">
    <icon
      name="minus-circle"
      color="#737882"
      :size="14"
      :class="{ 'no-drop': role === 'ROLE_STUDENT' }"
      @click.native.stop="handleMinus"
    />
    <span>{{ zoomParam | NumToPercent }}</span>
    <icon
      name="plus-circle"
      color="#737882"
      :size="14"
      :class="{ 'no-drop': role === 'ROLE_STUDENT' }"
      @click.native.stop="handleAdd"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "ZoomController",
  data() {
    return {
      rate: 0.5,
      max: 400,
      min: 100
    };
  },
  computed: {
    ...mapGetters("account", ["role"]),
    zoomParam() {
      return this.$store.state.workplace.boardScale;
    }
  },
  filters: {
    NumToPercent(num) {
      num = Number(num);
      if (num <= 0 || isNaN(num)) {
        return "0%";
      } else {
        return Math.round(num * 100) / 100 + "%";
      }
    }
  },
  methods: {
    handleMinus() {
      if (this.zoomParam <= this.min || this.role === "ROLE_STUDENT") {
        return;
      }
      this.$store.commit(
        "workplace/BOARD_SCALE_DECREASE",
        this.zoomParam * this.rate
      );
    },
    handleAdd() {
      if (this.zoomParam >= this.max || this.role === "ROLE_STUDENT") {
        return;
      }
      this.$store.commit(
        "workplace/BOARD_SCALE_INCREASE",
        this.zoomParam * this.rate * 2
      );
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
  > svg.no-drop {
    cursor: no-drop !important;
    &:hover {
      fill: rgb(115, 120, 130) !important;
    }
  }
}
</style>
