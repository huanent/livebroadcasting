<template>
  <div class="shape-box">
    <div class="block">
      <el-slider v-model="thickness"></el-slider>
    </div>
    <div>
      <ul class="shape-select">
        <li
          v-for="(item, index) in toolitems"
          :key="index"
          :class="[{ active: toolitemscurrent == index }]"
          @click="addToolitemClass(index)"
        >
          <a
            >{{ item.index
            }}<icon :name="item.name" :size="item.size" color="#b4b4b5"
          /></a>
        </li>
      </ul>
    </div>
    <div ref="colorpck">
      <el-color-picker v-model="shapecolor" size="mini"></el-color-picker>
    </div>
  </div>
</template>
<script>
export default {
  name: "ShapeBox",
  data() {
    return {
      shapecolor: "red",
      toolitemscurrent: 0,
      thickness: 10,
      toolitems: [
        {
          name: "line2",
          size: 18
        },
        {
          name: "curve2",
          size: 18
        },
        {
          name: "circle",
          size: 18
        },
        {
          name: "rectangle",
          size: 18
        }
      ]
    };
  },
  mounted: function() {
    this.$nextTick(function() {
      this.$refs.colorpck.children[0].children[0].style.border = "none";
    });
  },
  methods: {
    addToolitemClass(index) {
      this.toolitemscurrent = index;
    }
  }
};
</script>
<style lang="scss" scoped>
.svg-bold {
  font-weight: 100;
}
.shape-box {
  text-align: center;
  padding: 10px;
  position: absolute;
  right: 50px;
  top: 0;
  width: 150px;
  background-color: rgba(33, 35, 37, 0.8);
  .shape-select {
    text-align: center;
    padding-left: 5px;
    & :hover {
      background-color: black;
    }
    li {
      text-align: center;
      float: left;
      width: 20px;
      height: 20px;
      line-height: 20px;
      padding: 3px;
      margin-bottom: 5px;
    }
  }
}
.active {
  background-color: black;
}
</style>
