<template>
  <el-dialog
    title="编辑题目"
    :visible.sync="editVisible"
    :append-to-body="true"
  >
    <div class="edit-content" v-if="editVisible">
      <el-form :model="editForm" ref="editForm" label-width="100px">
        <el-form-item
          prop="title"
          label="题目"
          :rules="{ required: true, message: '请输入题目' }"
        >
          <tinymce
            ref="editor"
            v-model="editForm.title"
            :height="100"
          ></tinymce>
        </el-form-item>

        <el-form-item
          v-for="(option, index) in editForm.options"
          :label="getOptionLabel(index)"
          :key="option.key"
          :prop="'options.' + index + '.value'"
          :rules="{ required: true, message: '请输入选项' }"
        >
          <tinymce v-model="option.value" :height="50"></tinymce>
          <div class="edit-tools">
            <el-switch
              v-model="option.correctAnswer"
              active-text="正确答案"
            ></el-switch>
            <el-button
              v-show="canRemoveOption"
              @click.prevent="removeOption(index)"
              size="small"
              >移除选项</el-button
            >
          </div>
        </el-form-item>
        <el-form-item v-show="canAddOption">
          <el-button @click="addOption">新增选项</el-button>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">关闭</el-button>
      <el-button type="primary" @click="submitForm">保存</el-button>
    </span>
  </el-dialog>
</template>
<script>
import Tinymce from "../../common/tinymce";
import { mapActions, mapGetters } from "vuex";
const indexToLetter = index => String.fromCharCode("A".charCodeAt(0) + index);
const emptyOption = {
  value: "",
  correctAnswer: false
};
export default {
  name: "QuestionEdit",
  props: {
    visible: Boolean,
    currentEdit: Object
  },
  data() {
    return {
      editForm: {
        title: "",
        options: []
      }
    };
  },
  methods: {
    ...mapActions("examination", ["save"]),
    getOptionLabel(index) {
      return "选项 " + indexToLetter(index);
    },
    submitForm() {
      this.$refs.editForm.validate(async valid => {
        if (valid) {
          const options = [],
            answers = [];
          this.editForm.options.forEach((item, index) => {
            options.push(item.value);
            if (item.correctAnswer) {
              answers.push(indexToLetter(index));
            }
          });
          const result = await this.save({
            _id: this.currentEdit._id,
            userId: "test",
            title: this.editForm.title,
            options: options,
            answers: answers
          });
          if (result.data.success) {
            this.$notify({
              title: "提示",
              message: "保存成功",
              type: "success"
            });
            this.$emit("afterSave");
            this.close();
          } else {
            this.$notify.error({
              title: "错误",
              message: "保存失败"
            });
          }
        } else {
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.editForm.resetFields();
    },
    removeOption(index) {
      this.editForm.options.splice(index, 1);
    },
    addOption() {
      this.editForm.options.push({
        value: ""
      });
    },
    close() {
      this.$emit("update:visible", false);
    }
  },
  computed: {
    editVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit("update:visible", val);
      }
    },
    canRemoveOption() {
      return this.editForm.options.length > 2;
    },
    canAddOption() {
      return this.editForm.options.length < 26;
    }
  },
  watch: {
    "currentEdit.key": function(val) {
      if (this.currentEdit._id) {
        this.editForm.title = this.currentEdit.title;
        this.editForm.options = this.currentEdit.options.map((item, index) => {
          let option = { ...emptyOption };
          option.value = item;
          option.correctAnswer =
            this.currentEdit.answer.indexOf(indexToLetter(index)) > -1;
          return option;
        });
      } else {
        this.editForm.title = "";
        this.editForm.options = [{ ...emptyOption }, { ...emptyOption }];
        this.editForm.answer = "";
      }
    }
  },
  components: {
    Tinymce
  }
};
</script>
<style lang="scss" scoped>
.edit-tools {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}
</style>
