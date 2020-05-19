<template>
  <div class="my-class-head">
    <div class="head-wrap">
      <div class="head-left">
        <a>
          <img
            v-if="userInfo && userInfo.avatar"
            :src="
              'http://livebroadcasting.jinrui.kooboo.site' + userInfo.avatar
            "
            :alt="$t('class.avatar')"
          />
          <img
            v-else
            src="../../assets/images/avatar.jpg"
            :alt="$t('class.avatar')"
          />
        </a>
        <div class="head-text">
          <h2>{{ userInfo.nickname }}</h2>
          <p>{{ $t("text.motto") }}</p>
        </div>
      </div>
      <!-- <a>
        head-right
      </a> -->
    </div>
  </div>
</template>

<script>
export default {
  name: "MyClassHead",
  props: {
    userInfo: Object
  },
  data() {
    return {
      value: ""
    };
  }
};
</script>

<style lang="scss" scoped>
.my-class-head {
  background-image: linear-gradient(45deg, #6bd5c7, #dcecb1);
  height: 190px;
  max-width: 1920px;
  width: 100%;
  margin: 0 auto;
  color: $white;
  .head-wrap {
    width: 1205px;
    margin: 0 auto;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .head-left {
      display: flex;
      align-items: center;
      .head-text {
        padding-left: 20px;
        h2 {
          margin-bottom: 6px;
          font-size: 20px;
        }
      }
      > a {
        border-radius: 80px;
        height: 80px;
        width: 80px;
        overflow: hidden;
        border: 4px solid rgba(250, 250, 250, 0.6);
        img {
          height: 100%;
          width: 100%;
        }
      }
    }
  }
}
</style>
