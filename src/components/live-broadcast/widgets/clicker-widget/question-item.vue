<template>
  <li>
    <div class="question-item">
      <span
        :style="{ color: isTrue ? 'green' : 'red' }"
        @click="$emit('update:is-true', !isTrue)"
        >{{ label }}:</span
      >
      <template>
        <el-input
          size="mini"
          :value="detail"
          @input="$emit('update:detail', e.value)"
        />
        <span @click="$emit('remove')" v-if="erasable">-</span>
      </template>
    </div>
  </li>
</template>
<script>
export default {
  props: ["label", "detail", "erasable", "isTrue"]
};
</script>

<style lang="scss" scoped>
.question-item {
  display: flex;
  padding: 3px 5px;
  span {
    font-size: 20px;
  }
}
</style>
