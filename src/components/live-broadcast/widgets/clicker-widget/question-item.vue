<template>
  <div class="question-item">
    <el-input placeholder="请输入选项内容" size="small">
      <template slot="append">
        <a @click="$emit('remove')">
          <icon class="svg-icon" :size="14" name="trash2"></icon>
        </a>
      </template>
    </el-input>
  </div>
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
<style lang="scss" scoped>
.svg-icon {
  fill: #888;
}
</style>
