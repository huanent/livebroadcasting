<template>
  <div class="toolbar">
    <ul ref="toolbarul">
      <li
        @click.prevent="shapeBoxIsshow = true"
        @mouseleave="shapeBoxIsshow = false"
      >
        <a><svg-icon icon-class="pen" :size="21" color="#b4b4b5"/></a>
        <span class="toolHover">形状</span>
        <div
          class="shapeBox"
          v-if="shapeBoxIsshow"
          @mouseleave="shapeBoxIsshow = false"
        >
          <div class="block">
            <el-slider v-model="thickness"></el-slider>
          </div>
          <div>
            <ul class="shapeSelect">
              <li>
                <a><svg-icon icon-class="line2" :size="24" color="#b4b4b5"/></a>
              </li>
              <li>
                <a
                  ><svg-icon icon-class="curve2" :size="24" color="#b4b4b5"
                /></a>
              </li>
              <li>
                <a
                  ><svg-icon icon-class="circle" :size="24" color="#b4b4b5"
                /></a>
              </li>
              <li>
                <a
                  ><svg-icon icon-class="rectangle" :size="24" color="#b4b4b5"
                /></a>
              </li>
            </ul>
          </div>
          <div>
            <el-color-picker v-model="shapecolor"></el-color-picker>
          </div>
        </div>
      </li>
      <li
        @click.prevent="textBoxIsshow = true"
        @mouseleave="textBoxIsshow = false"
      >
        <a><svg-icon icon-class="text2" :size="27" color="#b4b4b5"/></a>
        <span class="toolHover">文本</span>
        <div
          class="shapeBox"
          v-if="textBoxIsshow"
          @mouseleave="textBoxIsshow = false"
        >
          <div class="block">
            <el-slider v-model="fontSize"></el-slider>
          </div>
          <div>
            <el-color-picker v-model="textcolor"></el-color-picker>
          </div>
        </div>
      </li>
      <li>
        <a><svg-icon icon-class="laserPen2" :size="27" color="#b4b4b5"/></a>
        <span class="toolHover">激光笔</span>
      </li>
      <li>
        <a><svg-icon icon-class="eraser4" :size="24" color="#b4b4b5"/></a>
        <span class="toolHover">橡皮擦</span>
      </li>
      <li>
        <a><svg-icon icon-class="revoke3" :size="24" color="#b4b4b5"/></a>
        <span class="toolHover">撤销</span>
      </li>
      <li>
        <a><svg-icon icon-class="recovery2" :size="24" color="#b4b4b5"/></a>
        <span class="toolHover">返回</span>
      </li>
      <li>
        <a><svg-icon icon-class="clear" :size="21" color="#b4b4b5"/></a>
        <span class="toolHover">清空</span>
      </li>
      <li>
        <a><svg-icon icon-class="add" :size="27" color="#b4b4b5"/></a>
        <span class="toolHover">新建</span>
      </li>
      <li @mousedown="moveToolbar($event)">
        <a><svg-icon icon-class="move" :size="24" color="#b4b4b5"/></a>
        <span class="toolHover">移动</span>
      </li>

      <!-- <li
        v-for="(item, index) in toolitems"
        :key="index"
        :class="[item.fontawesome, { active: current == index }]"
        @click="addClass(index, $event)"
      >
        <a><svg-icon icon-class="empty" :size="20" color="#b4b4b5"/></a>
      </li> -->
    </ul>
  </div>
</template>

<script>
export default {
  name: "Toolbar",
  data() {
    return {
      thickness: 10,
      fontSize: 10,
      shapecolor: "red",
      textcolor: "#000000",
      shapeBoxIsshow: false,
      textBoxIsshow: false,
      toolHoverIsshow: true,
      // current: 0,
      // toolitems: [
      //   {
      //     icon: "empty",
      //     content: "形状",
      //   },
      //   { icon: "fa fa-envelope", content: "文本" },
      //   { icon: "fa fa-address-book", content: "激光笔" },
      //   { icon: "fa fa-history", content: "橡皮擦" },
      //   { icon: "fa fa-cogs", content: "撤销" },
      //   { icon: "fa fa-cogs", content: "返回" },
      //   { icon: "fa fa-cogs", content: "清空" },
      //   { icon: "fa fa-cogs", content: "新建" },
      // ],
    };
  },
  computed: {},
  components: {
    // ChatRoom,
  },
  methods: {
    // addClass(index, event) {
    //   console.log(index);
    //   console.log(event);
    // },
    moveToolbar(e) {
      console.log(e);
      let odiv = this.$refs.toolbarul;
      let disX = e.clientX - odiv.offsetLeft;
      let disY = e.clientY - odiv.offsetTop;
      document.onmousemove = (e) => {
        let left = e.clientX - disX;
        let top = e.clientY - disY;
        this.positionX = top;
        this.positionY = left;
        odiv.style.left = left + "px";
        odiv.style.top = top + "px";
      };
      document.onmouseup = (e) => {
        console.log(e);
        document.onmousemove = null;
        document.onmouseup = null;
      };
    },
  },
};
</script>
<style lang="scss" scoped>
.svg-bold {
  font-weight: 100;
}
.toolbar {
  > ul {
    position: absolute;
    width: 50px;
    float: left;
    background-color: rgba(33, 35, 37, 0.8);
    left: 1000px;
    color: white;
    > li {
      position: relative;
      width: 30px;
      height: 30px;
      padding: 10px;
      cursor: pointer;
      text-align: center;
      .shapeBox {
        text-align: center;
        padding: 10px;
        .shapeSelect {
          li {
            float: left;
            padding: 5px;
          }
        }
        position: absolute;
        right: 50px;
        top: -10px;
        width: 150px;
        background-color: rgba(33, 35, 37, 1);
      }
      &:visited .toolHover {
        visibility: hidden;
      }
      &:hover .toolHover {
        visibility: visible;
      }

      .toolHover {
        visibility: hidden;
        transition: all 0.15s ease;
        position: absolute;
        top: 10px;
        right: 50px;
        white-space: nowrap;
        padding: 2px 6px;
        height: 20px;
        line-height: 20px;
        font-size: 12px;
        color: #fff;
        background: rgba(0, 0, 0, 0.8);
        border-radius: 2px;
      }
    }
  }
}
</style>
