<template>
  <div class="widgets">
    <el-dialog title="应用中心" :visible.sync="widgetVisible" :append-to-body="true">
      <ul class="widgets-content">
        <li>
          <a @click="onOpenQuestion">答题器</a>
        </li>
      </ul>
    </el-dialog>
    <question :visible.sync="questionVisible"></question>
  </div>
</template>

<script>
import Question from "../question";
export default {
  name: "Widgets",
  props: {
    visible: Boolean
  },
  data() {
    return {
      questionVisible: false
    };
  },
  methods: {
    onOpenQuestion() {
      this.questionVisible = true;
      this.closeWidgets();
    },
    closeWidgets() {
      this.$emit("update:visible", false);
    }
  },
  computed: {
    widgetVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit("update:visible", val);
      }
    }
  },
  components: {
    Question
  }
};
</script>
<style scoped lang="scss">
.widgets-content {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  li {
    flex: 20% 0 0;
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    a {
      width: 80px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: green;
      color: #fff;
      border-radius: 50%;
      cursor: pointer;
    }
  }
}
</style>