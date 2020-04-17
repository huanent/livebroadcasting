<template>
  <ul ref="toolbarul" class="not-tool">
    <li
      v-for="(item2, index) in toolslist2"
      :key="index"
      :class="[{ toolactive: toolslistcurrent2 == index }]"
      @mousedown="
        moveToolbar(index, $event);
        mousedownClass(index);
      "
      @mouseup="toolslistcurrent2 = -1"
    >
      <a
        >{{ item2.index
        }}<icon :name="item2.name" :size="item2.size" color="#b4b4b5"
      /></a>
      <span class="tool-hover">{{ item2.tips }}</span>
    </li>
  </ul>
</template>
<script>
export default {
  name: "ActionTools",
  data() {
    return {
      toolslistcurrent2: -1,
      toolslist2: [
        {
          name: "revoke3",
          size: 18,
          tips: this.$t("toolbar.revoke")
        },
        {
          name: "recovery2",
          size: 18,
          tips: this.$t("toolbar.recovery")
        },
        {
          name: "clear",
          size: 18,
          tips: this.$t("toolbar.clear")
        },
        {
          name: "add",
          size: 24,
          tips: this.$t("toolbar.add")
        },
        {
          name: "move",
          size: 18,
          tips: this.$t("toolbar.move")
        }
      ]
    };
  },
  methods: {
    mousedownClass(index) {
      this.toolslistcurrent2 = index;
    },
    moveToolbar(index, e) {
      if (index == 4) {
        console.log(e);
        let odiv = this.$parent.$refs.toolbarul;
        let disX = e.clientX - odiv.offsetLeft;
        let disY = e.clientY - odiv.offsetTop;
        document.onmousemove = e => {
          let left = e.clientX - disX;
          let top = e.clientY - disY;
          this.positionX = top;
          this.positionY = left;
          odiv.style.left = left + "px";
          odiv.style.top = top + "px";
        };
        document.onmouseup = e => {
          console.log(e);
          document.onmousemove = null;
          document.onmouseup = null;
        };
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.not-tool {
  box-sizing: content-box;
  position: absolute;
  width: 50px;
  float: left;
  background-color: rgba(33, 35, 37, 0.8);
  color: white;
  .tool-actived {
    background-color: black;
  }
  > li {
    position: relative;
    width: 30px;
    height: 30px;
    line-height: 28px;
    padding: 0;
    margin-bottom: 10px;
    margin-left: 10px;
    margin-right: 10px;
    cursor: pointer;
    text-align: center;
    &:hover .tool-hover {
      visibility: visible;
    }
    &:hover {
      background-color: black;
    }
  }
}
.toolactive {
  background-color: black;
  box-shadow: 0 0 0 2px #b4b4b5 inset;
}

.tool-hover {
  visibility: hidden;
  transition: all 0.15s ease;
  position: absolute;
  top: 5px;
  left: 40px;
  white-space: nowrap;
  padding: 2px 6px;
  height: 20px;
  line-height: 20px;
  font-size: 12px;
  color: #fff;
  background: rgba(0, 0, 0, 0.8);
}
</style>
