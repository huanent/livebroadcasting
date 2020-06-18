<template>
  <svg
    :class="{ 'svg-icon': hasClass }"
    aria-hidden="true"
    :style="{ width: innerSize, height: innerSize, fill: color }"
  >
    <use :xlink:href="iconName" />
  </svg>
</template>

<script>
export default {
  name: "Icon",
  props: {
    name: {
      type: String,
      required: true
    },
    size: {
      type: [Number, String],
      default: 20
    },
    color: {
      type: String
    }
  },
  data() {
    return {
      hasClass: true
    };
  },
  computed: {
    iconName() {
      return `#icon-${this.name}`;
    },
    innerSize() {
      if (Number.isNaN(Number(this.size))) return this.size;
      return this.size + "px";
    }
  }
};
</script>

<style lang="scss" scoped>
.svg-icon {
  cursor: pointer;
  outline: none;
  display: inline-block;
  fill: none;
  vertical-align: middle;
  overflow: hidden;
}
</style>
