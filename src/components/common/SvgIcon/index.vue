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
  name: "SvgIcon",
  props: {
    iconClass: {
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
    className: {
      type: String,
      default: "",
    },
  },
  computed: {
    iconName() {
      return `#icon-${this.iconClass}`;
    },
    svgClass() {
      if (this.className) {
        return "svg-icon " + this.className;
      } else {
        return "svg-icon";
      }
    },
  },
};
</script>

<style scoped>
.svg-icon {
  display: inline-block;
  fill: none;
  vertical-align: middle;
  overflow: hidden;
}
</style>
