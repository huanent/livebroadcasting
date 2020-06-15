import { mount } from "@vue/test-utils";
import ChatroomMessage from "@/components/live-broadcast/Chatroom/ChatroomMessage.vue";

describe("ChatroomMessage.vue组件", () => {
  it("测试ChatroomMessage组件能否正常显示并增加", () => {
    const wrapper = mount(ChatroomMessage, {
      methods: {
        $t: () => ""
      }
    });
    // expect(wrapper.find('p').text()).toBe(0);
    // wrapper.find('button').trigger('click');
    // expect(wrapper.find('p').text()).toBe(1);
  });
});
