<template>
  <el-dialog :visible="visible" :show-close="false" width="600px">
    <h3>屏幕</h3>
    <ul>
      <li
        v-for="(item, index) in screenSources"
        :key="index"
        :class="{
          'stream-source': true,
          'stream-source-active': selected == item
        }"
      >
        <source-item :source="item" @selected="selected = $event"></source-item>
      </li>
    </ul>
    <h3>窗口</h3>
    <ul>
      <li
        v-for="(item, index) in windowSources"
        :key="index"
        :class="{
          'stream-source': true,
          'stream-source-active': selected === item
        }"
      >
        <source-item :source="item" @selected="selected = $event"></source-item>
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
import SourceItem from "./SourceItem";
export default {
  name: "StreamSourceDialog",
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
  computed: {
    screenSources() {
      const result = [];

      this.sources
        .filter(f => f.id.startsWith("screen"))
        .forEach((item, index) => {
          result.push({
            id: item.id,
            name: "屏幕 " + index + 1,
            thumbnail: item.thumbnail,
            title: item.name
          });
        });

      return result;
    },
    windowSources() {
      const result = [];

      this.sources
        .filter(f => f.id.startsWith("window"))
        .forEach((item, index) => {
          result.push({
            id: item.id,
            name: "窗口 " + index + 1,
            thumbnail: item.thumbnail,
            title: item.name
          });
        });

      return result;
    }
  },
  components: {
    SourceItem
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
}
.stream-source {
  box-shadow: 0 0 5px rgba(75, 75, 75, 0.5);
}
.stream-source:hover {
  transform: scale(1.03);
  box-shadow: 0 0 7px rgba(75, 75, 75, 0.5);
}
.stream-source-active {
  transform: scale(1.03);
  @include themeify {
    box-shadow: 0 0 10px themed("primary");
  }
}
</style>
