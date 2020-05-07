<template>
  <el-dialog :visible="visible" :show-close="false" width="600px">
    <ul>
      <li
        v-for="(item, index) in sources"
        :key="index"
        :style="{ outlineColor: selected == item ? 'red' : '#ddd' }"
      >
        <item :source="item" @selected="selected = $event"></item>
      </li>
    </ul>
    <span slot="footer" class="dialog-footer">
      <el-button @click.stop="$emit('update:visible', false)">{{
        cancelText
      }}</el-button>
      <el-button
        type="primary"
        @click.stop="streamSelected"
        :disabled="!selected"
      >
        {{ okText }}
      </el-button>
    </span>
  </el-dialog>
</template>
<script>
import Item from "./item.vue";
export default {
  props: {
    visible: {
      default: false
    },
    okText: {
      default: "确 定"
    },
    cancelText: {
      default: "取 消"
    }
  },
  data() {
    return {
      sources: [],
      selected: null
    };
  },
  components: {
    Item
  },
  methods: {
    async streamSelected() {
      const stream = await rtcService.getStream(this.selected.id);
      this.$emit("selected", stream);
      this.$emit("update:visible", false);
    }
  },
  watch: {
    async visible(value) {
      if (value) {
        this.selected = null;
        this.sources = await rtcService.getSources();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
li {
  display: inline-block;
  margin: 10px;
  outline: 5px solid #ddd;
}
</style>
