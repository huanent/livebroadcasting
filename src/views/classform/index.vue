<template>
  <div class="signup-page">
    <div class="signup-form">
      <el-form
        ref="classForm"
        :model="classForm"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item :label="$t('classform.pic')" class="img-upload-wrap">
          <el-upload
            action
            :class="[
              {
                'class-upload': avatar.length > 0
              }
            ]"
            list-type="picture-card"
            ref="upload"
            :on-remove="handleRemove"
            :on-change="onFileSelected"
            accept="image/*"
            :auto-upload="false"
            :data="{ username: classForm.username }"
          >
            <icon name="add" :size="20" color="#0a818c"></icon>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
        <el-form-item prop="title" :label="$t('classform.title')">
          <el-input v-model="classForm.title"></el-input>
        </el-form-item>
        <el-form-item prop="description" :label="$t('classform.description')">
          <el-input type="textarea" v-model="classForm.description"></el-input>
        </el-form-item>
        <el-form-item prop="startTime" :label="$t('classform.startTime')">
          <div class="block">
            <el-date-picker
              v-model="classForm.startTime"
              type="datetime"
              placeholder="选择开始时间"
              :editable="false"
              value-format="timestamp"
            >
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item prop="endTime" :label="$t('classform.endTime')">
          <div class="block">
            <el-date-picker
              v-model="classForm.endTime"
              type="datetime"
              placeholder="选择结束时间"
              :editable="false"
              value-format="timestamp"
            >
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('classForm')">
            {{ $t("classformm.submit") }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { classCreate } from "@api/class";
import { liveBroadcastService } from "@/core/live-broadcast/live-broadcast-service";

export default {
  name: "ClassForm",
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
      dialogImageUrl: "",
      dialogVisible: false,
      avatar: "",
      fullClassImg: "",
      classForm: {
        avatar: "",
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        file: ""
      },
      rules: {
        title: [
          {
            required: true,
            message: this.$t("classform.titletips"),
            trigger: "change"
          }
        ],
        description: [
          {
            required: true,
            message: this.$t("classform.descriptiontips"),
            trigger: "change"
          }
        ],
        startTime: [
          {
            required: true,
            message: this.$t("classform.startTimetips"),
            trigger: "change"
          }
        ],
        endTime: [
          {
            required: true,
            message: this.$t("classform.endTimetips"),
            trigger: "change"
          }
        ]
      }
    };
  },
  created() {},
  methods: {
    onSubmit(formName) {
      this.classForm.avatar = `userId\\${
        liveBroadcastService.userId
      }\\date\\${parseInt(new Date().getTime())}\\${this.fullClassImg}`;
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.classForm.startTime >= this.classForm.endTime) {
            this.$message.error("结束时间不得早于开始时间");
            this.classForm.endTime = "";
            return;
          }
          var formData = new FormData();
          formData.append("userId", liveBroadcastService.userId);
          formData.append("roomId", liveBroadcastService.roomId);
          formData.append("avatar", this.classForm.avatar);
          formData.append("title", this.classForm.title);
          formData.append("description", this.classForm.description);
          formData.append("startTime", this.classForm.startTime);
          formData.append("endTime", this.classForm.endTime);
          formData.append(
            "file",
            this.classForm.file.raw,
            this.classForm.file.name
          );
          classCreate(formData)
            .then(res => {
              if (res.data.success) {
                this.$message.success(res.data.message);
                this.$router.push({ path: "/my" });
              } else {
                this.$refs.upload.clearFiles();
                this.avatar = "";
                this.$message.error(res.data.message);
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    },
    handleRemove(file, fileList) {
      this.avatar = "";
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
      if (file) {
        let reader = new FileReader();
        reader.addEventListener(
          "load",
          () => {
            this.fullClassImg = file.name;
            this.avatar = reader.result;
            this.classForm.file = file;
          },
          false
        );
        reader.readAsDataURL(file.raw);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.signup-page {
  width: 100%;
  .signup-form {
    position: absolute;
    top: 10%;
    left: 50%;
    transform: translateX(-50%);
    padding: 2rem 1.5rem 1rem;
    width: 450px;
    background: $white;
    border-radius: 2px;
    border: 1px solid #e7eaed;
    box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.1);
    -webkit-box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.1);
    @media screen and (max-width: 767px) {
      width: 80%;
      max-width: 450px;
    }
  }
}
.avatar-add {
  width: 60px;
  height: 60px;
  border: 2px solid #0a818c;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
