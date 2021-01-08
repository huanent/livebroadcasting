<template>
  <div class="award" v-if="award.visible">
    <div class="award-content">
      <h1>表现突出，特与表扬！</h1>
      <div class="img-wrapper">
        <img src="@/assets/images/jiangli@2x.png" alt="奖励" />
      </div>
      <h2>{{ award.name }}</h2>
    </div>
    <div class="award-img">
      <img src="@/assets/images/qingzhu@2x.png" alt="庆祝" />
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "AwardWidget",
  computed: {
    ...mapState("widget", ["award"]),
    ...mapState("device", ["isMobile"]),
  },
  methods: {
    ...mapMutations("widget", ["SET_AWARD"]),
  },
  watch: {
    "award.visible"(value) {
      if (!value) return;
      setTimeout(() => {
        this.SET_AWARD({
          visible: false,
        });
      }, 3000);
    },
  },
};
</script>
<style lang="scss" scoped>
.award {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000000;
  background: #e1effa;
  cursor: crosshair;
  img {
    max-width: 100%;
    width: 100%;
  }
  .award-content {
    width: 590px;
    margin: 60px auto;
    background: #ffffff;
    border-radius: 8px;
    padding: 20px 20px 40px;
    text-align: center;
  }
  .award-img {
    max-width: 898px;
    margin: 0 auto;
  }
  .img-wrapper {
    max-width: 126px;
    margin:0 auto;
  }
  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: #506efa;
    margin-bottom: 30px;
  }

  h2 {
    font-size: 1.5rem;
    font-weight: 400;
    color: #1a1b29;
    margin-top: 25px;
  }
}
</style>
