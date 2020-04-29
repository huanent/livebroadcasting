<template>
  <div class="signup-page">
    <div class="signup-form">
      <el-form
        ref="classForm"
        :model="classForm"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item :label="$t('classform.pic')">
          <el-upload
            action="/api/test"
            :class="[
              {
                'class-upload': avatar.length > 0
              }
            ]"
            list-type="picture-card"
            ref="upload"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-change="onFileSelected"
            :on-success="uploadSuccess"
            :before-upload="beforeUpload"
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
import { LiveBroadcastService } from "../../core/live-broadcast/live-broadcast-service";
export default {
  name: "Signup",
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
      // userId: "",
      // roomId: "",
      dialogImageUrl: "",
      dialogVisible: false,
      avatar: "",
      classForm: {
        userId: "",
        roomId: "",
        avatar: "",
        title: "",
        description: "",
        startTime: "",
        endTime: ""
      },
      rules: {
        title: [
          {
            required: true,
            message: this.$t("signup.usernameTips"),
            trigger: "change"
          }
        ],
        description: [
          {
            required: true,
            message: this.$t("signup.nicknameTips"),
            trigger: "change"
          }
        ],
        startTime: [
          {
            required: true,
            message: this.$t("signup.telTips"),
            trigger: "change"
          }
        ],
        endTime: [
          {
            required: true,
            message: this.$t("signup.telTips"),
            trigger: "change"
          }
        ]
      }
    };
  },
  created() {
    this._data.classForm.userId = window.liveBroadcastService.userId;
    this._data.classForm.roomId = window.liveBroadcastService.roomId;
    console.log(this);
  },
  methods: {
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    uploadSuccess(response, file, fileList) {
      console.log(response);
      this.classForm.avatar = response.model.fullFilename;
    },
    onSubmit(formName) {
      // this.classForm.avatar = `classTitle\\${this.classForm.title}\\img`;
      this.classForm.avatar = `userid\\classTitle\\${this.classForm.title}`;
      console.log(this.classForm.avatar);
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.axios
            .post("/test", this.classForm)
            .then(res => {
              if (res.data.success) {
                this.$refs.upload.submit();
                this.$message.success(res.data.message);
                this.$router.push({ path: "/login" });
              } else {
                this.$refs.upload.clearFiles();
                this.$refs[formName].resetFields();
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
      console.log("选择图片");
      // this.avatar = `classTitle\\${this.classForm.title}\\img\\${file.name}`;
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
      // console.log("filelist.length=%s", filelist.length);
      if (file) {
        let reader = new FileReader();
        reader.addEventListener(
          "load",
          () => {
            this.avatar = reader.result;
          },
          false
        );
        reader.readAsDataURL(file.raw);
      }
    },
    beforeUpload(file) {
      console.log("上传前");
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
/deep/ .el-upload-list__item {
  display: none;
}
/deep/ .class-upload {
  height: 60px;
  /deep/ .el-upload-list__item {
    display: inline-block !important;
  }
  /deep/ .el-upload {
    display: none;
  }
}
/deep/ .el-upload {
  width: 60px;
  height: 60px;
  margin: 0;
  padding: 0;
  svg {
    position: relative;
    left: 0px;
    top: -45px;
  }
}
/deep/ .el-upload-list--picture-card .el-upload-list__item {
  width: 60px;
  height: 60px;
}
</style>
