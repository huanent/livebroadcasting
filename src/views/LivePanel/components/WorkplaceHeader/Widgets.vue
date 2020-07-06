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
        <li v-for="item in applications">
          <a class="app-wrapper" @click="onClick(item)">
            <img :src="'assets/images/applications-center-icon/timer.png'" />

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
    closeWidgets() {
      this.$emit("update:visible", false);
    }
  },
  data() {
    return {
      applications: [
        {
          name: "定时器",
          imgUrl:
            "../../../../assets/images/applications-center-icon/timer.png",
          stateName: "timer"
        },
        {
          name: "骰子",
          imgUrl: "../../../../assets/images/applications-center-icon/dice.png",
          stateName: "dice"
        },
        {
          name: "幸运转盘",
          imgUrl: "../../../../assets/images/applications-center-icon/lick.png",
          stateName: "rush"
        },
        {
          name: "随堂测试",
          imgUrl:
            "../../../../assets/images/applications-center-icon/timer.png",
          stateName: "clicker"
        },
        {
          name: "抢答器",
          imgUrl: "../../../../assets/images/applications-center-icon/rush.png",
          stateName: "rush"
        },
        {
          name: "花名册",
          imgUrl:
            "../../../../assets/images/applications-center-icon/roster.png",
          stateName: "register"
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

  padding: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 2rem;
  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
  li {
    width: 100%;
    height: 100%;
  }
}

/deep/ .el-dialog__body {
  padding: 2rem 1rem;
}

.app-wrapper:hover {
  box-shadow: $shadow;
}
.app-wrapper {
  width: 100px;
  height: 100px;

  align-items: center;
  justify-content: center;
  color: #fff;

  text-align: center;
  cursor: pointer;
  img {
    margin: 0 auto;
    padding: 0.5rem 0 0 0;
    width: 70%;
    object-fit: contain;
  }
  span {
    margin: 0.25rem 0;
    font-size: 0.5rem;
    color: #8a8a8a;
  }
}
</style>
