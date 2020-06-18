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
import TimerWidget from "./TimerWidget";
import ClickerWidget from "./ClickerWidget";
import DiceWidget from "./DiceWidget";
import LuckDraw from "./LuckDraw";
import RushAnswer from "./RushAnswer";
import VideoWidget from "./VideoWidget";
import AwardWidget from "./AwardWidget";
import Register from "./Register";

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
