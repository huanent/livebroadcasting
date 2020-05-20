<template>
  <div>
    <widget-window
      @close="SET_DRAW_VISIBLE(false)"
      nameWidget="幸运转盘"
      :position="draw.position"
      v-if="draw.visible"
      @moved="UPDATE_POSITION({ name: 'draw', position: $event })"
    >
      <div class="contain">
        <div class="content">
          <div class="line"></div>
          <ul ref="ul" :class="{ isanimate: isexist }">
            <li v-for="(item, index) in students" :key="index">
              <div class="stu_name">{{ item }}</div>
            </li>
          </ul>
        </div>
      </div>
      <div class="btnClick">
        <el-button
          v-if="role == ROLE.TEACHER"
          size="mini "
          type="primary"
          @click="start"
          class="btn"
          :disabled="disabled"
          >开始</el-button
        >
      </div>
    </widget-window>
  </div>
</template>
<script>
import WidgetWindow from "../widget-window";
import { mapState, mapMutations } from "vuex";
import { ROLE } from "../../../../models/role";

export default {
  name: "LuckDraw",
  data() {
    return {
      students: ["小明名", "小李", "小吴", "小林", "小莉", "小文", "小强"],
      isexist: false,
      disabled: false,
      reallength: 0
    };
  },
  components: {
    WidgetWindow
  },
  computed: {
    ...mapState("widget", ["draw"]),
    ...mapState("account", ["role"]),
    ...mapState("workplace", "featuresList")
  },
  methods: {
    ...mapMutations("widget", ["SET_DRAW_VISIBLE"]),
    start() {
      // 判断学生人数是否大于5人，不够5人随机填充人数
      if (this.students.length < 5) {
        this.reallength = this.students.length;
        for (let i = 0; i < 5; i++) {
          if (!this.students[i])
            this.students[i] = this.students[
              Math.floor(Math.random() * this.reallength)
            ];
        }
      }
      let ul = this.$refs.ul;
      this.isexist = true;
      this.disabled = true;
      setTimeout(() => {
        this.disabled = false;
        this.isexist = false;
        ul.style.marginTop =
          -Math.floor(
            Math.random() *
              (this.reallength ? this.reallength : this.students.length)
          ) *
            30 +
          "px";
      }, 2000);
    }
  }
};
</script>
<style lang="scss" scoped>
.contain {
  width: 200px;
  height: 100px;
  background: #54555d;
  position: relative;
  box-sizing: border-box;
  padding-top: 36px;
  .content {
    height: 30px;
    font-weight: 500;
    background: #54555d;
    color: #000;
    position: relative;
    overflow: hidden;
    text-align: center;
    .line {
      width: 120px;
      left: 0;
      right: 0;
      position: absolute;
      height: 1px;
      top: 0;
      bottom: 0;
      margin: auto;
      opacity: 0.2;
      background: #000;
    }
    .stu_name {
      border-radius: 2px;
      background: #eee;
      letter-spacing: 10px;
      width: 120px;
      height: 30px;
      display: inline-block;
    }
  }
}

ul {
  height: 30px;
  list-style: none;
  margin: 0;
  padding: 0;
  li {
    font-size: 20px;
    height: 30px;
    width: 100%;
  }
}

.btnClick {
  text-align: center;
  background: #54555d;
  padding-bottom: 10px;
  .el-button {
    background: #018a8c;
    width: 160px;
    padding-bottom: 5px;
    font-size: 14px;
  }
}
.isanimate {
  animation: rotate 0.5s normal linear infinite backwards;
}

@keyframes rotate {
  0% {
    margin-top: 0;
  }
  50% {
    margin-top: -60px;
  }
  100% {
    margin-top: -120px;
  }
}
</style>
