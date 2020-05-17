<template>
  <div class="chatroom-body">
    <ul class="chatroom-msg-list roll-scroll" ref="messageList">
      <li
        v-for="(item, index) in chatMessages"
        :key="index"
        class="chatroom-msg"
        :class="{
          'own-msg': item.username == userInfo.username,
          'teacher-msg': item.isTeacher
        }"
      >
        <span v-if="getTimeMsgVisibility(index)" class="chatroom-msg__time">
          {{ formatTime(item.time, index) }}</span
        >
        <ChatroomMessage :message="item"></ChatroomMessage>
      </li>
    </ul>
  </div>
</template>

<script>
import ChatroomMessage from "./chatroom-message";
import { mapState } from "vuex";

export default {
  name: "ChatroomBody",
  computed: {
    ...mapState("workplace", ["chatMessages"]),
    ...mapState("account", ["userInfo"])
  },
  methods: {
    scrollToCurrent(height) {
      const ele = this.$refs["message-list"].$el;
      if (ele) {
        this.$nextTick(() => {
          const scrollHeight = ele.scrollHeight;
          console.log(height, scrollHeight);
          this.$nextTick(() => {
            ele.scrollTop = scrollHeight - height;
          });
        });
      }
    },
    scrollToBottom() {
      const ele = this.$refs.messageList;
      if (ele) {
        const offsetHeight = ele.offsetHeight;
        const scrollHeight = ele.scrollHeight;
        if (scrollHeight > offsetHeight) {
          this.$nextTick(() => {
            ele.scrollTop = scrollHeight;
          });
        }
      }
    },
    formatTime(time, index) {
      let currenttime = new Date(this.chatMessages[index].time);
      if (index === 0) {
        return this.formatDate(currenttime, "YYYY-MM-dd HH:mm");
      } else {
        let lastTime = new Date(this.chatMessages[index - 1].time);
        let fmt = this.getDiffFormat(currenttime, lastTime);
        if (fmt) {
          return this.formatDate(currenttime, fmt);
        } else {
          return this.formatDate(currenttime, "YYYY-MM-dd HH:mm");
        }
      }
    },
    getDiffFormat(nTime, oTime) {
      let string = "";
      console.log(Math.abs(nTime.getMinutes() - oTime.getMinutes()));
      if (Math.abs(nTime.getFullYear() - oTime.getFullYear()) > 0) {
        return "YYYY-MM-dd HH:mm";
      }
      if (Math.abs(nTime.getMonth() - oTime.getMonth()) > 0) {
        return "MM-dd HH:mm";
      }
      if (Math.abs(nTime.getDate() - oTime.getDate()) > 0) {
        return "MM-dd HH:mm";
      }
      if (Math.abs(nTime.getHours() - oTime.getHours()) > 0) {
        return "HH:mm";
      }
      if (Math.abs(nTime.getMinutes() - oTime.getMinutes()) > 0) {
        return "HH:mm";
      }
    },
    formatDate(date, fmt) {
      let o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "H+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        S: date.getMilliseconds() //毫秒
      };
      if (/(Y+)/.test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt))
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? o[k]
              : ("00" + o[k]).substr(("" + o[k]).length)
          );
      return fmt;
    },
    getTimeMsgVisibility(index) {
      if (index === 0) {
        return true;
      } else {
        let currenttime = new Date(this.chatMessages[index].time);
        let lastTime = new Date(this.chatMessages[index - 1].time);
        if (this.getDiffFormat(currenttime, lastTime)) {
          return true;
        }
      }
    }
  },
  components: {
    ChatroomMessage
  },
  watch: {
    chatMessages() {
      this.scrollToBottom();
    }
  }
};
</script>

<style lang="scss" scoped>
.chatroom-body {
  padding-bottom: 20px;
  height: 100%;
  overflow: auto;
  scroll-behavior: smooth;
  .chatroom-msg-list {
    height: calc(100% - 60px);
    overflow: auto;
    scroll-behavior: smooth;
  }
}

.chatroom-msg-list {
  height: calc(100% - 60px);
  .load-more {
    color: #839494;
    margin-top: 15px;
    padding: 0 10px 10px;
    > div {
      cursor: pointer;
      display: flex;
      width: 100px;
      align-items: center;
      justify-content: space-around;
      margin: 0 auto;
    }
  }
}

.chatroom-msg__time {
  display: block;
  color: #8a9099;
  font-size: x-small;
  text-align: center;
}
</style>
