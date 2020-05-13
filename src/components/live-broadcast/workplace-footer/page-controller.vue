<template>
  <div class="page-controller">
    <icon
      name="chevron-circle-left"
      color="#737882"
      :size="14"
      :class="{ 'no-drop': role === ROLE.STUDENT }"
      @click.native.stop="handleMinus"
    />
    <span
      >{{ pageNum + "/" }}<em>{{ pageTotal }}</em></span
    >
    <icon
      name="chevron-circle-right"
      color="#737882"
      :size="14"
      :class="{ 'no-drop': role === ROLE.STUDENT }"
      @click.native.stop="handleAdd"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "PageController",
  props: {},
  computed: {
    ...mapState("account", ["role"]),
    pageTotal() {
      return this.$store.state.workplace.boardTotalPage;
    },
    pageNum() {
      return this.$store.state.workplace.boardNumber;
    }
  },
  methods: {
    async handleMinus() {
      if (this.pageNum <= 1) {
        return;
      }
      this.$store.commit("workplace/BOARD_NUMBER_DECREASE");
    },
    async handleAdd() {
      if (this.pageNum === this.pageTotal) {
        return;
      }
      this.$store.commit("workplace/BOARD_NUMBER_INCREASE");
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
  > svg.no-drop {
    cursor: no-drop !important;
    &:hover {
      fill: rgb(115, 120, 130) !important;
    }
  }
}
</style>
