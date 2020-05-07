<template>
  <ul>
    <li
      v-for="(item, index) in sources"
      :key="index"
      width="30%"
      :style="{ outlineColor: selected == item ? 'red' : '#ddd' }"
    >
      <item :source="item" @selected="$emit('update:selected', $event)"></item>
    </li>
  </ul>
</template>
<script>
import Item from "./item.vue";
export default {
  props: ["selected"],
  data() {
    return {
      sources: []
    };
  },
  async mounted() {
    this.sources = await rtcService.getSources();
    console.log(this.sources);
  },
  components: {
    Item
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
