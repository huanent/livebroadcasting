<template>
  <div class="question-item">
    <el-input placeholder="请输入选项内容" size="small" v-model="item.detail">
      <template slot="append" v-if="removable">
        <el-button @click="$emit('remove')">
          <icon class="svg-icon" :size="14" name="trash2"></icon>
        </el-button>
      </template>
    </el-input>
    <el-checkbox v-model="item.isTrue">正确答案</el-checkbox>
  </div>
</template>
<script>
export default {
  name: "QuestionItem",
  props: ["item", "removable"]
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
.el-checkbox {
  position: absolute;
  bottom: -25px;
  left: 5px;
}
</style>
