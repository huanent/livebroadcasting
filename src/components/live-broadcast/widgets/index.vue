<template>
  <div class="widgets">
    <timer-widget />
    <clicker-widget />
    <dice-widget/>
    <luck-draw/>
    <rush-answer/>
  </div>
</template>
<script>
import TimerWidget from "./timer-widget/index";
import ClickerWidget from "./clicker-widget/index";
import DiceWidget from "./dice-widget/index";
import LuckDraw from "./luck-draw/index"
import RushAnswer from "./rush-answer/index"

export default {
  components: {
    TimerWidget,
    ClickerWidget,
    DiceWidget,
    LuckDraw,
    RushAnswer
  }
};
</script>
