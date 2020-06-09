import Hammer from "hammerjs";
export default {
  //  定义一个对象
  install(Vue, options) {
    // 需要拥有一个 install 方法
    function vueTouch(el, type, binding) {
      this.el = el;
      this.type = type;
      this.binding = binding;
      let hammer = new Hammer(this.el);
      hammer.on(this.type, this.binding.value);
      return hammer;
    }
    Vue.directive("tap", {
      bind: function(el, binding) {
        new vueTouch(el, "tap", binding);
      }
    });
    Vue.directive("swipe", {
      bind: function(el, binding) {
        new vueTouch(el, "swipe", binding);
      }
    });
    Vue.directive("swipeleft", {
      bind: function(el, binding) {
        new vueTouch(el, "swipeleft", binding);
      }
    });
    Vue.directive("swiperight", {
      bind: function(el, binding) {
        new vueTouch(el, "swiperight", binding);
      }
    });
    Vue.directive("swipeup", {
      bind: function(el, binding) {
        let hammer = new vueTouch(el, "swipeup", binding);
        hammer.get("swipe").set({
          direction: Hammer.DIRECTION_ALL
        });
      }
    });
    Vue.directive("swipedown", {
      bind: function(el, binding) {
        let hammer = new vueTouch(el, "swipedown", binding);
        hammer.get("swipe").set({
          direction: Hammer.DIRECTION_ALL
        });
      }
    });
  }
};
