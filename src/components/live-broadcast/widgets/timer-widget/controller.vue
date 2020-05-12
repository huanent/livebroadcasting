<template>
  <div class="controller">
    <a @click="up">
      <icon name="angle-up" class="btn" :size="20" v-if="controllable"></icon>
    </a>
    <div>{{ value }}</div>
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
      if (this.value > 0) this.$emit("input", this.value - 1);
    },
    up() {
      if (this.value < this.max) this.$emit("input", this.value + 1);
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
    fill: #528a99;
  }
}
</style>
