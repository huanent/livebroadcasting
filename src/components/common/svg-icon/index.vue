<template>
  <svg
    :class="{ 'svg-icon': hasClass }"
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
      type: [Number, String],
      default: 20,
    },
    color: {
      type: String,
    },
  },
  data() {
    return {
      hasClass: true,
    };
  },
  computed: {
    iconName() {
      return `#icon-${this.name}`;
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
