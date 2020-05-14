<template>
  <div class="widgets">
    <timer-widget />
    <clicker-widget />
    <dice-widget/>
  </div>
</template>
<script>
import TimerWidget from "./timer-widget/index";
import ClickerWidget from "./clicker-widget/index";
import DiceWidget from "./dice-widget/index";

export default {
  components: {
    TimerWidget,
    ClickerWidget,
    DiceWidget
  }
};
</script>
