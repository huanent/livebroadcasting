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
  props: ["item", "removable"],
};
</script>

<style lang="scss" scoped>
.question-item {
  display: flex;
  padding: 0 5px;
  span {
    font-size: 20px;
  }
  .el-checkbox {
    bottom: -35px;
    left: 27px;
    color: white;
    /deep/ .el-checkbox__input {
      .el-checkbox__inner {
        background-color: transparent;
      }
      &.is-checked {
        + .el-checkbox__label {
          color: #ffffff;
        }
        .el-checkbox__inner {
          background-color: transparent;
          border-color: white;
        }
      }
    }
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
