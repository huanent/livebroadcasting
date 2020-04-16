<template>
  <svg
    :class="svgClass"
    aria-hidden="true"
    :style="{ width: size + 'px', height: size + 'px', fill: color }"
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
      required: true,
    },
    size: {
      type: Number,
      default: 20,
    },
    color: {
      type: String,
      default: "currentColor",
    },
    class: {
      type: String,
      default: "",
    },
  },
  computed: {
    iconName() {
      return `#icon-${this.name}`;
    },
    svgClass() {
      return this.class ? "svg-icon " + this.class : "svg-icon";
    },
  },
};
</script>

<style lang="scss" scoped>
.svg-icon {
  display: inline-block;
  fill: none;
  vertical-align: middle;
  overflow: hidden;
}
</style>
