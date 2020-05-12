<template>
  <div class="controller">
    <a @click="up">
      <icon name="angle-up" class="btn" :size="20" v-if="controllable"></icon>
    </a>
    <div class="text">{{ value }}</div>
    <a @click="down">
      <icon name="angle-down" class="btn" :size="20" v-if="controllable"></icon>
    </a>
  </div>
</template>
<script>
export default {
  props: ["value", "max", "controllable"],
  methods: {
    down() {
      this.$emit("input", this.value > 0 ? this.value - 1 : this.max);
    },
    up() {
      this.$emit("input", this.value < this.max ? this.value + 1 : 0);
    }
  }
};
</script>
<style lang="scss" scoped>
.controller {
  div {
    width: 30px;
    font-size: 30px;
    text-align: center;
  }
  a {
    margin: 0 auto;
    text-align: center;
  }
  .btn {
    fill: #eee;
  }
  .text {
    background: #eee;
    padding: 5px 0;
    border-radius: 2px;
    user-select: none;
  }
}
</style>
