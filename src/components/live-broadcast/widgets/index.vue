<template>
  <div class="widgets">
    <timer-widget />
    <clicker-widget />
    <dice-widget />
    <luck-draw />
    <rush-answer />
    <video-widget />
    <award-widget />
    <register />
  </div>
</template>
<script>
import TimerWidget from "./timer-widget/index";
import ClickerWidget from "./clicker-widget/index";
import DiceWidget from "./dice-widget/index";
import LuckDraw from "./luck-draw/index";
import RushAnswer from "./rush-answer/index";
import VideoWidget from "./video-widget/index";
import AwardWidget from "./award-widget/index";
import Register from "./register/index";

export default {
  components: {
    TimerWidget,
    ClickerWidget,
    DiceWidget,
    LuckDraw,
    RushAnswer,
    VideoWidget,
    AwardWidget,
    Register
  }
};
</script>
