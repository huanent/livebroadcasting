<template>
  <div class="chatroom-container">
    <div class="chatroom-body">
      <ul class="chatroom-msg-list">
        <li class="chatroom-msg own-msg">
          <div class="chatroom-msg__hd">
            <i
              class="tic-icon tic-icon-custom"
              style='background-image: url("https://main.qcloudimg.com/raw/92352bcabfc5fc4bc5e867d63c93c74c.jpg");'
            ></i>
            <div class="chatroom-msg_user">
              <span class="chatroom-msg--name">123</span
              ><span class="chatroom-msg--time">(17:33:52)</span>
            </div>
          </div>
          <div class="chatroom-msg__bd">
            <div class="tic-bubble">
              <div class="tic-bubble-inner">
                1212
              </div>
            </div>
          </div>
        </li>
        <li class="chatroom-msg">
          <div class="chatroom-msg__tips">
            <span class="chatroom-msg--tips">17:30:19 123加入课堂</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="chatroom-footer"></div>
  </div>
</template>

<script>
export default {
  name: "ChatRoom",
};
</script>

<style lang="scss" scoped>
.chatroom-container {
  background-color: $chatroom-bg;
}
</style>
