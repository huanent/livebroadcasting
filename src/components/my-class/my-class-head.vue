<template>
  <div class="my-class-head">
    <div class="head-wrap">
      <div class="head-left">
        <a>
          <img :src="avatar" alt="头像" />
        </a>
        <div class="head-text">
          <h2>{{ nickname }}，下午好</h2>
          <p>知识的价值不在于占有，而在于使用。</p>
        </div>
      </div>
      <!-- <a>
        head-right
      </a> -->
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "MyClassHead",
  data() {
    return {
      value: ""
    };
  },
  computed: {
    ...mapGetters("account", ["nickname", "avatar_url"]),
    avatar() {
      return this.avatar_url
        ? this.avatar_url
        : "../../assets/images/avatar.jpg";
    }
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
