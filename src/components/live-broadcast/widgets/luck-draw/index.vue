<template>
  <div>
    <widget-window nameWidget="抽奖" v-if="false">
      <div class="contain">
        <div class="content">
          <div class="line"></div>
          <ul ref="ul" :class="{ isanimate: isexist }">
            <li v-for="(item, index) in students" :key="index">
              <div class="stu_name">{{ item }}</div>
            </li>
          </ul>
        </div>
        <el-button
          size="mini "
          type="primary"
          @click="luckClick"
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

export default {
  name: "App",
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
  methods: {
    luckClick() {
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
<style scoped>
.contain {
  width: 200px;
  height: 150px;
  background: #54555d;
  color: red;
  position: relative;
  box-sizing: border-box;
  padding-top: 36px;
}

.content {
  width: 200px;
  height: 30px;
  font-weight: 500;
  background: #54555d;
  color: #000;
  position: relative;
  overflow: hidden;
  text-align: center;
}
.content .line {
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
ul {
  height: 30px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.contain .btn {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  margin: auto;
}
ul > li {
  font-size: 20px;
  height: 30px;
  width: 100%;
}

.isanimate {
  animation: rotate 0.5s normal linear infinite backwards;
}
.stu_name {
  border-radius: 2px;
  background: #eee;
  /* padding-left: 9px; */
  letter-spacing: 10px;
  width: 120px;
  height: 30px;
  display: inline-block;
}
.pause {
  animation: none;
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
.el-button {
  background: #018a8c;
  width: 160px;
  padding-bottom: 5px;
  font-size: 14px;
}
</style>
