<template>
  <el-dialog
    :title="$t('class.createClass')"
    :visible.sync="createFormVisible"
    v-loading="loading"
  >
    <el-form
      ref="classCreateForm"
      :model="classForm"
      :rules="rules"
      label-width="80px"
    >
      <el-form-item :label="$t('class.pic')" class="img-upload-wrap">
        <el-upload
          action
          :class="[
            {
              'class-upload': fileList.length > 0
            }
          ]"
          list-type="picture-card"
          ref="upload"
          :on-remove="handleRemove"
          :on-change="onFileSelected"
          accept="image/*"
          :auto-upload="false"
          :file-list="fileList"
        >
          <icon name="add" :size="20" color="#0a818c"></icon>
        </el-upload>
      </el-form-item>
      <el-form-item prop="title" :label="$t('class.title')">
        <el-input v-model="classForm.title"></el-input>
      </el-form-item>
      <el-form-item prop="description" :label="$t('class.description')">
        <el-input type="textarea" v-model="classForm.description"></el-input>
      </el-form-item>
      <el-form-item prop="startTime" :label="$t('class.startTime')">
        <div class="block">
          <el-date-picker
            v-model="classForm.startTime"
            type="datetime"
            :placeholder="$t('class.startTimetips')"
            :editable="false"
            value-format="timestamp"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </div>
      </el-form-item>
      <el-form-item prop="endTime" :label="$t('class.endTime')">
        <div class="block">
          <el-date-picker
            v-model="classForm.endTime"
            type="datetime"
            :placeholder="$t('class.endTimetips')"
            :editable="false"
            value-format="timestamp"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="onSubmit('classCreateForm')">
        {{ $t("button.submit") }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import classApi from "@api/class";

export default {
  name: "ClassCreate",
  data() {
    var validateEmail = (rule, value, callback) => {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      if (!value) {
        return callback(this.$t("signup.emailTips"));
      }

      if (mailReg.test(value)) {
        callback();
      } else {
        callback(this.$t("signup.emailRightTips"));
      }
    };
    var validatePassword = (rule, value, callback) => {
      if (value === "") {
        callback(this.$t("signup.passwordTips"));
      } else {
        if (this.classForm.repeatPassword !== "") {
          this.$refs.classForm.validateField("validateRepeatPassword");
        }
        callback();
      }
    };
    var validateRepeatPassword = (rule, value, callback) => {
      if (value === "") {
        callback(this.$t("signup.RepeatPasswordTips"));
      } else if (value !== this.classForm.password) {
        callback(this.$t("signup.sameTips"));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      createFormVisible: false,
      classForm: {
        avatar: "",
        title: "",
        description: "",
        startTime: "",
        endTime: ""
      },
      fileList: [],
      rules: {
        title: [
          {
            required: true,
            message: this.$t("class.titletips"),
            trigger: "change"
          }
        ],
        description: [
          {
            required: true,
            message: this.$t("class.descriptiontips"),
            trigger: "change"
          }
        ],
        startTime: [
          {
            required: true,
            message: this.$t("class.startTimetips"),
            trigger: "change"
          }
        ],
        endTime: [
          {
            required: true,
            message: this.$t("class.endTimetips"),
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    open() {
      this.createFormVisible = true;
    },
    onSubmit(formName) {
      const userId = localStorage.getItem("lb_userId");

      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.classForm.startTime >= this.classForm.endTime) {
            this.$message.error("结束时间不得早于开始时间");
            this.classForm.endTime = "";
            this.loading = false;
            return;
          }
          var formData = new FormData();
          formData.append("userId", userId);
          formData.append("title", this.classForm.title);
          formData.append("description", this.classForm.description);
          formData.append("startTime", this.classForm.startTime);
          formData.append("endTime", this.classForm.endTime);
          if (this.fileList[0] && this.fileList[0].raw) {
            formData.append(
              "files",
              this.fileList[0].raw,
              this.fileList[0].name
            );
          }
          classApi
            .classCreate(formData)
            .then(res => {
              if (res.data.success) {
                this.$message.success(res.data.message);
                this.createFormVisible = false;
                this.$emit("createSuccess");
                this.loading = false;
              } else {
                this.$refs.upload.clearFiles();
                this.$message.error(res.data.message);
                this.loading = false;
              }
            })
            .catch(err => {
              console.log(err);
              this.loading = false;
            });
        }
      });
    },
    handleRemove(file, fileList) {
      this.fileList = [];
    },
    handleCancel() {
      this.resetForm("classCreateForm");
      this.createFormVisible = false;
    },
    resetForm: function(formName) {
      this.$refs[formName].resetFields();
    },
    onFileSelected(file, filelist) {
      const isIMAGE =
        file.raw.type === "image/jpeg" || file.raw.type === "image/png";
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isIMAGE) {
        this.$message.error("只能上传jpg/png图片!");
        return false;
      }
      if (!isLt1M) {
        this.$message.error("上传文件大小不能超过 1MB!");
        return false;
      }
      this.fileList.push(file);
    }
  }
};
</script>
