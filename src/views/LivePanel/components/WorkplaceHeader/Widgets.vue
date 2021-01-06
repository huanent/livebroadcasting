<template>
  <div class="widgets">
    <CustomDialog
      :title="'应用中心'"
      :secondary-title="'Application Center'"
      :visible.sync="widgetVisible"
      :size="'mini'"
      :append-to-body="true"
    >
      <ul class="widgets-content">
        <li v-for="item in applications" :key="item.name">
          <a class="app-wrapper" @click="onClick(item)">
            <img :src="item.imgUrl" />

            <span>{{ item.name }}</span>
          </a>
        </li>
      </ul>
    </CustomDialog>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import CustomDialog from "@/components/custom-dialog";
export default {
  name: "Widgets",
  props: {
    visible: Boolean
  },
  methods: {
    ...mapMutations("widget", [
      "SET_TIMER_VISIBLE",
      "SET_DICE_VISIBLE",
      "SET_DRAW_VISIBLE",
      "SET_CLICKER_VISIBLE",
      "SET_RUSH_VISIBLE",
      "SET_VISIBLE"
    ]),
    onClick(item) {
      this[item.action]({ name: item.stateName, visible: true });
      this.$emit("update:visible", false);
    },
    closeWidgets() {
      this.$emit("update:visible", false);
    }
  },
  data() {
    return {
      applications: [
        {
          name: "定时器",
          imgUrl: require("../../../../assets/images/applications-center-icon/timer.png"),
          stateName: "timer",
          action: "SET_TIMER_VISIBLE"
        },
        {
          name: "骰子",
          imgUrl: require("../../../../assets/images/applications-center-icon/dice.png"),
          stateName: "dice",
          action: "SET_DICE_VISIBLE"
        },
        {
          name: "幸运转盘",
          imgUrl: require("../../../../assets/images/applications-center-icon/lick.png"),
          stateName: "rush",
          action: "SET_DRAW_VISIBLE"
        },
        {
          name: "随堂测试",
          imgUrl: require("../../../../assets/images/applications-center-icon/exam.png"),
          stateName: "clicker",
          action: "SET_CLICKER_VISIBLE"
        },
        {
          name: "抢答器",
          imgUrl: require("../../../../assets/images/applications-center-icon/rush.png"),
          stateName: "rush",
          action: "SET_RUSH_VISIBLE"
        },
        {
          name: "花名册",
          imgUrl: require("../../../../assets/images/applications-center-icon/roster.png"),
          stateName: "register",
          action: "SET_VISIBLE"
        }
      ]
    };
  },
  computed: {
    widgetVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit("update:visible", val);
      }
    }
  },
  components: {
    CustomDialog
  }
};
</script>
<style scoped lang="scss">
.widgets-content {
  flex-wrap: wrap;
  align-items: center;
  justify-items: center;
  justify-content: space-between;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
  li {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
}

.app-wrapper:hover {
  box-shadow: $shadow;
}
.app-wrapper {
  width: 100px;
  height: 100px;
  text-align: center;
  cursor: pointer;
  margin-bottom: 2rem;
  img {
    margin: 0.625rem auto;
    width: 80%;
    object-fit: contain;
  }
  span {
    font-size: 0.875rem;
    color: #1a1b29;
  }
}
</style>
