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
      hammer.get("pan").set({ direction: Hammer.DIRECTION_ALL });
      hammer.get("swipe").set({ direction: Hammer.DIRECTION_VERTICAL });
      return hammer;
    }
    let tapList = [{ name: "tap" }];
    let swipeList = [
      { name: "swipe" },
      { name: "swipeleft" },
      { name: "swiperight" },
      {
        name: "swipeup"
      },
      {
        name: "swipedown"
      }
    ];
    let panList = [
      { name: "pan" },
      { name: "panstart" },
      { name: "panmove" },
      { name: "panend" },
      { name: "pancancel" }
    ];
    let list = [{ name: "pressup" }];

    list = list.concat(tapList);
    list = list.concat(swipeList);
    list = list.concat(panList);
    list.forEach(item => {
      Vue.directive(item.name, {
        bind: function(el, binding) {
          let hammer = new vueTouch(el, item.name, binding);
          if (item.bindAfter) {
            item.bindAfter(hammer);
          }
        }
      });
    });
  }
};
