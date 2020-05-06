<template>
  <el-dialog title="答题器" :visible.sync="questionVisible" :append-to-body="true"></el-dialog>
</template>
<script>
export default {
  name: "Question",
  props: {
    visible: Boolean
  },
  data() {
    return {};
  },
  methods: {
    onOpenQuestion() {
      this.questionVisible = true;
    }
  },
  computed: {
    questionVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit("update:visible", val);
      }
    }
  }
};
</script>