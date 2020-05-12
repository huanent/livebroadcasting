<template>
  <div class="widgets">
    <timer-widget />
    <clicker-widget />
  </div>
</template>
<script>
import TimerWidget from "./timer-widget/index";
import ClickerWidget from "./clicker-widget/index";
export default {
  components: {
    TimerWidget,
    ClickerWidget
  }
};
</script>
